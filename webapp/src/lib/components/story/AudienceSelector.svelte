<script lang="ts">
	import {
		AUDIENCE_LABELS,
		AUDIENCE_DESCRIPTIONS,
		type AudienceType
	} from '$lib/types/settings';

	interface Props {
		selected: AudienceType;
		onchange: (audience: AudienceType) => void;
	}

	let { selected, onchange }: Props = $props();

	const audiences = Object.entries(AUDIENCE_LABELS) as [AudienceType, string][];

	function handleSelect(audience: AudienceType) {
		onchange(audience);
	}
</script>

<div class="audience-selector">
	<h4 class="selector-label">Select Audience</h4>
	<div class="audience-grid">
		{#each audiences as [value, label]}
			<button
				class="audience-option"
				class:selected={selected === value}
				onclick={() => handleSelect(value)}
			>
				<span class="option-icon">
					{#if value === 'communications'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
							<circle cx="9" cy="7" r="4"/>
							<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
							<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
						</svg>
					{:else if value === 'academic'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
							<path d="M6 12v5c3 3 9 3 12 0v-5"/>
						</svg>
					{:else if value === 'internal-review'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
							<polyline points="14 2 14 8 20 8"/>
							<line x1="16" y1="13" x2="8" y2="13"/>
							<line x1="16" y1="17" x2="8" y2="17"/>
							<polyline points="10 9 9 9 8 9"/>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
							<line x1="3" y1="9" x2="21" y2="9"/>
							<line x1="9" y1="21" x2="9" y2="9"/>
						</svg>
					{/if}
				</span>
				<span class="option-label">{label}</span>
			</button>
		{/each}
	</div>
	<p class="audience-description">{AUDIENCE_DESCRIPTIONS[selected]}</p>
</div>

<style>
	.audience-selector {
		margin-bottom: 1.5rem;
	}

	.selector-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #7bafd4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.audience-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.audience-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.75rem;
		color: #888;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.audience-option:hover {
		background: rgba(123, 175, 212, 0.1);
		border-color: rgba(123, 175, 212, 0.4);
		color: #e0e0e0;
	}

	.audience-option.selected {
		background: rgba(123, 175, 212, 0.15);
		border-color: #7bafd4;
		color: #7bafd4;
	}

	.option-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.option-label {
		font-size: 0.85rem;
		font-weight: 500;
	}

	.audience-description {
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: #888;
		line-height: 1.5;
	}

	@media (max-width: 480px) {
		.audience-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
