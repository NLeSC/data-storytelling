<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import {
		settingsStore,
		initSettings,
		setApiKey,
		setDefaultAudience,
		setTemperature,
		setMaxTokens,
		setModel,
		setProvider,
		setLocalModel,
		resetSettings
	} from '$lib/stores/settings.svelte';
	import {
		AUDIENCE_LABELS,
		AUDIENCE_DESCRIPTIONS,
		MODEL_LABELS,
		LOCAL_MODELS,
		LOCAL_MODEL_INFO,
		type AudienceType,
		type GeminiModel,
		type LLMProvider,
		type LocalModelId
	} from '$lib/types/settings';
	import { webllmStore, startLoadModel, startUnloadModel } from '$lib/stores/webllm.svelte';
	import { isWebGPUSupported } from '$lib/api/webllm';
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let showApiKey = $state(false);
	let apiKeyInput = $state('');
	let webgpuSupported = $state(true);

	let currentProvider = $derived(settingsStore.current.provider ?? 'gemini');
	let currentLocalModel = $derived(settingsStore.current.localModel);

	// Initialize settings on mount
	onMount(() => {
		initSettings();
		apiKeyInput = settingsStore.current.geminiApiKey;
		webgpuSupported = isWebGPUSupported();
	});

	// Sync API key input when settings change
	$effect(() => {
		if (settingsStore.initialized) {
			apiKeyInput = settingsStore.current.geminiApiKey;
		}
	});

	function handleApiKeyChange() {
		setApiKey(apiKeyInput);
	}

	function handleAudienceChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setDefaultAudience(target.value as AudienceType);
	}

	function handleProviderChange(provider: LLMProvider) {
		setProvider(provider);
	}

	function handleModelChange(e: Event) {
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

	function handleTemperatureChange(e: Event) {
		const target = e.target as HTMLInputElement;
		setTemperature(parseFloat(target.value));
	}

	function handleMaxTokensChange(e: Event) {
		const target = e.target as HTMLInputElement;
		setMaxTokens(parseInt(target.value, 10));
	}

	function handleReset() {
		if (confirm('Reset all settings to defaults? This will clear your API key.')) {
			resetSettings();
			apiKeyInput = '';
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	// Close on escape
	$effect(() => {
		if (typeof window === 'undefined') return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleEscape);
		}

		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	});
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="panel-backdrop"
		role="dialog"
		aria-modal="true"
		aria-label="Settings"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
	>
		<div class="panel" transition:fly={{ x: 300, duration: 300 }}>
			<div class="panel-header">
				<h2>Story Generator Settings</h2>
				<button class="close-button" onclick={onClose} aria-label="Close settings">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<div class="panel-content">
				<!-- Provider Section -->
				<section class="settings-section">
					<h3>Provider</h3>
					<div class="provider-toggle">
						<button
							class="provider-btn"
							class:active={currentProvider === 'gemini'}
							onclick={() => handleProviderChange('gemini')}
						>
							Gemini (Cloud)
						</button>
						<button
							class="provider-btn"
							class:active={currentProvider === 'local'}
							onclick={() => handleProviderChange('local')}
						>
							Local (WebLLM)
						</button>
					</div>
					<p class="section-description">
						{#if currentProvider === 'gemini'}
							Uses Google's Gemini API. Requires an API key.
						{:else}
							Runs entirely in your browser via WebGPU. No API key needed.
						{/if}
					</p>
				</section>

				{#if currentProvider === 'gemini'}
					<!-- API Key Section -->
					<section class="settings-section">
						<h3>Gemini API Key</h3>
						<p class="section-description">
							Enter your Google Gemini API key. Get one from
							<a
								href="https://aistudio.google.com/apikey"
								target="_blank"
								rel="noopener noreferrer"
							>
								Google AI Studio
							</a>.
						</p>
						<div class="api-key-input">
							<input
								type={showApiKey ? 'text' : 'password'}
								bind:value={apiKeyInput}
								onchange={handleApiKeyChange}
								onblur={handleApiKeyChange}
								placeholder="AIza..."
								class="input"
							/>
							<button
								class="toggle-visibility"
								onclick={() => (showApiKey = !showApiKey)}
								aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
							>
								{#if showApiKey}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
										/>
										<line x1="1" y1="1" x2="23" y2="23" />
									</svg>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
								{/if}
							</button>
						</div>
						<p class="warning">
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
							API key is stored in your browser's localStorage only.
						</p>
					</section>

					<!-- Model Selection (Gemini) -->
					<section class="settings-section">
						<h3>Model</h3>
						<select class="select" value={settingsStore.current.model} onchange={handleModelChange}>
							{#each Object.entries(MODEL_LABELS) as [value, label]}
								<option {value}>{label}</option>
							{/each}
						</select>
					</section>
				{:else}
					<!-- Local Model Section -->
					<section class="settings-section">
						<h3>Local Model</h3>
						{#if !webgpuSupported}
							<div class="webgpu-warning">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
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
								<span>WebGPU is not supported in this browser. Try Chrome or Edge.</span>
							</div>
						{/if}
						<select
							class="select"
							value={currentLocalModel}
							onchange={handleLocalModelChange}
							disabled={webllmStore.status === 'loading'}
						>
							{#each LOCAL_MODELS as modelId}
								<option value={modelId}>
									{LOCAL_MODEL_INFO[modelId].label} ({LOCAL_MODEL_INFO[modelId].size})
								</option>
							{/each}
						</select>

						<div class="local-model-controls">
							{#if webllmStore.status === 'idle'}
								<button
									class="load-model-btn"
									onclick={handleLoadModel}
									disabled={!webgpuSupported}
								>
									Load Model
								</button>
							{:else if webllmStore.status === 'loading'}
								<div class="loading-progress">
									<div class="progress-bar">
										<div class="progress-fill" style="width: {webllmStore.progress * 100}%"></div>
									</div>
									<p class="progress-text">{webllmStore.statusText}</p>
								</div>
							{:else if webllmStore.status === 'ready'}
								<div class="model-ready">
									<span class="ready-badge">Model loaded</span>
									<button class="unload-model-btn" onclick={handleUnloadModel}>Unload</button>
								</div>
							{:else if webllmStore.status === 'error'}
								<div class="model-error">
									<p class="error-text">{webllmStore.error}</p>
									<button class="load-model-btn" onclick={handleLoadModel}>Retry</button>
								</div>
							{/if}
						</div>

						<p class="section-description">
							Models run entirely on your device using WebGPU. Larger models produce better results
							but need more memory.
						</p>
					</section>
				{/if}

				<!-- Default Audience -->
				<section class="settings-section">
					<h3>Default Audience</h3>
					<select
						class="select"
						value={settingsStore.current.defaultAudience}
						onchange={handleAudienceChange}
					>
						{#each Object.entries(AUDIENCE_LABELS) as [value, label]}
							<option {value}>{label}</option>
						{/each}
					</select>
					<p class="section-description">
						{AUDIENCE_DESCRIPTIONS[settingsStore.current.defaultAudience]}
					</p>
				</section>

				<!-- Temperature -->
				<section class="settings-section">
					<h3>Temperature</h3>
					<div class="slider-group">
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settingsStore.current.temperature}
							oninput={handleTemperatureChange}
							class="slider"
						/>
						<span class="slider-value">{settingsStore.current.temperature.toFixed(1)}</span>
					</div>
					<p class="section-description">
						Lower values produce more focused output. Higher values are more creative.
					</p>
				</section>

				<!-- Max Tokens -->
				<section class="settings-section">
					<h3>Max Output Tokens</h3>
					<input
						type="number"
						min="100"
						max="8192"
						step="100"
						value={settingsStore.current.maxTokens}
						onchange={handleMaxTokensChange}
						class="input number-input"
					/>
					<p class="section-description">Maximum length of generated stories (100-8192 tokens).</p>
				</section>

				<!-- Reset -->
				<section class="settings-section">
					<button class="reset-button" onclick={handleReset}> Reset to Defaults </button>
				</section>
			</div>
		</div>
	</div>
{/if}

<style>
	.panel-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		z-index: 9998;
		display: flex;
		justify-content: flex-end;
	}

	.panel {
		width: 100%;
		max-width: 420px;
		height: 100%;
		background: linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(20, 15, 30, 0.98) 100%);
		border-left: 1px solid rgba(123, 175, 212, 0.3);
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid rgba(123, 175, 212, 0.2);
		position: sticky;
		top: 0;
		background: rgba(10, 10, 10, 0.95);
		backdrop-filter: blur(10px);
		z-index: 1;
	}

	.panel-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #7bafd4;
		margin: 0;
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: rgba(123, 175, 212, 0.2);
		border-color: #7bafd4;
	}

	.panel-content {
		padding: 1.5rem;
		flex: 1;
	}

	.settings-section {
		margin-bottom: 2rem;
	}

	.settings-section h3 {
		font-size: 0.875rem;
		font-weight: 600;
		color: #e0e0e0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.section-description {
		font-size: 0.8rem;
		color: #888;
		margin-top: 0.5rem;
		line-height: 1.5;
	}

	.section-description a {
		color: #7bafd4;
		text-decoration: none;
	}

	.section-description a:hover {
		text-decoration: underline;
	}

	/* Provider toggle */
	.provider-toggle {
		display: flex;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
		padding: 3px;
		gap: 3px;
	}

	.provider-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		color: #888;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.provider-btn.active {
		background: rgba(123, 175, 212, 0.2);
		color: #7bafd4;
	}

	.provider-btn:hover:not(.active) {
		color: #bbb;
	}

	.api-key-input {
		display: flex;
		gap: 0.5rem;
	}

	.input {
		flex: 1;
		padding: 0.75rem 1rem;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #e0e0e0;
		font-size: 0.9rem;
		transition: border-color 0.2s ease;
	}

	.input:focus {
		outline: none;
		border-color: #7bafd4;
	}

	.input::placeholder {
		color: #666;
	}

	.number-input {
		width: 120px;
	}

	.toggle-visibility {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-visibility:hover {
		background: rgba(123, 175, 212, 0.2);
	}

	.warning {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: #f4b841;
		margin-top: 0.75rem;
	}

	.select {
		width: 100%;
		padding: 0.75rem 1rem;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #e0e0e0;
		font-size: 0.9rem;
		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	.select:focus {
		outline: none;
		border-color: #7bafd4;
	}

	.select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Local model controls */
	.webgpu-warning {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: rgba(244, 184, 65, 0.1);
		border: 1px solid rgba(244, 184, 65, 0.3);
		border-radius: 0.5rem;
		color: #f4b841;
		font-size: 0.8rem;
		margin-bottom: 0.75rem;
	}

	.local-model-controls {
		margin-top: 0.75rem;
	}

	.load-model-btn {
		width: 100%;
		padding: 0.625rem 1rem;
		background: rgba(123, 175, 212, 0.15);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.load-model-btn:hover:not(:disabled) {
		background: rgba(123, 175, 212, 0.25);
		border-color: #7bafd4;
	}

	.load-model-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading-progress {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.progress-bar {
		height: 6px;
		background: rgba(123, 175, 212, 0.15);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #7bafd4;
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 0.75rem;
		color: #888;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.model-ready {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.ready-badge {
		padding: 0.25rem 0.75rem;
		background: rgba(76, 175, 80, 0.15);
		color: #4caf50;
		border: 1px solid rgba(76, 175, 80, 0.3);
		border-radius: 9999px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.unload-model-btn {
		padding: 0.375rem 0.75rem;
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		border-radius: 0.375rem;
		color: #f44336;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.unload-model-btn:hover {
		background: rgba(244, 67, 54, 0.2);
	}

	.model-error {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.error-text {
		font-size: 0.8rem;
		color: #f44336;
		margin: 0;
	}

	.slider-group {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.slider {
		flex: 1;
		height: 6px;
		background: rgba(123, 175, 212, 0.2);
		border-radius: 3px;
		appearance: none;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 18px;
		height: 18px;
		background: #7bafd4;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.slider-value {
		min-width: 2.5rem;
		text-align: center;
		color: #7bafd4;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.reset-button {
		width: 100%;
		padding: 0.75rem 1rem;
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		border-radius: 0.5rem;
		color: #f44336;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.reset-button:hover {
		background: rgba(244, 67, 54, 0.2);
		border-color: #f44336;
	}

	@media (max-width: 480px) {
		.panel {
			max-width: 100%;
		}
	}
</style>
