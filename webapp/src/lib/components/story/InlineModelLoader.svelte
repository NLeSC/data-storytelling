<script lang="ts">
	import {
		LOCAL_MODELS,
		LOCAL_MODEL_INFO,
		type LocalModelId
	} from '$lib/types/settings';
	import { settingsStore, setLocalModel } from '$lib/stores/settings.svelte';
	import { webllmStore, startLoadModel, startUnloadModel } from '$lib/stores/webllm.svelte';
	import { isWebGPUSupported } from '$lib/api/webllm';

	let currentLocalModel = $derived(settingsStore.current.localModel);
	let webgpuSupported = $state(true);

	$effect(() => {
		if (typeof navigator !== 'undefined') {
			webgpuSupported = isWebGPUSupported();
		}
	});

	function handleModelChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setLocalModel(target.value as LocalModelId);
	}

	async function handleLoad() {
		await startLoadModel(currentLocalModel);
	}
</script>

<div id="inline-model-loader" class="inline-loader">
	{#if !webgpuSupported}
		<span class="compat-note">WebGPU not supported in this browser</span>
	{:else if webllmStore.status === 'idle' || webllmStore.status === 'error'}
		<div class="loader-row">
			<select
				class="model-select"
				value={currentLocalModel}
				onchange={handleModelChange}
			>
				{#each LOCAL_MODELS as modelId}
					<option value={modelId}>
						{LOCAL_MODEL_INFO[modelId].label} ({LOCAL_MODEL_INFO[modelId].size}) — {LOCAL_MODEL_INFO[modelId].tag}
					</option>
				{/each}
			</select>
			<button class="load-btn" onclick={handleLoad}>
				{webllmStore.status === 'error' ? 'Retry' : 'Load'}
			</button>
		</div>
		{#if webllmStore.status === 'error' && webllmStore.error}
			<span class="error-text">{webllmStore.error}</span>
		{/if}
	{:else if webllmStore.status === 'loading'}
		<div class="progress-section">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {webllmStore.progress * 100}%"></div>
			</div>
			<span class="progress-text">{webllmStore.statusText}</span>
		</div>
	{/if}
</div>

<style>
	.inline-loader {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		width: 100%;
	}

	.loader-row {
		display: flex;
		gap: 0.375rem;
		align-items: center;
	}

	.model-select {
		flex: 1;
		padding: 0.375rem 0.5rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(244, 184, 65, 0.3);
		border-radius: 0.375rem;
		color: #e0e0e0;
		font-size: 0.8rem;
		outline: none;
		cursor: pointer;
		appearance: auto;
	}

	.model-select option {
		background: #1a1a2e;
		color: #e0e0e0;
	}

	.load-btn {
		padding: 0.375rem 0.75rem;
		background: rgba(123, 175, 212, 0.2);
		border: 1px solid rgba(123, 175, 212, 0.4);
		border-radius: 0.375rem;
		color: #7bafd4;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.2s ease;
	}

	.load-btn:hover {
		background: rgba(123, 175, 212, 0.3);
		border-color: #7bafd4;
	}

	.progress-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
	}

	.progress-bar {
		height: 4px;
		background: rgba(244, 184, 65, 0.2);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #7bafd4;
		border-radius: 2px;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 0.7rem;
		color: #ccc;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.error-text {
		font-size: 0.7rem;
		color: #f44336;
	}

	.compat-note {
		font-size: 0.8rem;
		color: #f4b841;
	}
</style>
