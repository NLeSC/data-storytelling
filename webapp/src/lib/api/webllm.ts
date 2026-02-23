/**
 * WebLLM engine singleton for in-browser LLM inference via WebGPU.
 * Lazy-loads @mlc-ai/web-llm to avoid bundle size impact when not used.
 */

import type { StoryGenerationRequest } from '$lib/types/story';
import type { StorySettings } from '$lib/types/settings';
import { getSystemPrompt, buildUserPrompt } from '$lib/utils/prompts';

type MLCEngine = import('@mlc-ai/web-llm').MLCEngine;
type InitProgressCallback = import('@mlc-ai/web-llm').InitProgressCallback;

let engine: MLCEngine | null = null;
let currentModelId: string | null = null;
let loading = false;
let progressCallback: InitProgressCallback | null = null;

/**
 * Check if the browser supports WebGPU
 */
export function isWebGPUSupported(): boolean {
	return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/**
 * Set the progress callback for model loading
 */
export function setProgressCallback(cb: InitProgressCallback | null): void {
	progressCallback = cb;
	if (engine) {
		engine.setInitProgressCallback(cb ?? (() => {}));
	}
}

/**
 * Load a model into the WebLLM engine (singleton)
 */
export async function loadModel(modelId: string): Promise<void> {
	if (loading) throw new Error('A model is already loading');
	if (currentModelId === modelId && engine) return;

	loading = true;

	try {
		const { MLCEngine: MLCEngineClass } = await import('@mlc-ai/web-llm');

		// Reuse or create engine
		if (!engine) {
			engine = new MLCEngineClass();
		}

		if (progressCallback) {
			engine.setInitProgressCallback(progressCallback);
		}

		await engine.reload(modelId);
		currentModelId = modelId;
	} catch (err) {
		// Clean up on failure
		if (engine) {
			try {
				await engine.unload();
			} catch {
				// ignore cleanup errors
			}
		}
		currentModelId = null;
		throw err;
	} finally {
		loading = false;
	}
}

/**
 * Unload the current model and free GPU memory
 */
export async function unloadModel(): Promise<void> {
	if (engine) {
		await engine.unload();
		currentModelId = null;
	}
}

/**
 * Check if a model is currently loaded
 */
export function isModelLoaded(): boolean {
	return currentModelId !== null && engine !== null;
}

/**
 * Check if a model is currently loading
 */
export function isModelLoading(): boolean {
	return loading;
}

/**
 * Get the currently loaded model ID
 */
export function getLoadedModelId(): string | null {
	return currentModelId;
}

/**
 * Generate a story using the local WebLLM engine with streaming.
 * Yields text chunks as they arrive.
 */
export async function* generateStoryStreamLocal(
	request: StoryGenerationRequest,
	settings: StorySettings
): AsyncGenerator<string, void, unknown> {
	if (!engine || !currentModelId) {
		throw new Error('No local model loaded. Please load a model first.');
	}

	const systemPrompt = getSystemPrompt(request.audience, settings.customPrompts[request.audience]);
	const userPrompt = buildUserPrompt(request);

	const completion = await engine.chat.completions.create({
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt }
		],
		temperature: settings.temperature,
		max_tokens: settings.maxTokens,
		stream: true
	});

	for await (const chunk of completion) {
		const delta = chunk.choices[0]?.delta?.content;
		if (delta) {
			yield delta;
		}
	}
}
