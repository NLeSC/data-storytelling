<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import {
		settingsStore,
		initSettings,
		setDefaultAudience,
		setTemperature,
		setMaxTokens,
		resetSettings
	} from '$lib/stores/settings.svelte';
	import {
		AUDIENCE_LABELS,
		AUDIENCE_DESCRIPTIONS,
		type AudienceType
	} from '$lib/types/settings';
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	// Initialize settings on mount
	onMount(() => {
		initSettings();
	});

	function handleAudienceChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setDefaultAudience(target.value as AudienceType);
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
				<h2>Generation Settings</h2>
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

	.number-input {
		width: 120px;
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
