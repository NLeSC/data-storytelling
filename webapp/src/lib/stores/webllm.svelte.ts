/**
 * Reactive WebLLM state store using Svelte 5 runes.
 * Wraps the engine singleton from api/webllm.ts with reactive status tracking.
 */

import {
	loadModel,
	unloadModel,
	isModelLoaded,
	isModelLoading,
	setProgressCallback,
	getCachedModels,
	deleteCachedModel
} from '$lib/api/webllm';
import { LOCAL_MODELS } from '$lib/types/settings';

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

let cachedModels = $state<string[]>([]);
let cacheScanning = $state(false);

/**
 * Scan browser cache for downloaded models.
 */
export async function scanCachedModels(): Promise<void> {
	cacheScanning = true;
	try {
		const cached = await getCachedModels([...LOCAL_MODELS]);
		cachedModels = cached.map((m) => m.id);
	} catch {
		cachedModels = [];
	} finally {
		cacheScanning = false;
	}
}

/**
 * Remove a specific model from browser cache.
 */
export async function removeCachedModel(modelId: string): Promise<void> {
	await deleteCachedModel(modelId);
	// If we just deleted the loaded model, reset state
	if (loadedModelId === modelId) {
		status = 'idle';
		loadedModelId = null;
		progress = 0;
		statusText = '';
	}
	// Refresh the list
	await scanCachedModels();
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
	},
	get cachedModels() {
		return cachedModels;
	},
	get cacheScanning() {
		return cacheScanning;
	}
};
