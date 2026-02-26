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
 * Detect if the model is stuck in a repetition loop.
 * Checks whether a short substring repeats 4+ times in the last 200 characters.
 */
function detectRepetition(text: string): boolean {
	if (text.length < 200) return false;
	const tail = text.slice(-200);
	const maxPatLen = Math.min(60, Math.floor(tail.length / 4));

	for (let len = 10; len <= maxPatLen; len++) {
		const pattern = tail.slice(-len);
		let count = 0;
		let pos = 0;
		while (true) {
			const idx = tail.indexOf(pattern, pos);
			if (idx === -1) break;
			count++;
			pos = idx + 1;
		}
		if (count >= 4) return true;
	}
	return false;
}

/**
 * Get list of cached model IDs with their cache status.
 */
export async function getCachedModels(
	modelIds: string[]
): Promise<{ id: string; cached: boolean }[]> {
	const { hasModelInCache } = await import('@mlc-ai/web-llm');
	const results = await Promise.all(
		modelIds.map(async (id) => ({
			id,
			cached: await hasModelInCache(id)
		}))
	);
	return results.filter((m) => m.cached);
}

/**
 * Delete a cached model from browser storage.
 */
export async function deleteCachedModel(modelId: string): Promise<void> {
	// Unload first if this model is currently active
	if (currentModelId === modelId && engine) {
		await engine.unload();
		currentModelId = null;
	}
	const { deleteModelInCache } = await import('@mlc-ai/web-llm');
	await deleteModelInCache(modelId);
}

/**
 * Interrupt any in-flight generation on the WebLLM engine.
 */
export function interruptGeneration(): void {
	if (engine) {
		engine.interruptGenerate();
	}
}

/**
 * Generate a story using the local WebLLM engine with streaming.
 * Yields text chunks as they arrive.
 */
export async function* generateStoryStreamLocal(
	request: StoryGenerationRequest,
	settings: StorySettings,
	signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
	if (!engine || !currentModelId) {
		throw new Error('No local model loaded. Please load a model first.');
	}

	const systemPrompt = getSystemPrompt(request.audience, settings.customPrompts[request.audience]);
	const userPrompt = buildUserPrompt(request);

	// Interrupt any leftover generation from a previous aborted run
	engine.interruptGenerate();

	const completion = await engine.chat.completions.create({
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt }
		],
		temperature: settings.temperature,
		max_tokens: settings.maxTokens,
		frequency_penalty: 0.7,
		presence_penalty: 0.3,
		stream: true
	});

	let output = '';
	let chunkCount = 0;

	try {
		for await (const chunk of completion) {
			if (signal?.aborted) break;

			const delta = chunk.choices[0]?.delta?.content;
			if (delta) {
				output += delta;
				yield delta;

				// Check for repetition every 20 chunks once we have enough text
				chunkCount++;
				if (chunkCount >= 20 && output.length > 200) {
					chunkCount = 0;
					if (detectRepetition(output)) {
						console.warn('Repetition loop detected, stopping generation');
						break;
					}
				}
			}
		}
	} finally {
		if (signal?.aborted) {
			engine.interruptGenerate();
		}
	}
}
