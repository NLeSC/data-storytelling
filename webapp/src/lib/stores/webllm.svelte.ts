/**
 * Reactive WebLLM state store using Svelte 5 runes.
 * Wraps the engine singleton from api/webllm.ts with reactive status tracking.
 */

import {
	loadModel,
	unloadModel,
	isModelLoaded,
	isModelLoading,
	setProgressCallback
} from '$lib/api/webllm';

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
