/**
 * Reactive WebLLM state store using Svelte 5 runes.
 * Wraps the engine singleton from api/webllm.ts with reactive status tracking.
 */

import {
	loadModel,
	unloadModel,
	isModelLoaded,
	isModelLoading,
	isWebGPUSupported,
	setProgressCallback
} from '$lib/api/webllm';
import { getFromStorage } from '$lib/utils/storage';
import { STORAGE_KEYS } from '$lib/types/story';
import { DEFAULT_SETTINGS, type StorySettings } from '$lib/types/settings';

export type WebLLMStatus = 'idle' | 'loading' | 'ready' | 'error';

let status = $state<WebLLMStatus>('idle');
let progress = $state(0);
let statusText = $state('');
let error = $state<string | null>(null);
let loadedModelId = $state<string | null>(null);

/**
 * Start loading a model. Updates reactive state throughout the process.
 */
export async function startLoadModel(modelId: string): Promise<void> {
	if (isModelLoading()) return;

	status = 'loading';
	progress = 0;
	statusText = 'Initializing...';
	error = null;

	setProgressCallback((report) => {
		progress = report.progress;
		statusText = report.text;
	});

	try {
		await loadModel(modelId);
		status = 'ready';
		loadedModelId = modelId;
		statusText = 'Model ready';
		progress = 1;
	} catch (err) {
		status = 'error';
		error = err instanceof Error ? err.message : 'Failed to load model';
		loadedModelId = null;
		progress = 0;
		statusText = '';
	} finally {
		setProgressCallback(null);
	}
}

/**
 * Unload the current model and reset state.
 */
export async function startUnloadModel(): Promise<void> {
	try {
		await unloadModel();
	} catch {
		// ignore unload errors
	}
	status = 'idle';
	progress = 0;
	statusText = '';
	error = null;
	loadedModelId = null;
}

/**
 * Auto-load the local model on startup if provider is 'local'.
 * WebLLM caches downloaded weights in the browser Cache API,
 * so subsequent loads are fast (no re-download).
 * Call this once from a top-level component's onMount.
 */
let autoLoadAttempted = false;
export async function autoLoadModel(): Promise<void> {
	if (autoLoadAttempted) return;
	autoLoadAttempted = true;

	if (typeof navigator === 'undefined' || !isWebGPUSupported()) return;
	if (isModelLoaded() || isModelLoading()) return;

	const stored = getFromStorage<StorySettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
	if (stored.provider !== 'local') return;

	const modelId = stored.localModel ?? DEFAULT_SETTINGS.localModel;
	await startLoadModel(modelId);
}

/**
 * Reactive store for reading WebLLM state in components.
 */
export const webllmStore = {
	get status() {
		return status;
	},
	get progress() {
		return progress;
	},
	get statusText() {
		return statusText;
	},
	get error() {
		return error;
	},
	get loadedModelId() {
		return loadedModelId;
	},
	get isReady() {
		return status === 'ready' && isModelLoaded();
	}
};
