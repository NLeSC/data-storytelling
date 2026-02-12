<script lang="ts">
	import type { ProjectWithDomain } from '$lib/types/project';
	import { getProjectImageUrl, getProjectPageUrl, SOFTWARE_DOMAIN } from '$lib/types/project';
	import { fade, scale } from 'svelte/transition';
	import StoryGeneratorTab from './story/StoryGeneratorTab.svelte';

	type TabType = 'details' | 'story';

	interface Props {
		project: ProjectWithDomain | null;
		onClose: () => void;
		onOpenSettings?: () => void;
	}

	let { project, onClose, onOpenSettings }: Props = $props();

	let activeTab = $state<TabType>('details');

	const isOpen = $derived(project !== null);
	const isSoftware = $derived(project?.domain.id === SOFTWARE_DOMAIN.id);
	const imageUrl = $derived(project ? getProjectImageUrl(project.image_id) : null);
	const projectUrl = $derived(project ? getProjectPageUrl(project.slug) : null);

	// Reset tab when modal closes/opens
	$effect(() => {
		if (!isOpen) {
			activeTab = 'details';
		}
	});

	function handleOpenSettings() {
		if (onOpenSettings) {
			onOpenSettings();
		}
	}

	// Close on escape key
	$effect(() => {
		if (typeof window === 'undefined') return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleEscape);
			// Prevent body scroll when modal is open
			document.body.style.overflow = 'hidden';
		}

		return () => {
			window.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = '';
		};
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

{#if isOpen && project}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
	>
		<div class="modal-content" class:story-mode={activeTab === 'story'} transition:scale={{ duration: 300, start: 0.9 }}>
			<!-- Modal Header -->
			<div class="modal-header">
				<!-- Tab Navigation -->
				<div class="tab-navigation">
					<button
						class="tab-button"
						class:active={activeTab === 'details'}
						onclick={() => (activeTab = 'details')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<line x1="12" y1="16" x2="12" y2="12"/>
							<line x1="12" y1="8" x2="12.01" y2="8"/>
						</svg>
						Details
					</button>
					<button
						class="tab-button"
						class:active={activeTab === 'story'}
						onclick={() => (activeTab = 'story')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
						</svg>
						Generate Story
					</button>
				</div>

				<!-- Close button -->
				<button class="close-button" onclick={onClose} aria-label="Close modal">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			{#if activeTab === 'details'}
			<!-- Details Tab Content -->
			<div class="details-tab">
			<!-- Domain badge -->
			<div class="domain-badge" style="background-color: {project.domain.color};">
				{#if isSoftware}
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;">
						<polyline points="16 18 22 12 16 6"></polyline>
						<polyline points="8 6 2 12 8 18"></polyline>
					</svg>
				{/if}
				{project.domain.name}
			</div>

			<!-- Project logo -->
			{#if imageUrl}
				<div class="logo-container">
					<img src={imageUrl} alt="{project.brand_name} logo" class="project-logo" />
				</div>
			{/if}

			<!-- Project name -->
			<h2 class="project-title">{project.brand_name}</h2>

			<!-- Short statement -->
			{#if project.short_statement}
				<p class="project-subtitle">{project.short_statement}</p>
			{/if}

			<!-- DOI -->
			{#if project.concept_doi}
				<div class="doi-badge">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
						<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
					</svg>
					<span>DOI: {project.concept_doi}</span>
				</div>
			{/if}

			<!-- Description -->
			<div class="project-description">
				<h3 class="section-title">About</h3>
				<div class="description-content">
					{@html project.description.replace(/\n/g, '<br />')}
				</div>
			</div>

			<!-- Metadata -->
			<div class="metadata-grid">
				<div class="metadata-item">
					<span class="metadata-label">Status</span>
					<span class="metadata-value">
						{project.is_published ? 'Published' : 'Draft'}
					</span>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Source</span>
					<span class="metadata-value">
						{project.closed_source ? 'Closed Source' : 'Open Source'}
					</span>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Created</span>
					<span class="metadata-value">
						{new Date(project.created_at).toLocaleDateString()}
					</span>
				</div>
				<div class="metadata-item">
					<span class="metadata-label">Updated</span>
					<span class="metadata-value">
						{new Date(project.updated_at).toLocaleDateString()}
					</span>
				</div>
			</div>

			<!-- Action buttons -->
			<div class="action-buttons">
				{#if project.get_started_url}
					<a href={project.get_started_url} target="_blank" rel="noopener noreferrer" class="btn-primary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
							<polyline points="15 3 21 3 21 9"></polyline>
							<line x1="10" y1="14" x2="21" y2="3"></line>
						</svg>
						Get Started
					</a>
				{/if}
				{#if projectUrl}
					<a href={projectUrl} target="_blank" rel="noopener noreferrer" class="btn-secondary">
						View on RSD
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
							<polyline points="15 3 21 3 21 9"></polyline>
							<line x1="10" y1="14" x2="21" y2="3"></line>
						</svg>
					</a>
				{/if}
			</div>
			</div>
			{:else}
			<!-- Story Generator Tab Content -->
			<div class="story-tab">
				<StoryGeneratorTab {project} onOpenSettings={handleOpenSettings} />
			</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(10px);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		overflow-y: auto;
	}

	.modal-content {
		background: linear-gradient(
			135deg,
			rgba(10, 10, 10, 0.95) 0%,
			rgba(59, 31, 84, 0.9) 50%,
			rgba(10, 10, 10, 0.95) 100%
		);
		backdrop-filter: blur(20px);
		border-radius: 1.5rem;
		border: 1px solid rgba(123, 175, 212, 0.3);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		padding: 3rem;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.modal-content.story-mode {
		max-width: 1200px;
		height: 90vh;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(123, 175, 212, 0.2);
	}

	.tab-navigation {
		display: flex;
		gap: 0.5rem;
	}

	.tab-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(123, 175, 212, 0.2);
		border-radius: 0.5rem;
		color: #888;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-button:hover {
		background: rgba(123, 175, 212, 0.1);
		color: #7bafd4;
		border-color: rgba(123, 175, 212, 0.4);
	}

	.tab-button.active {
		background: rgba(123, 175, 212, 0.15);
		color: #7bafd4;
		border-color: #7bafd4;
	}

	.details-tab {
		flex: 1;
	}

	.story-tab {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.close-button {
		background: rgba(123, 175, 212, 0.2);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.close-button:hover {
		background: rgba(123, 175, 212, 0.3);
		border-color: #7bafd4;
		transform: scale(1.1);
	}

	.domain-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		margin-bottom: 1.5rem;
	}

	.logo-container {
		width: 150px;
		height: 150px;
		margin: 0 auto 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 1rem;
		padding: 1rem;
	}

	.project-logo {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.project-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #7bafd4;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	.project-subtitle {
		font-size: 1.25rem;
		color: #e0e0e0;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.doi-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(123, 175, 212, 0.1);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		font-size: 0.875rem;
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #7bafd4;
		margin-bottom: 1rem;
	}

	.project-description {
		margin-bottom: 2rem;
	}

	.description-content {
		color: #e0e0e0;
		line-height: 1.8;
		font-size: 1rem;
	}

	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 1rem;
		border: 1px solid rgba(123, 175, 212, 0.2);
	}

	.metadata-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.metadata-label {
		font-size: 0.75rem;
		color: #7bafd4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	.metadata-value {
		font-size: 1rem;
		color: #e0e0e0;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.btn-primary {
		background: linear-gradient(135deg, #7bafd4, #5a95b8);
		color: white;
		border: none;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(123, 175, 212, 0.4);
	}

	.btn-secondary {
		background: transparent;
		color: #7bafd4;
		border: 1px solid #7bafd4;
	}

	.btn-secondary:hover {
		background: rgba(123, 175, 212, 0.1);
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.modal-content {
			padding: 2rem;
		}

		.project-title {
			font-size: 2rem;
		}

		.metadata-grid {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
			justify-content: center;
		}
	}
</style>
