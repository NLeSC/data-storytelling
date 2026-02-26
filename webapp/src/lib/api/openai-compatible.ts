/**
 * OpenAI-compatible API client for story generation.
 * Works with llama.cpp (llama-server), Ollama, vLLM, LM Studio,
 * and any server exposing /v1/chat/completions with SSE streaming.
 */

import type { StoryGenerationRequest } from '$lib/types/story';
import type { StorySettings } from '$lib/types/settings';
import { getSystemPrompt, buildUserPrompt } from '$lib/utils/prompts';

interface ChatCompletionChunk {
	choices: Array<{
		delta: {
			content?: string;
			role?: string;
		};
		finish_reason: string | null;
	}>;
}

/**
 * Generate a story using an OpenAI-compatible server with streaming.
 * Yields text chunks as they arrive.
 */
export async function* generateStoryStreamCustom(
	request: StoryGenerationRequest,
	settings: StorySettings,
	signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
	const baseUrl = settings.customServerUrl.replace(/\/+$/, '');
	if (!baseUrl) {
		throw new Error('Custom server URL is not configured. Please set it in Settings.');
	}

	const systemPrompt = getSystemPrompt(
		request.audience,
		settings.customPrompts[request.audience]
	);
	const userPrompt = buildUserPrompt(request);

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (settings.customServerApiKey.trim()) {
		headers['Authorization'] = `Bearer ${settings.customServerApiKey}`;
	}

	const body: Record<string, unknown> = {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt }
		],
		stream: true,
		temperature: settings.temperature,
		max_tokens: settings.maxTokens
	};
	if (settings.customServerModel.trim()) {
		body.model = settings.customServerModel;
	}

	const response = await fetch(`${baseUrl}/v1/chat/completions`, {
		method: 'POST',
		headers,
		signal,
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
		try {
			const errorData = await response.json();
			errorMessage = errorData.error?.message || errorData.message || errorMessage;
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
			if (signal?.aborted) break;
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			const lines = buffer.split('\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith(':')) continue;

				if (trimmed.startsWith('data: ')) {
					const jsonStr = trimmed.slice(6).trim();
					if (jsonStr === '[DONE]') return;

					try {
						const data = JSON.parse(jsonStr) as ChatCompletionChunk;
						const content = data.choices?.[0]?.delta?.content;
						if (content) {
							yield content;
						}
					} catch {
						console.warn('Failed to parse streaming chunk:', jsonStr.slice(0, 100));
					}
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}

/**
 * Fetch available models from an OpenAI-compatible server.
 * Uses the /v1/models endpoint (supported by Ollama, vLLM, LM Studio, etc.)
 */
export async function fetchModels(
	url: string,
	apiKey: string
): Promise<{ ok: boolean; models: string[]; message: string }> {
	const baseUrl = url.replace(/\/+$/, '');

	const headers: Record<string, string> = {};
	if (apiKey.trim()) {
		headers['Authorization'] = `Bearer ${apiKey}`;
	}

	try {
		const response = await fetch(`${baseUrl}/v1/models`, {
			method: 'GET',
			headers,
			signal: AbortSignal.timeout(10000)
		});

		if (!response.ok) {
			return { ok: false, models: [], message: `Server responded with ${response.status}` };
		}

		const data = await response.json();
		const models: string[] = (data.data ?? [])
			.map((m: { id?: string }) => m.id)
			.filter(Boolean)
			.sort();

		if (models.length === 0) {
			return { ok: true, models: [], message: 'No models found on server' };
		}

		return { ok: true, models, message: `Found ${models.length} model${models.length === 1 ? '' : 's'}` };
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Failed to fetch models';
		return { ok: false, models: [], message };
	}
}

/**
 * Test connectivity to an OpenAI-compatible server.
 * Sends a minimal completion request and returns success/failure with a message.
 */
export async function testConnection(
	url: string,
	apiKey: string,
	model: string
): Promise<{ ok: boolean; message: string }> {
	const baseUrl = url.replace(/\/+$/, '');

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (apiKey.trim()) {
		headers['Authorization'] = `Bearer ${apiKey}`;
	}

	const body: Record<string, unknown> = {
		messages: [{ role: 'user', content: 'Say "ok"' }],
		max_tokens: 5,
		stream: false
	};
	if (model.trim()) {
		body.model = model;
	}

	try {
		const response = await fetch(`${baseUrl}/v1/chat/completions`, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(10000)
		});

		if (response.ok) {
			return { ok: true, message: 'Connected successfully' };
		}

		let detail = response.statusText;
		try {
			const errorData = await response.json();
			detail = errorData.error?.message || errorData.message || detail;
		} catch {
			// Use statusText
		}
		return { ok: false, message: `Server responded with ${response.status}: ${detail}` };
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Connection failed';
		return { ok: false, message };
	}
}
