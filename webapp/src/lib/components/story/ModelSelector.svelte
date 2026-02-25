<script lang="ts">
	import {
		MODEL_LABELS,
		LOCAL_MODELS,
		LOCAL_MODEL_INFO,
		type GeminiModel,
		type LLMProvider,
		type LocalModelId
	} from '$lib/types/settings';
	import {
		settingsStore,
		setModel,
		setProvider,
		setLocalModel,
		setApiKey,
		setCustomServerUrl,
		setCustomServerApiKey,
		setCustomServerModel
	} from '$lib/stores/settings.svelte';
	import { webllmStore, startLoadModel, startUnloadModel } from '$lib/stores/webllm.svelte';
	import { isWebGPUSupported } from '$lib/api/webllm';
	import { testConnection } from '$lib/api/openai-compatible';

	let currentProvider = $derived(settingsStore.current.provider ?? 'gemini');
	let currentModel = $derived(settingsStore.current.model);
	let currentLocalModel = $derived(settingsStore.current.localModel);
	let webgpuSupported = $state(true);

	// Gemini state
	let showApiKey = $state(false);
	let apiKeyInput = $state('');

	// Custom server state
	let showCustomApiKey = $state(false);
	let customUrlInput = $state('');
	let customApiKeyInput = $state('');
	let customModelInput = $state('');
	let connectionTestResult = $state<{ ok: boolean; message: string } | null>(null);
	let connectionTesting = $state(false);

	$effect(() => {
		if (typeof navigator !== 'undefined') {
			webgpuSupported = isWebGPUSupported();
		}
	});

	// Sync inputs from store
	$effect(() => {
		if (settingsStore.initialized) {
			apiKeyInput = settingsStore.current.geminiApiKey;
			customUrlInput = settingsStore.current.customServerUrl;
			customApiKeyInput = settingsStore.current.customServerApiKey;
			customModelInput = settingsStore.current.customServerModel;
		}
	});

	const geminiModels = Object.entries(MODEL_LABELS) as [GeminiModel, string][];

	function handleProviderChange(provider: LLMProvider) {
		setProvider(provider);
		connectionTestResult = null;
	}

	// Gemini handlers
	function handleGeminiModelChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setModel(target.value as GeminiModel);
	}

	function handleApiKeyChange() {
		setApiKey(apiKeyInput);
	}

	// Local handlers
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

	// Custom server handlers
	function handleCustomUrlChange() {
		setCustomServerUrl(customUrlInput);
		connectionTestResult = null;
	}

	function handleCustomApiKeyChange() {
		setCustomServerApiKey(customApiKeyInput);
		connectionTestResult = null;
	}

	function handleCustomModelChange() {
		setCustomServerModel(customModelInput);
		connectionTestResult = null;
	}

	async function handleTestConnection() {
		connectionTesting = true;
		connectionTestResult = null;
		connectionTestResult = await testConnection(
			customUrlInput,
			customApiKeyInput,
			customModelInput
		);
		connectionTesting = false;
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
		<!-- Gemini config -->
		<div class="model-row">
			<label class="model-label" for="model-select">Model</label>
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

		<div class="field-group">
			<label class="field-label" for="gemini-api-key">API Key</label>
			<div class="input-row">
				<input
					id="gemini-api-key"
					type={showApiKey ? 'text' : 'password'}
					class="field-input"
					bind:value={apiKeyInput}
					onchange={handleApiKeyChange}
					onblur={handleApiKeyChange}
					placeholder="AIza..."
				/>
				<button
					class="toggle-visibility"
					onclick={() => (showApiKey = !showApiKey)}
					aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
				>
					{showApiKey ? 'Hide' : 'Show'}
				</button>
			</div>
			<p class="field-hint">
				Get a key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
			</p>
		</div>
	{:else if currentProvider === 'local'}
		<!-- Local model config -->
		{#if !webgpuSupported}
			<div class="webgpu-warning">
				<span>WebGPU not supported in this browser</span>
			</div>
		{/if}

		<div class="model-row">
			<label class="model-label" for="local-model-select">Model</label>
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

		<div class="local-controls">
			{#if webllmStore.status === 'idle'}
				<button class="action-btn" onclick={handleLoadModel} disabled={!webgpuSupported}>
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
					<button class="unload-btn" onclick={handleUnloadModel}>Unload</button>
				</div>
			{:else if webllmStore.status === 'error'}
				<div class="error-state">
					<span class="status-badge error">Error</span>
					<span class="error-text">{webllmStore.error}</span>
					<button class="action-btn" onclick={handleLoadModel}>Retry</button>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Custom server config -->
		<div class="field-group">
			<label class="field-label" for="custom-server-url">Server URL</label>
			<input
				id="custom-server-url"
				type="text"
				class="field-input"
				bind:value={customUrlInput}
				onchange={handleCustomUrlChange}
				onblur={handleCustomUrlChange}
				placeholder="http://localhost:8080"
			/>
		</div>

		<div class="field-group">
			<label class="field-label" for="custom-model-name">Model Name</label>
			<input
				id="custom-model-name"
				type="text"
				class="field-input"
				bind:value={customModelInput}
				onchange={handleCustomModelChange}
				onblur={handleCustomModelChange}
				placeholder="e.g. llama3, qwen3-8b"
			/>
			<p class="field-hint">Some servers ignore this field.</p>
		</div>

		<div class="field-group">
			<label class="field-label" for="custom-api-key">API Key (optional)</label>
			<div class="input-row">
				<input
					id="custom-api-key"
					type={showCustomApiKey ? 'text' : 'password'}
					class="field-input"
					bind:value={customApiKeyInput}
					onchange={handleCustomApiKeyChange}
					onblur={handleCustomApiKeyChange}
					placeholder="sk-..."
				/>
				<button
					class="toggle-visibility"
					onclick={() => (showCustomApiKey = !showCustomApiKey)}
					aria-label={showCustomApiKey ? 'Hide API key' : 'Show API key'}
				>
					{showCustomApiKey ? 'Hide' : 'Show'}
				</button>
			</div>
			<p class="field-hint">Only needed for authenticated endpoints.</p>
		</div>

		<button
			class="action-btn"
			onclick={handleTestConnection}
			disabled={connectionTesting || !customUrlInput.trim()}
		>
			{connectionTesting ? 'Testing...' : 'Test Connection'}
		</button>
		{#if connectionTestResult}
			<div
				class="connection-result"
				class:success={connectionTestResult.ok}
				class:failure={!connectionTestResult.ok}
			>
				{connectionTestResult.message}
			</div>
		{/if}
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

	/* Shared field styles */
	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.field-label {
		font-size: 0.7rem;
		font-weight: 500;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.field-input {
		width: 100%;
		padding: 0.375rem 0.5rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.375rem;
		color: #e0e0e0;
		font-size: 0.75rem;
		outline: none;
		transition: border-color 0.2s ease;
		box-sizing: border-box;
	}

	.field-input:focus {
		border-color: #7bafd4;
	}

	.field-input::placeholder {
		color: #555;
	}

	.field-hint {
		margin: 0;
		font-size: 0.65rem;
		color: rgba(255, 255, 255, 0.35);
		line-height: 1.3;
	}

	.field-hint a {
		color: #7bafd4;
		text-decoration: none;
	}

	.field-hint a:hover {
		text-decoration: underline;
	}

	.input-row {
		display: flex;
		gap: 0.25rem;
	}

	.input-row .field-input {
		flex: 1;
	}

	.toggle-visibility {
		padding: 0.375rem 0.5rem;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.375rem;
		color: #7bafd4;
		font-size: 0.65rem;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.toggle-visibility:hover {
		background: rgba(123, 175, 212, 0.2);
	}

	/* Model row */
	.model-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.model-label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.7rem;
		font-weight: 500;
		color: #888;
		white-space: nowrap;
		text-transform: uppercase;
		letter-spacing: 0.03em;
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

	/* Local controls */
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

	.action-btn {
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

	.action-btn:hover:not(:disabled) {
		background: rgba(123, 175, 212, 0.25);
		border-color: #7bafd4;
	}

	.action-btn:disabled {
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

	/* Connection test */
	.connection-result {
		padding: 0.375rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.7rem;
	}

	.connection-result.success {
		background: rgba(76, 175, 80, 0.1);
		border: 1px solid rgba(76, 175, 80, 0.3);
		color: #4caf50;
	}

	.connection-result.failure {
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		color: #f44336;
	}
</style>
