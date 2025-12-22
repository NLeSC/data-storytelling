<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import ProjectCard from './ProjectCard.svelte';
	import type { ProjectWithDomain } from '$lib/types/project';
	import type { ResearchDomain } from '$lib/types/project';

	interface Props {
		projects: ProjectWithDomain[];
		selectedDomain?: ResearchDomain | null;
		onProjectClick?: (project: ProjectWithDomain) => void;
		selectedProject?: ProjectWithDomain | null;
	}

	let { projects, selectedDomain, onProjectClick, selectedProject }: Props = $props();

	// Filter projects by domain if selected
	const filteredProjects = $derived(
		selectedDomain ? projects.filter((p) => p.domain.id === selectedDomain.id) : projects
	);

	/**
	 * Calculate position for each project card
	 * Distributes cards in a cluster around each domain's base position
	 */
	function calculateCardPosition(
		project: ProjectWithDomain,
		index: number,
		domainProjects: ProjectWithDomain[]
	): [number, number, number] {
		const basePos = project.domain.position;
		const totalInDomain = domainProjects.length;

		// Create a spiral/circular pattern around the base position
		const radius = 5 + Math.sqrt(totalInDomain) * 2; // Radius grows with number of projects
		const angle = (index / totalInDomain) * Math.PI * 2; // Distribute evenly in circle
		const heightVariation = Math.sin(index * 0.5) * 3; // Vary height for visual interest

		// Add some randomness to break perfect patterns
		const randomOffsetX = (Math.random() - 0.5) * 2;
		const randomOffsetZ = (Math.random() - 0.5) * 2;

		return [
			basePos.x + Math.cos(angle) * radius + randomOffsetX,
			basePos.y + heightVariation,
			basePos.z + Math.sin(angle) * radius + randomOffsetZ
		];
	}

	/**
	 * Get positions for all projects
	 */
	const projectPositions = $derived.by(() => {
		const positions = new Map<string, [number, number, number]>();

		// Group projects by domain
		const projectsByDomain = new Map<string, ProjectWithDomain[]>();
		filteredProjects.forEach((project) => {
			const domainId = project.domain.id;
			if (!projectsByDomain.has(domainId)) {
				projectsByDomain.set(domainId, []);
			}
			projectsByDomain.get(domainId)!.push(project);
		});

		// Calculate position for each project within its domain cluster
		projectsByDomain.forEach((domainProjects) => {
			domainProjects.forEach((project, index) => {
				positions.set(project.id, calculateCardPosition(project, index, domainProjects));
			});
		});

		return positions;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 15, 50]} fov={60}>
	<OrbitControls
		enableDamping
		dampingFactor={0.05}
		autoRotate={false}
		autoRotateSpeed={0.5}
		maxPolarAngle={Math.PI / 2}
		minDistance={10}
		maxDistance={100}
		target={[0, 0, 0]}
		enableZoom={false}
	/>
</T.PerspectiveCamera>

<!-- Lighting -->
<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[10, 10, 5]} intensity={1} castShadow />
<T.DirectionalLight position={[-10, 10, -5]} intensity={0.5} />
<T.PointLight position={[0, 20, 0]} intensity={0.8} color="#7bafd4" />

<!-- Project Cards -->
{#each filteredProjects as project (project.id)}
	{@const position = projectPositions.get(project.id)}
	{#if position}
		<ProjectCard
			{project}
			{position}
			onClick={onProjectClick}
			selected={selectedProject?.id === project.id}
		/>
	{/if}
{/each}

<!-- Domain markers (spheres to show where each domain cluster is centered) -->
{#if !selectedDomain}
	{#each [
		{ name: 'Environmental', color: '#7bafd4', pos: [-30, 0, -30] as [number, number, number] },
		{ name: 'Life Sciences', color: '#f4b841', pos: [30, 0, -30] as [number, number, number] },
		{ name: 'SSH', color: '#3b1f54', pos: [-30, 0, 30] as [number, number, number] },
		{ name: 'Engineering', color: '#e08f62', pos: [30, 0, 30] as [number, number, number] }
	] as marker}
		<T.Mesh position={marker.pos}>
			<T.SphereGeometry args={[1, 32, 32]} />
			<T.MeshStandardMaterial
				color={marker.color}
				emissive={marker.color}
				emissiveIntensity={0.3}
				transparent
				opacity={0.3}
			/>
		</T.Mesh>
	{/each}
{/if}
