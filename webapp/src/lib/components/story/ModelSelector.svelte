<script lang="ts">
	import {
		MODEL_LABELS,
		LOCAL_MODELS,
		LOCAL_MODEL_INFO,
		type GeminiModel,
		type LLMProvider,
		type LocalModelId
	} from '$lib/types/settings';
	import { settingsStore, setModel, setProvider, setLocalModel } from '$lib/stores/settings.svelte';
	import { webllmStore, startLoadModel, startUnloadModel } from '$lib/stores/webllm.svelte';
	import { isWebGPUSupported } from '$lib/api/webllm';

	let currentProvider = $derived(settingsStore.current.provider ?? 'gemini');
	let currentModel = $derived(settingsStore.current.model);
	let currentLocalModel = $derived(settingsStore.current.localModel);
	let webgpuSupported = $state(true);

	$effect(() => {
		if (typeof navigator !== 'undefined') {
			webgpuSupported = isWebGPUSupported();
		}
	});

	const geminiModels = Object.entries(MODEL_LABELS) as [GeminiModel, string][];

	function handleProviderChange(provider: LLMProvider) {
		setProvider(provider);
	}

	function handleGeminiModelChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setModel(target.value as GeminiModel);
	}

	function handleLocalModelChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setLocalModel(target.value as LocalModelId);
	}

	async function handleLoadModel() {
		await startLoadModel(currentLocalModel);
	}

	async function handleUnloadModel() {
		await startUnloadModel();
	}
</script>

<div id="model-selector" class="model-selector">
	<!-- Provider Toggle -->
	<div class="provider-toggle">
		<button
			class="toggle-btn"
			class:active={currentProvider === 'gemini'}
			onclick={() => handleProviderChange('gemini')}
		>
			Gemini
		</button>
		<button
			class="toggle-btn"
			class:active={currentProvider === 'local'}
			onclick={() => handleProviderChange('local')}
		>
			Local
		</button>
		<button
			class="toggle-btn"
			class:active={currentProvider === 'custom'}
			onclick={() => handleProviderChange('custom')}
		>
			Server
		</button>
	</div>

	{#if currentProvider === 'gemini'}
		<!-- Gemini model selector -->
		<div class="model-row">
			<label class="model-label" for="model-select">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M12 2L2 7l10 5 10-5-10-5z" />
					<path d="M2 17l10 5 10-5" />
					<path d="M2 12l10 5 10-5" />
				</svg>
				Model
			</label>
			<select
				id="model-select"
				class="model-select"
				value={currentModel}
				onchange={handleGeminiModelChange}
			>
				{#each geminiModels as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>
	{:else if currentProvider === 'local'}
		<!-- Local model selector -->
		{#if !webgpuSupported}
			<div class="webgpu-warning">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
					/>
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
				<span>WebGPU not supported in this browser</span>
			</div>
		{/if}

		<div class="model-row">
			<label class="model-label" for="local-model-select">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
					<rect x="9" y="9" width="6" height="6" />
					<line x1="9" y1="1" x2="9" y2="4" />
					<line x1="15" y1="1" x2="15" y2="4" />
					<line x1="9" y1="20" x2="9" y2="23" />
					<line x1="15" y1="20" x2="15" y2="23" />
					<line x1="20" y1="9" x2="23" y2="9" />
					<line x1="20" y1="14" x2="23" y2="14" />
					<line x1="1" y1="9" x2="4" y2="9" />
					<line x1="1" y1="14" x2="4" y2="14" />
				</svg>
				Model
			</label>
			<select
				id="local-model-select"
				class="model-select"
				value={currentLocalModel}
				onchange={handleLocalModelChange}
				disabled={webllmStore.status === 'loading'}
			>
				{#each LOCAL_MODELS as modelId}
					<option value={modelId}>
						{LOCAL_MODEL_INFO[modelId].label} ({LOCAL_MODEL_INFO[modelId].size}) — {LOCAL_MODEL_INFO[modelId].tag}
					</option>
				{/each}
			</select>
		</div>
		<p class="model-description">{LOCAL_MODEL_INFO[currentLocalModel].description}</p>

		<!-- Status + Load/Unload -->
		<div class="local-controls">
			{#if webllmStore.status === 'idle'}
				<button class="load-btn" onclick={handleLoadModel} disabled={!webgpuSupported}>
					Load Model
				</button>
			{:else if webllmStore.status === 'loading'}
				<div class="loading-state">
					<div class="progress-bar">
						<div class="progress-fill" style="width: {webllmStore.progress * 100}%"></div>
					</div>
					<span class="progress-text">{webllmStore.statusText}</span>
				</div>
			{:else if webllmStore.status === 'ready'}
				<div class="ready-state">
					<span class="status-badge ready">Ready</span>
					<button class="unload-btn" onclick={handleUnloadModel}> Unload </button>
				</div>
			{:else if webllmStore.status === 'error'}
				<div class="error-state">
					<span class="status-badge error">Error</span>
					<span class="error-text">{webllmStore.error}</span>
					<button class="load-btn" onclick={handleLoadModel}>Retry</button>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Custom server info -->
		<div class="custom-server-info">
			<div class="model-row">
				<span class="model-label">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
						<rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
						<line x1="6" y1="6" x2="6.01" y2="6" />
						<line x1="6" y1="18" x2="6.01" y2="18" />
					</svg>
					Server
				</span>
				<span class="server-url">{settingsStore.current.customServerUrl || 'Not configured'}</span>
			</div>
			{#if settingsStore.current.customServerModel}
				<p class="model-description">Model: {settingsStore.current.customServerModel}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.model-selector {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(123, 175, 212, 0.15);
		border-radius: 0.5rem;
	}

	.provider-toggle {
		display: flex;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.375rem;
		padding: 2px;
		gap: 2px;
	}

	.toggle-btn {
		flex: 1;
		padding: 0.375rem 0.5rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		color: #888;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-btn.active {
		background: rgba(123, 175, 212, 0.2);
		color: #7bafd4;
	}

	.toggle-btn:hover:not(.active) {
		color: #bbb;
	}

	.model-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.model-label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #888;
		white-space: nowrap;
	}

	.model-select {
		flex: 1;
		padding: 0.375rem 0.5rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.375rem;
		color: #e0e0e0;
		font-size: 0.75rem;
		outline: none;
		cursor: pointer;
		transition: border-color 0.2s ease;
		appearance: auto;
	}

	.model-select:hover {
		border-color: rgba(123, 175, 212, 0.4);
	}

	.model-select:focus {
		border-color: #7bafd4;
	}

	.model-select option {
		background: #1a1a2e;
		color: #e0e0e0;
	}

	.model-select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.model-description {
		margin: 0;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.45);
		line-height: 1.3;
		padding-left: 0.25rem;
	}

	.webgpu-warning {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.5rem;
		background: rgba(244, 184, 65, 0.1);
		border: 1px solid rgba(244, 184, 65, 0.3);
		border-radius: 0.375rem;
		color: #f4b841;
		font-size: 0.7rem;
	}

	.local-controls {
		min-height: 2rem;
	}

	.load-btn {
		width: 100%;
		padding: 0.375rem 0.75rem;
		background: rgba(123, 175, 212, 0.15);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.375rem;
		color: #7bafd4;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.load-btn:hover:not(:disabled) {
		background: rgba(123, 175, 212, 0.25);
		border-color: #7bafd4;
	}

	.load-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.progress-bar {
		height: 4px;
		background: rgba(123, 175, 212, 0.15);
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
		font-size: 0.65rem;
		color: #888;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ready-state {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-badge {
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.status-badge.ready {
		background: rgba(76, 175, 80, 0.15);
		color: #4caf50;
		border: 1px solid rgba(76, 175, 80, 0.3);
	}

	.status-badge.error {
		background: rgba(244, 67, 54, 0.15);
		color: #f44336;
		border: 1px solid rgba(244, 67, 54, 0.3);
	}

	.unload-btn {
		padding: 0.25rem 0.5rem;
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		border-radius: 0.25rem;
		color: #f44336;
		font-size: 0.65rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.unload-btn:hover {
		background: rgba(244, 67, 54, 0.2);
	}

	.error-state {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.375rem;
	}

	.error-text {
		font-size: 0.65rem;
		color: #f44336;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.server-url {
		font-size: 0.75rem;
		color: #e0e0e0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
