<script lang="ts">
	interface Props {
		content: string;
		isStreaming: boolean;
	}

	let { content, isStreaming }: Props = $props();

	let copied = $state(false);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(content);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (e) {
			console.error('Failed to copy:', e);
		}
	}

	// Simple markdown to HTML conversion
	function renderMarkdown(md: string): string {
		if (!md) return '';

		let html = md
			// Headers
			.replace(/^### (.*$)/gm, '<h3>$1</h3>')
			.replace(/^## (.*$)/gm, '<h2>$1</h2>')
			.replace(/^# (.*$)/gm, '<h1>$1</h1>')
			// Bold
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			// Italic
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			// Lists
			.replace(/^\- (.*$)/gm, '<li>$1</li>')
			.replace(/^• (.*$)/gm, '<li>$1</li>')
			// Line breaks for paragraphs
			.replace(/\n\n/g, '</p><p>')
			// Links
			.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

		// Wrap in paragraph tags
		html = '<p>' + html + '</p>';

		// Fix lists
		html = html.replace(/<\/p><li>/g, '</p><ul><li>');
		html = html.replace(/<\/li><p>/g, '</li></ul><p>');

		return html;
	}
</script>

<div class="story-display">
	<div class="display-header">
		<h4 class="display-label">Generated Story</h4>
		<div class="display-actions">
			<button class="action-button" onclick={copyToClipboard} disabled={!content || isStreaming}>
				{#if copied}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="20 6 9 17 4 12"/>
					</svg>
					Copied!
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
					</svg>
					Copy
				{/if}
			</button>
		</div>
	</div>

	<div class="story-content" class:streaming={isStreaming}>
		{#if content}
			{@html renderMarkdown(content)}
			{#if isStreaming}
				<span class="cursor">▊</span>
			{/if}
		{:else}
			<p class="placeholder">Your generated story will appear here...</p>
		{/if}
	</div>
</div>

<style>
	.story-display {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 300px;
	}

	.display-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.display-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #7bafd4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0;
	}

	.display-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.375rem;
		color: #7bafd4;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-button:hover:not(:disabled) {
		background: rgba(123, 175, 212, 0.2);
		border-color: #7bafd4;
	}

	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.story-content {
		flex: 1;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.75rem;
		overflow-y: auto;
		color: #e0e0e0;
		line-height: 1.7;
		font-size: 0.95rem;
	}

	.story-content.streaming {
		border-color: #7bafd4;
	}

	.story-content :global(h1) {
		font-size: 1.5rem;
		font-weight: 700;
		color: #7bafd4;
		margin: 0 0 1rem 0;
		line-height: 1.3;
	}

	.story-content :global(h2) {
		font-size: 1.25rem;
		font-weight: 600;
		color: #9fc5e0;
		margin: 1.5rem 0 0.75rem 0;
		line-height: 1.3;
	}

	.story-content :global(h3) {
		font-size: 1.1rem;
		font-weight: 600;
		color: #b8d4e8;
		margin: 1.25rem 0 0.5rem 0;
		line-height: 1.3;
	}

	.story-content :global(p) {
		margin: 0 0 1rem 0;
	}

	.story-content :global(ul) {
		margin: 0.5rem 0 1rem 0;
		padding-left: 1.5rem;
	}

	.story-content :global(li) {
		margin: 0.25rem 0;
	}

	.story-content :global(strong) {
		color: #f4f4f4;
		font-weight: 600;
	}

	.story-content :global(em) {
		color: #c0c0c0;
	}

	.story-content :global(a) {
		color: #7bafd4;
		text-decoration: none;
	}

	.story-content :global(a:hover) {
		text-decoration: underline;
	}

	.placeholder {
		color: #666;
		font-style: italic;
	}

	.cursor {
		color: #7bafd4;
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}
</style>
