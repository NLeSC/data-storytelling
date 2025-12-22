<script lang="ts">
	import type { RelatedSoftware } from '$lib/types/story';

	interface Props {
		software: RelatedSoftware[];
		selected: string[];
		loading: boolean;
		onchange: (selectedIds: string[]) => void;
	}

	let { software, selected, loading, onchange }: Props = $props();

	function toggleSelection(id: string) {
		if (selected.includes(id)) {
			onchange(selected.filter((s) => s !== id));
		} else {
			onchange([...selected, id]);
		}
	}

	function selectAll() {
		onchange(software.map((s) => s.id));
	}

	function selectNone() {
		onchange([]);
	}
</script>

<div class="related-software-selector">
	<div class="selector-header">
		<h4 class="selector-label">Related Software (Optional)</h4>
		{#if software.length > 0}
			<div class="bulk-actions">
				<button class="action-link" onclick={selectAll}>Select All</button>
				<span class="separator">|</span>
				<button class="action-link" onclick={selectNone}>Clear</button>
			</div>
		{/if}
	</div>

	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<span>Loading related software...</span>
		</div>
	{:else if software.length === 0}
		<p class="empty-state">No related software found for this project.</p>
	{:else}
		<div class="software-list">
			{#each software as sw}
				<label class="software-item" class:selected={selected.includes(sw.id)}>
					<input
						type="checkbox"
						checked={selected.includes(sw.id)}
						onchange={() => toggleSelection(sw.id)}
					/>
					<div class="software-info">
						<span class="software-name">{sw.brand_name}</span>
						{#if sw.short_statement}
							<span class="software-statement">{sw.short_statement}</span>
						{/if}
					</div>
				</label>
			{/each}
		</div>
		<p class="help-text">
			Selected software will be included as context for story generation.
		</p>
	{/if}
</div>

<style>
	.related-software-selector {
		margin-bottom: 1.5rem;
	}

	.selector-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.selector-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #7bafd4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0;
	}

	.bulk-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.action-link {
		background: none;
		border: none;
		color: #7bafd4;
		font-size: 0.75rem;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
	}

	.action-link:hover {
		color: #9fc5e0;
	}

	.separator {
		color: #444;
		font-size: 0.75rem;
	}

	.loading-state {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0.5rem;
		color: #888;
		font-size: 0.85rem;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(123, 175, 212, 0.3);
		border-top-color: #7bafd4;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.empty-state {
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0.5rem;
		color: #666;
		font-size: 0.85rem;
		text-align: center;
	}

	.software-list {
		max-height: 200px;
		overflow-y: auto;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
	}

	.software-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		cursor: pointer;
		transition: background 0.15s ease;
		border-bottom: 1px solid rgba(123, 175, 212, 0.1);
	}

	.software-item:last-child {
		border-bottom: none;
	}

	.software-item:hover {
		background: rgba(123, 175, 212, 0.05);
	}

	.software-item.selected {
		background: rgba(123, 175, 212, 0.1);
	}

	.software-item input[type='checkbox'] {
		margin-top: 0.15rem;
		accent-color: #7bafd4;
	}

	.software-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
		min-width: 0;
	}

	.software-name {
		font-size: 0.9rem;
		color: #e0e0e0;
		font-weight: 500;
	}

	.software-statement {
		font-size: 0.75rem;
		color: #888;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.help-text {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: #666;
	}
</style>
