<script lang="ts">
	import { onMount } from 'svelte';
	import AudienceSelector from './AudienceSelector.svelte';
	import ModelSelector from './ModelSelector.svelte';
	import RelatedSoftwareSelector from './RelatedSoftwareSelector.svelte';
	import FileUploader from './FileUploader.svelte';
	import StoryDisplay from './StoryDisplay.svelte';
	import { settingsStore, initSettings, canGenerate } from '$lib/stores/settings.svelte';
	import { generateStoryStream } from '$lib/api/llm';
	import {
		fetchSoftwareInOrganisation,
		fetchEnrichedMetadata,
		type EnrichedMetadata
	} from '$lib/api/rsd-software';
	import { SOFTWARE_DOMAIN, RSD_PROJECT_DOMAIN, type ProjectWithDomain } from '$lib/types/project';
	import type { AudienceType } from '$lib/types/settings';
	import type { RelatedSoftware, UploadedFile, StoryGenerationRequest } from '$lib/types/story';

	interface Props {
		project: ProjectWithDomain;
		onOpenSettings: () => void;
	}

	let { project, onOpenSettings }: Props = $props();

	// State
	let audience = $state<AudienceType>('communications');
	let relatedSoftware = $state<RelatedSoftware[]>([]);
	let selectedSoftwareIds = $state<string[]>([]);
	let uploadedFiles = $state<UploadedFile[]>([]);
	let loadingSoftware = $state(false);
	let enrichedMetadata = $state<EnrichedMetadata | null>(null);
	let loadingMetadata = $state(false);
	let isGenerating = $state(false);
	let generatedContent = $state('');
	let error = $state<string | null>(null);
	let abortController: AbortController | null = null;

	// Initialize on mount
	onMount(() => {
		initSettings();
		audience = settingsStore.current.defaultAudience;
		loadRelatedSoftware();
		loadEnrichedMetadata();
	});

	async function loadEnrichedMetadata() {
		loadingMetadata = true;
		try {
			const entityType = project.domain.id === RSD_PROJECT_DOMAIN.id ? 'rsd-project' : 'software';
			enrichedMetadata = await fetchEnrichedMetadata(project.id, entityType);
		} catch (e) {
			console.error('Failed to load enriched metadata:', e);
		} finally {
			loadingMetadata = false;
		}
	}

	// Load related software when project changes
	async function loadRelatedSoftware() {
		// Skip for search results — synthetic domains don't have real organisation IDs
		if (project.domain.id === SOFTWARE_DOMAIN.id || project.domain.id === RSD_PROJECT_DOMAIN.id) {
			return;
		}
		loadingSoftware = true;
		try {
			// Fetch software from the same organisation/domain
			const software = await fetchSoftwareInOrganisation(project.domain.id, project.id, 15);
			relatedSoftware = software;
		} catch (e) {
			console.error('Failed to load related software:', e);
		} finally {
			loadingSoftware = false;
		}
	}

	function handleAudienceChange(newAudience: AudienceType) {
		audience = newAudience;
	}

	function handleSoftwareSelectionChange(ids: string[]) {
		selectedSoftwareIds = ids;
	}

	function handleFilesChange(files: UploadedFile[]) {
		uploadedFiles = files;
	}

	async function generateStory() {
		if (!canGenerate()) {
			if (settingsStore.current.provider === 'local') {
				error = 'Please load a local model first.';
			} else if (settingsStore.current.provider === 'custom') {
				error = 'Please configure your custom server URL in Settings first.';
			} else {
				error = 'Please configure your Gemini API key in Settings first.';
			}
			return;
		}

		error = null;
		isGenerating = true;
		generatedContent = '';
		abortController = new AbortController();

		// Build the request
		const selectedSoftware = relatedSoftware.filter((sw) => selectedSoftwareIds.includes(sw.id));

		const additionalContext = uploadedFiles
			.map((f) => `--- ${f.name} ---\n${f.extractedText}`)
			.join('\n\n');

		const request: StoryGenerationRequest = {
			project: {
				id: project.id,
				brand_name: project.brand_name,
				description: project.description,
				short_statement: project.short_statement,
				concept_doi: project.concept_doi,
				get_started_url: project.get_started_url
			},
			audience,
			relatedSoftware: selectedSoftware,
			additionalContext,
			enrichedMetadata: enrichedMetadata ?? undefined
		};

		try {
			const stream = generateStoryStream(request, settingsStore.current, abortController.signal);

			for await (const chunk of stream) {
				generatedContent += chunk;
			}
		} catch (e) {
			if (e instanceof DOMException && e.name === 'AbortError') {
				// User stopped generation — not an error
			} else {
				error = e instanceof Error ? e.message : 'Failed to generate story';
				console.error('Generation error:', e);
			}
		} finally {
			isGenerating = false;
			abortController = null;
		}
	}

	function stopGeneration() {
		abortController?.abort();
	}

	const canGenerateNow = $derived(canGenerate() && !isGenerating);

	const metadataSummary = $derived.by(() => {
		if (!enrichedMetadata) return [];
		const parts: string[] = [];
		if (enrichedMetadata.team.length > 0) parts.push(`${enrichedMetadata.team.length} team`);
		if (enrichedMetadata.keywords.length > 0)
			parts.push(`${enrichedMetadata.keywords.length} keywords`);
		if (enrichedMetadata.mentions.length > 0)
			parts.push(`${enrichedMetadata.mentions.length} publications`);
		if (enrichedMetadata.licenses.length > 0) {
			const name = enrichedMetadata.licenses[0].name || enrichedMetadata.licenses[0].license;
			parts.push(name);
		}
		if (enrichedMetadata.packages.length > 0)
			parts.push(`${enrichedMetadata.packages.length} packages`);
		if (enrichedMetadata.urls.length > 0) parts.push(`${enrichedMetadata.urls.length} links`);
		if (enrichedMetadata.researchDomains.length > 0)
			parts.push(`${enrichedMetadata.researchDomains.length} domains`);
		return parts;
	});
</script>

<div class="story-generator-tab">
	<div class="generator-layout">
		<div class="config-panel">
			<ModelSelector />
			<AudienceSelector selected={audience} onchange={handleAudienceChange} />

			<!-- <div id="metadata-status" class="metadata-status">
				{#if loadingMetadata}
					<div class="metadata-loading">
						<div class="spinner-sm"></div>
						<span>Loading project metadata...</span>
					</div>
				{:else if metadataSummary.length > 0}
					<div class="metadata-badges">
						{#each metadataSummary as badge}
							<span class="metadata-badge">{badge}</span>
						{/each}
					</div>
				{/if}
			</div> -->
			<FileUploader files={uploadedFiles} onfileschange={handleFilesChange} />

			<RelatedSoftwareSelector
				software={relatedSoftware}
				selected={selectedSoftwareIds}
				loading={loadingSoftware}
				onchange={handleSoftwareSelectionChange}
			/>

			<div class="generate-footer">
				{#if error}
					<div class="error-message">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						{error}
					</div>
				{/if}

				{#if isGenerating}
					<button class="generate-button stop" onclick={stopGeneration}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="currentColor"
							stroke="none"
						>
							<rect x="6" y="6" width="12" height="12" rx="2" />
						</svg>
						Stop
					</button>
				{:else}
					<button class="generate-button" onclick={generateStory} disabled={!canGenerateNow}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
						</svg>
						Generate Story
					</button>
				{/if}
			</div>
		</div>

		<div class="output-panel">
			<StoryDisplay
				content={generatedContent}
				isStreaming={isGenerating}
				projectName={project.brand_name}
				{audience}
			/>
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

	.generate-footer {
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.75rem;
		padding-bottom: 0.25rem;
		margin-top: auto;
		z-index: 1;
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

	.generate-button.stop {
		background: linear-gradient(135deg, #e05555, #c03030);
	}

	.generate-button.stop:hover {
		box-shadow: 0 8px 20px rgba(224, 85, 85, 0.4);
	}

	.generate-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
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
