<script lang="ts">
	interface Props {
		urls: string[];
		onchange: (urls: string[]) => void;
	}

	let { urls, onchange }: Props = $props();

	let inputValue = $state('');
	let error = $state<string | null>(null);

	function isValidUrl(value: string): boolean {
		return value.startsWith('http://') || value.startsWith('https://');
	}

	function addUrl() {
		const trimmed = inputValue.trim();
		if (!trimmed) return;

		if (!isValidUrl(trimmed)) {
			error = 'URL must start with http:// or https://';
			return;
		}

		if (urls.includes(trimmed)) {
			error = 'This URL has already been added';
			return;
		}

		error = null;
		onchange([...urls, trimmed]);
		inputValue = '';
	}

	function removeUrl(index: number) {
		onchange(urls.filter((_, i) => i !== index));
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addUrl();
		}
	}
</script>

<div id="url-references-input" class="url-references">
	<h4 class="section-label">Reference URLs (Optional)</h4>

	<div class="input-row">
		<input
			type="url"
			bind:value={inputValue}
			onkeydown={handleKeydown}
			placeholder="https://example.com"
			class="url-input"
		/>
		<button class="add-button" onclick={addUrl} disabled={!inputValue.trim()}>
			Add
		</button>
	</div>

	{#if error}
		<p class="error-message">{error}</p>
	{/if}

	{#if urls.length > 0}
		<div class="url-list">
			{#each urls as url, index (url)}
				<div class="url-item">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="url-icon">
						<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
						<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
					</svg>
					<span class="url-text">{url}</span>
					<button class="remove-button" onclick={() => removeUrl(index)} aria-label="Remove URL">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"/>
							<line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<p class="help-text">Add links to project repositories, documentation, or related papers.</p>
</div>

<style>
	.url-references {
		margin-bottom: 1.5rem;
	}

	.section-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #7bafd4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.input-row {
		display: flex;
		gap: 0.5rem;
	}

	.url-input {
		flex: 1;
		padding: 0.625rem 0.75rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
		color: #e0e0e0;
		font-size: 0.85rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.url-input::placeholder {
		color: #666;
	}

	.url-input:focus {
		border-color: #7bafd4;
	}

	.add-button {
		padding: 0.625rem 1rem;
		background: rgba(123, 175, 212, 0.15);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.add-button:hover:not(:disabled) {
		background: rgba(123, 175, 212, 0.25);
		border-color: #7bafd4;
	}

	.add-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.error-message {
		margin-top: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		border-radius: 0.5rem;
		color: #f44336;
		font-size: 0.8rem;
	}

	.url-list {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.url-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
	}

	.url-icon {
		color: #7bafd4;
		flex-shrink: 0;
	}

	.url-text {
		flex: 1;
		font-size: 0.8rem;
		color: #e0e0e0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.remove-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		background: none;
		border: none;
		color: #888;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.remove-button:hover {
		color: #f44336;
		background: rgba(244, 67, 54, 0.1);
	}

	.help-text {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: #666;
	}
</style>
