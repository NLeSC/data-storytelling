<script lang="ts">
	import { MODEL_LABELS, type GeminiModel } from '$lib/types/settings';
	import { settingsStore, setModel } from '$lib/stores/settings.svelte';

	let currentModel = $derived(settingsStore.current.model);

	const models = Object.entries(MODEL_LABELS) as [GeminiModel, string][];

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setModel(target.value as GeminiModel);
	}
</script>

<div id="model-selector" class="model-selector">
	<label class="model-label" for="model-select">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M12 2L2 7l10 5 10-5-10-5z"/>
			<path d="M2 17l10 5 10-5"/>
			<path d="M2 12l10 5 10-5"/>
		</svg>
		Model
	</label>
	<select
		id="model-select"
		class="model-select"
		value={currentModel}
		onchange={handleChange}
	>
		{#each models as [value, label]}
			<option {value}>{label}</option>
		{/each}
	</select>
</div>

<style>
	.model-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
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
</style>
