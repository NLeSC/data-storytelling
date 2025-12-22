/**
 * Google Gemini API client for story generation
 */

import type { StoryGenerationRequest } from '$lib/types/story';
import type { StorySettings } from '$lib/types/settings';
import { getSystemPrompt, buildUserPrompt } from '$lib/utils/prompts';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeminiError {
	error: {
		code: number;
		message: string;
		status: string;
	};
}

export interface GeminiResponse {
	candidates: Array<{
		content: {
			parts: Array<{ text: string }>;
			role: string;
		};
		finishReason: string;
	}>;
	usageMetadata?: {
		promptTokenCount: number;
		candidatesTokenCount: number;
		totalTokenCount: number;
	};
}

/**
 * Generate a story using Gemini API (non-streaming)
 */
export async function generateStory(
	request: StoryGenerationRequest,
	settings: StorySettings
): Promise<string> {
	if (!settings.geminiApiKey) {
		throw new Error('Gemini API key is not configured. Please set it in Settings.');
	}

	const model = settings.model;
	const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${settings.geminiApiKey}`;

	const systemPrompt = getSystemPrompt(
		request.audience,
		settings.customPrompts[request.audience]
	);
	const userPrompt = buildUserPrompt(request);

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [
				{
					role: 'user',
					parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
				}
			],
			generationConfig: {
				temperature: settings.temperature,
				maxOutputTokens: settings.maxTokens,
				topP: 0.95,
				topK: 40
			}
		})
	});

	if (!response.ok) {
		const errorData = (await response.json()) as GeminiError;
		const message = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
		throw new Error(message);
	}

	const data = (await response.json()) as GeminiResponse;

	if (!data.candidates || data.candidates.length === 0) {
		throw new Error('No response generated. The model may have filtered the content.');
	}

	const text = data.candidates[0]?.content?.parts?.[0]?.text;
	if (!text) {
		throw new Error('Empty response from Gemini API');
	}

	return text;
}

/**
 * Generate a story using Gemini API with streaming
 * Yields text chunks as they arrive
 */
export async function* generateStoryStream(
	request: StoryGenerationRequest,
	settings: StorySettings
): AsyncGenerator<string, void, unknown> {
	if (!settings.geminiApiKey) {
		throw new Error('Gemini API key is not configured. Please set it in Settings.');
	}

	const model = settings.model;
	const url = `${GEMINI_API_BASE}/${model}:streamGenerateContent?key=${settings.geminiApiKey}&alt=sse`;

	const systemPrompt = getSystemPrompt(
		request.audience,
		settings.customPrompts[request.audience]
	);
	const userPrompt = buildUserPrompt(request);

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [
				{
					role: 'user',
					parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
				}
			],
			generationConfig: {
				temperature: settings.temperature,
				maxOutputTokens: settings.maxTokens,
				topP: 0.95,
				topK: 40
			}
		})
	});

	if (!response.ok) {
		let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
		try {
			const errorData = (await response.json()) as GeminiError;
			errorMessage = errorData.error?.message || errorMessage;
		} catch {
			// Use default error message
		}
		throw new Error(errorMessage);
	}

	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error('Response body is not readable');
	}

	const decoder = new TextDecoder();
	let buffer = '';

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			// Parse SSE format: data: {...}\n\n
			const lines = buffer.split('\n');

			// Keep the last incomplete line in the buffer
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const jsonStr = line.slice(6).trim();
					if (jsonStr && jsonStr !== '[DONE]') {
						try {
							const data = JSON.parse(jsonStr) as GeminiResponse;
							const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
							if (text) {
								yield text;
							}
						} catch {
							// Skip malformed JSON chunks
							console.warn('Failed to parse streaming chunk:', jsonStr.slice(0, 100));
						}
					}
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}

/**
 * Test if the API key is valid by making a minimal request
 */
export async function testApiKey(apiKey: string): Promise<boolean> {
	const url = `${GEMINI_API_BASE}/gemini-2.0-flash:generateContent?key=${apiKey}`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ role: 'user', parts: [{ text: 'Say "ok"' }] }],
				generationConfig: { maxOutputTokens: 5 }
			})
		});

		return response.ok;
	} catch {
		return false;
	}
}
