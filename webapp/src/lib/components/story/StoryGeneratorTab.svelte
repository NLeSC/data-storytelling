<script lang="ts">
	import { onMount } from 'svelte';
	import AudienceSelector from './AudienceSelector.svelte';
	import ModelSelector from './ModelSelector.svelte';
	import RelatedSoftwareSelector from './RelatedSoftwareSelector.svelte';
	import FileUploader from './FileUploader.svelte';
	import StoryDisplay from './StoryDisplay.svelte';
	import InlineModelLoader from './InlineModelLoader.svelte';
	import { settingsStore, initSettings, canGenerate } from '$lib/stores/settings.svelte';
	import { generateStoryStream } from '$lib/api/llm';
	import {
		fetchSoftwareInOrganisation,
		fetchEnrichedMetadata,
		type EnrichedMetadata
	} from '$lib/api/rsd-software';
	import { RSD_PROJECT_DOMAIN, type ProjectWithDomain } from '$lib/types/project';
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
			} else {
				error = 'Please configure your Gemini API key in Settings first.';
			}
			return;
		}

		error = null;
		isGenerating = true;
		generatedContent = '';

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
			// Use streaming for better UX
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
	{#if !canGenerate()}
		<div class="api-key-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
				/>
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>
			<div class="warning-content">
				{#if settingsStore.current.provider === 'local'}
					<p>No local model loaded</p>
					<InlineModelLoader />
				{:else}
					<p>Gemini API key not configured</p>
					<button class="configure-button" onclick={onOpenSettings}>
						Configure in Settings
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<div class="generator-layout">
		<div class="config-panel">
			<div id="metadata-status" class="metadata-status">
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
			</div>

			<AudienceSelector selected={audience} onchange={handleAudienceChange} />

			<RelatedSoftwareSelector
				software={relatedSoftware}
				selected={selectedSoftwareIds}
				loading={loadingSoftware}
				onchange={handleSoftwareSelectionChange}
			/>

			<FileUploader files={uploadedFiles} onfileschange={handleFilesChange} />

			<ModelSelector />

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

				<button class="generate-button" onclick={generateStory} disabled={!canGenerateNow}>
					{#if isGenerating}
						<div class="spinner"></div>
						Generating...
					{:else}
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
					{/if}
				</button>
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
		padding: 0.75rem 1rem;
		background: rgba(244, 67, 54, 0.1);
		border: 1px solid rgba(244, 67, 54, 0.3);
		border-radius: 0.5rem;
		color: #f44336;
		font-size: 0.85rem;
	}

	.metadata-status {
		min-height: 1.75rem;
	}

	.metadata-loading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.spinner-sm {
		width: 12px;
		height: 12px;
		border: 2px solid rgba(255, 255, 255, 0.15);
		border-top-color: rgba(255, 255, 255, 0.5);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.metadata-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.metadata-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background: rgba(123, 175, 212, 0.12);
		border: 1px solid rgba(123, 175, 212, 0.25);
		border-radius: 9999px;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.65);
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
