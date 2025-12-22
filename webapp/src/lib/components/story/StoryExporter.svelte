<script lang="ts">
	import type { AudienceType } from '$lib/types/settings';
	import { AUDIENCE_LABELS } from '$lib/types/settings';

	interface Props {
		content: string;
		projectName: string;
		audience: AudienceType;
		disabled: boolean;
	}

	let { content, projectName, audience, disabled }: Props = $props();

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
		// Use browser print dialog for PDF
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

		// Wait for content to load then trigger print
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
</script>

<div class="story-exporter">
	<h4 class="exporter-label">Export Story</h4>
	<div class="export-buttons">
		<button class="export-button" onclick={exportMarkdown} {disabled}>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
				<polyline points="14 2 14 8 20 8"/>
				<line x1="16" y1="13" x2="8" y2="13"/>
				<line x1="16" y1="17" x2="8" y2="17"/>
			</svg>
			<span>Markdown (.md)</span>
		</button>
		<button class="export-button" onclick={exportPdf} {disabled}>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
				<polyline points="14 2 14 8 20 8"/>
				<path d="M12 18v-6"/>
				<path d="M9 15l3 3 3-3"/>
			</svg>
			<span>PDF (Print)</span>
		</button>
	</div>
</div>

<style>
	.story-exporter {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(123, 175, 212, 0.2);
	}

	.exporter-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #7bafd4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.export-buttons {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.export-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.export-button:hover:not(:disabled) {
		background: rgba(123, 175, 212, 0.2);
		border-color: #7bafd4;
	}

	.export-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 480px) {
		.export-buttons {
			flex-direction: column;
		}

		.export-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
