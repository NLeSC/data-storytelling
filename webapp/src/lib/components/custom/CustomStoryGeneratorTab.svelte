<script lang="ts">
	import { onMount } from 'svelte';
	import AudienceSelector from '../story/AudienceSelector.svelte';
	import ModelSelector from '../story/ModelSelector.svelte';
	import FileUploader from '../story/FileUploader.svelte';
	import StoryDisplay from '../story/StoryDisplay.svelte';
	import UrlReferencesInput from './UrlReferencesInput.svelte';
	import { settingsStore, initSettings, hasApiKey } from '$lib/stores/settings.svelte';
	import { generateStoryStream } from '$lib/api/gemini';
	import type { AudienceType } from '$lib/types/settings';
	import type { UploadedFile, StoryGenerationRequest } from '$lib/types/story';

	interface Props {
		onOpenSettings: () => void;
	}

	let { onOpenSettings }: Props = $props();

	// State
	let projectTitle = $state('');
	let projectDescription = $state('');
	let urls = $state<string[]>([]);
	let audience = $state<AudienceType>('communications');
	let uploadedFiles = $state<UploadedFile[]>([]);
	let isGenerating = $state(false);
	let generatedContent = $state('');
	let error = $state<string | null>(null);

	onMount(() => {
		initSettings();
		audience = settingsStore.current.defaultAudience;
	});

	function handleAudienceChange(newAudience: AudienceType) {
		audience = newAudience;
	}

	function handleUrlsChange(newUrls: string[]) {
		urls = newUrls;
	}

	function handleFilesChange(files: UploadedFile[]) {
		uploadedFiles = files;
	}

	async function generateStory() {
		if (!hasApiKey()) {
			error = 'Please configure your Gemini API key in Settings first.';
			return;
		}

		if (!projectTitle.trim()) {
			error = 'Please enter a project title.';
			return;
		}

		error = null;
		isGenerating = true;
		generatedContent = '';

		const additionalContext = uploadedFiles
			.map((f) => `--- ${f.name} ---\n${f.extractedText}`)
			.join('\n\n');

		const request: StoryGenerationRequest = {
			project: {
				id: `custom-${crypto.randomUUID()}`,
				brand_name: projectTitle.trim(),
				description: projectDescription.trim() || 'No description provided.',
				short_statement: null,
				concept_doi: null,
				get_started_url: null
			},
			audience,
			relatedSoftware: [],
			additionalContext,
			urls: urls.length > 0 ? urls : undefined
		};

		try {
			const stream = generateStoryStream(request, settingsStore.current);

			for await (const chunk of stream) {
				generatedContent += chunk;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to generate story';
			console.error('Generation error:', e);
		} finally {
			isGenerating = false;
		}
	}

	const canGenerate = $derived(hasApiKey() && !isGenerating && projectTitle.trim().length > 0);
</script>

<div id="custom-story-generator-tab" class="story-generator-tab">
	{#if !hasApiKey()}
		<div class="api-key-warning">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
				<line x1="12" y1="9" x2="12" y2="13"/>
				<line x1="12" y1="17" x2="12.01" y2="17"/>
			</svg>
			<div class="warning-content">
				<p>Gemini API key not configured</p>
				<button class="configure-button" onclick={onOpenSettings}>
					Configure in Settings
				</button>
			</div>
		</div>
	{/if}

	<div class="generator-layout">
		<div class="config-panel">
			<div class="input-section">
				<h4 class="section-label">Project Title <span class="required">*</span></h4>
				<input
					type="text"
					bind:value={projectTitle}
					placeholder="Enter your project name"
					class="text-input"
				/>
			</div>

			<div class="input-section">
				<h4 class="section-label">Project Description</h4>
				<textarea
					bind:value={projectDescription}
					placeholder="Describe your project, its goals, and what it does..."
					class="textarea-input"
					rows="4"
				></textarea>
			</div>

			<UrlReferencesInput {urls} onchange={handleUrlsChange} />

			<AudienceSelector selected={audience} onchange={handleAudienceChange} />

			<FileUploader files={uploadedFiles} onfileschange={handleFilesChange} />

			<ModelSelector />

			<button
				class="generate-button"
				onclick={generateStory}
				disabled={!canGenerate}
			>
				{#if isGenerating}
					<div class="spinner"></div>
					Generating...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
					</svg>
					Generate Story
				{/if}
			</button>

			{#if error}
				<div class="error-message">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<line x1="12" y1="8" x2="12" y2="12"/>
						<line x1="12" y1="16" x2="12.01" y2="16"/>
					</svg>
					{error}
				</div>
			{/if}
		</div>

		<div class="output-panel">
			<StoryDisplay content={generatedContent} isStreaming={isGenerating} projectName={projectTitle || 'Custom Project'} {audience} />
		</div>
	</div>
</div>

<style>
	.story-generator-tab {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
	}

	.api-key-warning {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(244, 184, 65, 0.1);
		border: 1px solid rgba(244, 184, 65, 0.3);
		border-radius: 0.75rem;
		color: #f4b841;
	}

	.warning-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.warning-content p {
		margin: 0;
		font-size: 0.9rem;
	}

	.configure-button {
		align-self: flex-start;
		padding: 0.375rem 0.75rem;
		background: rgba(244, 184, 65, 0.2);
		border: 1px solid rgba(244, 184, 65, 0.5);
		border-radius: 0.375rem;
		color: #f4b841;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.configure-button:hover {
		background: rgba(244, 184, 65, 0.3);
	}

	.generator-layout {
		display: grid;
		grid-template-columns: 350px 1fr;
		gap: 1.5rem;
		flex: 1;
		min-height: 0;
	}

	.config-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
		overflow-y: auto;
	}

	.output-panel {
		display: flex;
		flex-direction: column;
		min-height: 400px;
	}

	.input-section {
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

	.required {
		color: #f44336;
	}

	.text-input {
		width: 100%;
		padding: 0.625rem 0.75rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
		color: #e0e0e0;
		font-size: 0.9rem;
		outline: none;
		transition: border-color 0.2s ease;
		box-sizing: border-box;
	}

	.text-input::placeholder {
		color: #666;
	}

	.text-input:focus {
		border-color: #7bafd4;
	}

	.textarea-input {
		width: 100%;
		padding: 0.625rem 0.75rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
		color: #e0e0e0;
		font-size: 0.85rem;
		font-family: inherit;
		outline: none;
		transition: border-color 0.2s ease;
		resize: vertical;
		min-height: 80px;
		box-sizing: border-box;
	}

	.textarea-input::placeholder {
		color: #666;
	}

	.textarea-input:focus {
		border-color: #7bafd4;
	}

	.generate-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, #7bafd4, #5a95b8);
		border: none;
		border-radius: 0.75rem;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-top: 0.5rem;
	}

	.generate-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(123, 175, 212, 0.4);
	}

	.generate-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
		padding: 0.75rem 1rem;
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		border-radius: 0.5rem;
		color: #f44336;
		font-size: 0.85rem;
	}

	@media (max-width: 900px) {
		.generator-layout {
			grid-template-columns: 1fr;
		}

		.output-panel {
			min-height: 300px;
		}
	}
</style>
