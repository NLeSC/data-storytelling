/**
 * LLM dispatch layer — routes story generation to the active provider.
 * All UI components should import from here instead of gemini.ts directly.
 */

import type { StoryGenerationRequest } from '$lib/types/story';
import type { StorySettings } from '$lib/types/settings';
import { generateStoryStream as generateStoryStreamGemini } from './gemini';

/**
 * Generate a story using the configured provider with streaming.
 * Yields text chunks as they arrive. Pass an AbortSignal to allow cancellation.
 */
export async function* generateStoryStream(
	request: StoryGenerationRequest,
	settings: StorySettings,
	signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
	if (settings.provider === 'local') {
		const { generateStoryStreamLocal } = await import('./webllm');
		yield* generateStoryStreamLocal(request, settings, signal);
	} else if (settings.provider === 'custom') {
		const { generateStoryStreamCustom } = await import('./openai-compatible');
		yield* generateStoryStreamCustom(request, settings, signal);
	} else {
		yield* generateStoryStreamGemini(request, settings, signal);
	}
}
