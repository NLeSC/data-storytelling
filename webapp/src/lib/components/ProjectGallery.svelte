<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
	import ProjectGalleryScene from './threlte/ProjectGalleryScene.svelte';
	import ProjectModal from './ProjectModal.svelte';
	import { fetchAllProjects } from '$lib/api/projects';
	import type { ProjectWithDomain, ResearchDomain } from '$lib/types/project';
	import { RESEARCH_DOMAINS } from '$lib/types/project';

	// State
	let projects = $state<ProjectWithDomain[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let selectedDomain = $state<ResearchDomain | null>(null);
	let selectedProject = $state<ProjectWithDomain | null>(null);
	let searchQuery = $state('');

	// Filtered projects based on search
	const filteredProjects = $derived(
		searchQuery.trim()
			? projects.filter(
					(p) =>
						p.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						p.short_statement.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: projects
	);

	// Project counts by domain
	const domainCounts = $derived.by(() => {
		const counts = new Map<string, number>();
		projects.forEach((p) => {
			counts.set(p.domain.id, (counts.get(p.domain.id) || 0) + 1);
		});
		return counts;
	});

	// Load projects on mount
	onMount(async () => {
		try {
			loading = true;
			projects = await fetchAllProjects();
			console.log(`Loaded ${projects.length} projects`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load projects';
			console.error('Error loading projects:', err);
		} finally {
			loading = false;
		}
	});

	function handleProjectClick(project: ProjectWithDomain) {
		selectedProject = project;
	}

	function closeModal() {
		selectedProject = null;
	}

	function handleDomainFilter(domain: ResearchDomain | null) {
		selectedDomain = domain;
	}

	function resetCamera() {
		// This could be enhanced to actually reset the OrbitControls
		selectedDomain = null;
		searchQuery = '';
	}
</script>

<div class="gallery-container">
	<!-- Header with controls -->
	<div class="gallery-header">
		<div class="header-content">
			<h2 class="gallery-title">Project Gallery</h2>
			<p class="gallery-subtitle">
				Explore {projects.length} research software projects from eScience Center
			</p>
		</div>

		<!-- Search bar -->
		<div class="search-container">
			<svg
				class="search-icon"
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
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search projects..."
				class="search-input"
			/>
			{#if searchQuery}
				<button class="clear-search" onclick={() => (searchQuery = '')}>
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
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			{/if}
		</div>

		<!-- Domain filters -->
		<div class="domain-filters">
			<button
				class="domain-filter-btn"
				class:active={!selectedDomain}
				onclick={() => handleDomainFilter(null)}
			>
				All Projects ({projects.length})
			</button>
			{#each RESEARCH_DOMAINS as domain}
				<button
					class="domain-filter-btn"
					class:active={selectedDomain?.id === domain.id}
					style="--domain-color: {domain.color}"
					onclick={() => handleDomainFilter(domain)}
				>
					{domain.name.split(' ').slice(-1)[0]} ({domainCounts.get(domain.id) || 0})
				</button>
			{/each}
			<button class="reset-btn" onclick={resetCamera} title="Reset view">
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
					<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
					<path d="M21 3v5h-5"></path>
					<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
					<path d="M3 21v-5h5"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- 3D Canvas -->
	<div class="canvas-container">
		{#if loading}
			<div class="loading-overlay">
				<div class="spinner"></div>
				<p class="loading-text">Loading projects...</p>
			</div>
		{:else if error}
			<div class="error-overlay">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
				<p class="error-text">{error}</p>
				<button class="retry-btn" onclick={() => window.location.reload()}>Retry</button>
			</div>
		{:else}
			<Canvas>
				<ProjectGalleryScene
					projects={filteredProjects}
					{selectedDomain}
					onProjectClick={handleProjectClick}
					{selectedProject}
				/>
			</Canvas>
		{/if}
	</div>

	<!-- Instructions overlay -->
	{#if !loading && !error}
		<div class="instructions">
			<p>🖱️ Drag to rotate • 🔍 Scroll to zoom • Click cards for details</p>
		</div>
	{/if}

	<!-- Project stats -->
	{#if !loading && !error}
		<div class="stats-overlay">
			<div class="stat-item">
				<span class="stat-value">{filteredProjects.length}</span>
				<span class="stat-label">Projects</span>
			</div>
			<div class="stat-item">
				<span class="stat-value">{RESEARCH_DOMAINS.length}</span>
				<span class="stat-label">Domains</span>
			</div>
		</div>
	{/if}
</div>

<!-- Project Modal -->
<ProjectModal project={selectedProject} onClose={closeModal} />

<style>
	.gallery-container {
		position: relative;
		width: 100%;
		height: 100vh;
		background: linear-gradient(180deg, #0a0a0a 0%, #1a0a2a 100%);
		overflow: hidden;
	}

	.gallery-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 2rem;
		background: linear-gradient(180deg, rgba(10, 10, 10, 0.9) 0%, transparent 100%);
		backdrop-filter: blur(10px);
	}

	.header-content {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.gallery-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #7bafd4;
		margin-bottom: 0.5rem;
	}

	.gallery-subtitle {
		font-size: 1rem;
		color: #e0e0e0;
		opacity: 0.8;
	}

	.search-container {
		position: relative;
		max-width: 500px;
		margin: 0 auto 1.5rem;
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: #7bafd4;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.875rem 3rem 0.875rem 3rem;
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.75rem;
		color: white;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: #7bafd4;
		box-shadow: 0 0 0 3px rgba(123, 175, 212, 0.1);
	}

	.search-input::placeholder {
		color: rgba(224, 224, 224, 0.5);
	}

	.clear-search {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		color: #7bafd4;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.clear-search:hover {
		color: #f4b841;
		transform: translateY(-50%) scale(1.1);
	}

	.domain-filters {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.domain-filter-btn {
		padding: 0.625rem 1.25rem;
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 2rem;
		color: #e0e0e0;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
	}

	.domain-filter-btn:hover {
		background: rgba(123, 175, 212, 0.1);
		border-color: #7bafd4;
		transform: translateY(-2px);
	}

	.domain-filter-btn.active {
		background: var(--domain-color, #7bafd4);
		border-color: var(--domain-color, #7bafd4);
		color: white;
		font-weight: 600;
	}

	.reset-btn {
		padding: 0.625rem;
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 50%;
		color: #7bafd4;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
	}

	.reset-btn:hover {
		background: rgba(123, 175, 212, 0.2);
		transform: rotate(180deg);
	}

	.canvas-container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.loading-overlay,
	.error-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(180deg, #0a0a0a 0%, #1a0a2a 100%);
		z-index: 50;
	}

	.spinner {
		width: 60px;
		height: 60px;
		border: 4px solid rgba(123, 175, 212, 0.2);
		border-top-color: #7bafd4;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text,
	.error-text {
		margin-top: 1.5rem;
		font-size: 1.25rem;
		color: #7bafd4;
	}

	.retry-btn {
		margin-top: 1rem;
		padding: 0.75rem 1.5rem;
		background: #7bafd4;
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.retry-btn:hover {
		background: #5a95b8;
		transform: translateY(-2px);
	}

	.instructions {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(10px);
		padding: 0.875rem 1.5rem;
		border-radius: 2rem;
		border: 1px solid rgba(123, 175, 212, 0.3);
		z-index: 100;
	}

	.instructions p {
		margin: 0;
		color: #e0e0e0;
		font-size: 0.875rem;
	}

	.stats-overlay {
		position: absolute;
		top: 50%;
		right: 2rem;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		z-index: 100;
	}

	.stat-item {
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(10px);
		padding: 1rem 1.5rem;
		border-radius: 1rem;
		border: 1px solid rgba(123, 175, 212, 0.3);
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: #7bafd4;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		display: block;
		font-size: 0.875rem;
		color: #e0e0e0;
		opacity: 0.8;
	}

	@media (max-width: 768px) {
		.gallery-header {
			padding: 1rem;
		}

		.gallery-title {
			font-size: 1.75rem;
		}

		.domain-filters {
			gap: 0.5rem;
		}

		.domain-filter-btn {
			padding: 0.5rem 1rem;
			font-size: 0.75rem;
		}

		.stats-overlay {
			flex-direction: row;
			top: auto;
			bottom: 5rem;
			right: 1rem;
			left: 1rem;
			transform: none;
		}

		.instructions {
			bottom: 1rem;
			font-size: 0.75rem;
			padding: 0.625rem 1rem;
		}
	}
</style>
