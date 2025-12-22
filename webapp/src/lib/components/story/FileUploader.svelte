<script lang="ts">
	import type { UploadedFile } from '$lib/types/story';

	interface Props {
		files: UploadedFile[];
		onfileschange: (files: UploadedFile[]) => void;
	}

	let { files, onfileschange }: Props = $props();

	let isDragging = $state(false);
	let isProcessing = $state(false);
	let error = $state<string | null>(null);

	async function processFile(file: File): Promise<UploadedFile | null> {
		const id = crypto.randomUUID();
		const name = file.name;
		const size = file.size;

		if (file.type === 'application/pdf') {
			try {
				// For PDFs, we'll extract text using a simple approach
				// In production, you'd use pdfjs-dist for better extraction
				const text = await extractTextFromPdf(file);
				return { id, name, type: 'pdf', extractedText: text, size };
			} catch (e) {
				console.error('PDF extraction failed:', e);
				error = `Failed to extract text from ${name}. Try a text file instead.`;
				return null;
			}
		} else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
			const text = await file.text();
			return { id, name, type: 'text', extractedText: text, size };
		} else {
			error = `Unsupported file type: ${file.type || 'unknown'}. Please use PDF or TXT files.`;
			return null;
		}
	}

	async function extractTextFromPdf(file: File): Promise<string> {
		// Simple approach: try to read as text (works for some PDFs)
		// For better extraction, integrate pdfjs-dist
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Look for text streams in PDF
		let text = '';
		const decoder = new TextDecoder('utf-8', { fatal: false });
		const content = decoder.decode(uint8Array);

		// Extract text between stream markers (basic approach)
		const streamMatches = content.match(/stream\s*([\s\S]*?)\s*endstream/g);
		if (streamMatches) {
			for (const match of streamMatches) {
				const streamContent = match.replace(/stream\s*/, '').replace(/\s*endstream/, '');
				// Filter to printable ASCII and basic unicode
				const printable = streamContent.replace(/[^\x20-\x7E\u00A0-\u00FF\n\r\t]/g, ' ');
				if (printable.trim().length > 20) {
					text += printable + '\n';
				}
			}
		}

		if (text.trim().length < 50) {
			throw new Error('Could not extract meaningful text from PDF');
		}

		return text.trim();
	}

	async function handleFiles(fileList: FileList | File[]) {
		error = null;
		isProcessing = true;

		const newFiles: UploadedFile[] = [];
		const filesToProcess = Array.from(fileList);

		for (const file of filesToProcess) {
			// Check file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				error = `File "${file.name}" is too large. Maximum size is 5MB.`;
				continue;
			}

			const processed = await processFile(file);
			if (processed) {
				newFiles.push(processed);
			}
		}

		if (newFiles.length > 0) {
			onfileschange([...files, ...newFiles]);
		}

		isProcessing = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		if (e.dataTransfer?.files) {
			handleFiles(e.dataTransfer.files);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			handleFiles(input.files);
		}
		// Reset input so same file can be selected again
		input.value = '';
	}

	function removeFile(id: string) {
		onfileschange(files.filter((f) => f.id !== id));
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<div class="file-uploader">
	<h4 class="uploader-label">Additional Context (Optional)</h4>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="drop-zone"
		class:dragging={isDragging}
		class:processing={isProcessing}
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
	>
		<input
			type="file"
			accept=".pdf,.txt,.md,text/plain,application/pdf"
			multiple
			onchange={handleInputChange}
			class="file-input"
			id="file-upload"
		/>
		<label for="file-upload" class="drop-zone-content">
			{#if isProcessing}
				<div class="spinner"></div>
				<span>Processing files...</span>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" y1="3" x2="12" y2="15" />
				</svg>
				<span>Drop PDF or text files here</span>
				<span class="or-text">or click to browse</span>
			{/if}
		</label>
	</div>

	{#if error}
		<p class="error-message">{error}</p>
	{/if}

	{#if files.length > 0}
		<div class="file-list">
			{#each files as file}
				<div class="file-item">
					<div class="file-icon">
						{#if file.type === 'pdf'}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
								<polyline points="14 2 14 8 20 8"/>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
								<polyline points="14 2 14 8 20 8"/>
								<line x1="16" y1="13" x2="8" y2="13"/>
								<line x1="16" y1="17" x2="8" y2="17"/>
							</svg>
						{/if}
					</div>
					<div class="file-info">
						<span class="file-name">{file.name}</span>
						<span class="file-size">{formatSize(file.size)} - {file.extractedText.length} chars extracted</span>
					</div>
					<button class="remove-file" onclick={() => removeFile(file.id)} aria-label="Remove file">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"/>
							<line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<p class="help-text">
		Upload proposal documents, papers, or notes to enrich the story context. Max 5MB per file.
	</p>
</div>

<style>
	.file-uploader {
		margin-bottom: 1.5rem;
	}

	.uploader-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #7bafd4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.drop-zone {
		position: relative;
		border: 2px dashed rgba(123, 175, 212, 0.3);
		border-radius: 0.75rem;
		background: rgba(0, 0, 0, 0.3);
		transition: all 0.2s ease;
	}

	.drop-zone.dragging {
		border-color: #7bafd4;
		background: rgba(123, 175, 212, 0.1);
	}

	.drop-zone.processing {
		opacity: 0.7;
		pointer-events: none;
	}

	.file-input {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.drop-zone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 2rem 1rem;
		color: #888;
		cursor: pointer;
	}

	.drop-zone:hover .drop-zone-content {
		color: #7bafd4;
	}

	.or-text {
		font-size: 0.75rem;
		color: #666;
	}

	.spinner {
		width: 24px;
		height: 24px;
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

	.error-message {
		margin-top: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		border-radius: 0.5rem;
		color: #f44336;
		font-size: 0.8rem;
	}

	.file-list {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.file-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
	}

	.file-icon {
		color: #7bafd4;
		display: flex;
	}

	.file-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.file-name {
		font-size: 0.85rem;
		color: #e0e0e0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-size {
		font-size: 0.7rem;
		color: #888;
	}

	.remove-file {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: none;
		border: none;
		color: #888;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
	}

	.remove-file:hover {
		color: #f44336;
		background: rgba(244, 67, 54, 0.1);
	}

	.help-text {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: #666;
	}
</style>
