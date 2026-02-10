<script lang="ts">
	import type { AudienceType } from '$lib/types/settings';
	import { AUDIENCE_LABELS } from '$lib/types/settings';

	interface Props {
		content: string;
		isStreaming: boolean;
		projectName?: string;
		audience?: AudienceType;
	}

	let { content, isStreaming, projectName = '', audience = 'communications' }: Props = $props();

	let copied = $state(false);

	const exportDisabled = $derived(!content || isStreaming);

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

	function sanitizeFilename(name: string): string {
		return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
	}

	function downloadFile(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function exportMarkdown() {
		const timestamp = new Date().toISOString().split('T')[0];
		const filename = `${sanitizeFilename(projectName)}-${audience}-${timestamp}.md`;

		const header = `---
title: "${projectName} - ${AUDIENCE_LABELS[audience]}"
generated: ${new Date().toISOString()}
audience: ${audience}
---

`;
		const fullContent = header + content;
		const blob = new Blob([fullContent], { type: 'text/markdown' });
		downloadFile(blob, filename);
	}

	function exportPdf() {
		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			alert('Please allow popups to export PDF');
			return;
		}

		const timestamp = new Date().toLocaleDateString();
		const html = `
<!DOCTYPE html>
<html>
<head>
	<title>${projectName} - ${AUDIENCE_LABELS[audience]}</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			max-width: 800px;
			margin: 0 auto;
			padding: 2rem;
			line-height: 1.7;
			color: #333;
		}
		h1 { font-size: 1.75rem; color: #1a1a1a; margin-bottom: 0.5rem; }
		h2 { font-size: 1.35rem; color: #2a2a2a; margin-top: 1.5rem; }
		h3 { font-size: 1.15rem; color: #3a3a3a; margin-top: 1.25rem; }
		p { margin: 1rem 0; }
		ul { margin: 0.5rem 0 1rem 1.5rem; }
		li { margin: 0.25rem 0; }
		strong { color: #1a1a1a; }
		a { color: #0066cc; }
		.meta {
			font-size: 0.85rem;
			color: #666;
			border-bottom: 1px solid #ddd;
			padding-bottom: 1rem;
			margin-bottom: 1.5rem;
		}
		@media print {
			body { padding: 0; }
		}
	</style>
</head>
<body>
	<h1>${projectName}</h1>
	<div class="meta">
		<strong>Audience:</strong> ${AUDIENCE_LABELS[audience]} |
		<strong>Generated:</strong> ${timestamp}
	</div>
	${markdownToHtml(content)}
</body>
</html>`;

		printWindow.document.write(html);
		printWindow.document.close();

		setTimeout(() => {
			printWindow.print();
		}, 250);
	}

	function markdownToHtml(md: string): string {
		if (!md) return '';

		return md
			.replace(/^### (.*$)/gm, '<h3>$1</h3>')
			.replace(/^## (.*$)/gm, '<h2>$1</h2>')
			.replace(/^# (.*$)/gm, '<h1>$1</h1>')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/^\- (.*$)/gm, '<li>$1</li>')
			.replace(/^• (.*$)/gm, '<li>$1</li>')
			.replace(/\n\n/g, '</p><p>')
			.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
			.replace(/<\/p><li>/g, '</p><ul><li>')
			.replace(/<\/li><p>/g, '</li></ul><p>')
			.replace(/^(.+)$/gm, (match) => {
				if (match.startsWith('<')) return match;
				return `<p>${match}</p>`;
			});
	}

	// Simple markdown to HTML conversion for display
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

<div id="story-display" class="story-display">
	<div class="display-header">
		<h4 class="display-label">Generated Story</h4>
		<div class="display-actions">
			<button class="action-button" onclick={exportMarkdown} disabled={exportDisabled} title="Export as Markdown">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
					<polyline points="14 2 14 8 20 8"/>
					<line x1="16" y1="13" x2="8" y2="13"/>
					<line x1="16" y1="17" x2="8" y2="17"/>
				</svg>
				.md
			</button>
			<button class="action-button" onclick={exportPdf} disabled={exportDisabled} title="Export as PDF">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
					<polyline points="14 2 14 8 20 8"/>
					<path d="M12 18v-6"/>
					<path d="M9 15l3 3 3-3"/>
				</svg>
				PDF
			</button>
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
