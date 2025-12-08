<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';
	import ProjectCard from './ProjectCard.svelte';
	import type { ProjectWithDomain } from '$lib/types/project';

	interface Props {
		scrollProgress?: number;
		projects?: ProjectWithDomain[];
		onProjectClick?: (project: ProjectWithDomain) => void;
		selectedProject?: ProjectWithDomain | null;
	}

	let { scrollProgress = 0, projects = [], onProjectClick, selectedProject }: Props = $props();

	// Create wireframe globe
	const globeGeometry = new THREE.SphereGeometry(5, 32, 32);
	const globeMaterial = new THREE.MeshBasicMaterial({
		color: '#7BAFD4',
		wireframe: true,
		transparent: true,
		opacity: 0.6
	});

	// Create atmospheric particles (weather/climate data points)
	const particleCount = 500;
	const particlePositions = new Float32Array(particleCount * 3);
	const particleColors = new Float32Array(particleCount * 3);
	const particleSizes = new Float32Array(particleCount);

	// Color gradient for temperature visualization
	const coldColor = new THREE.Color('#00BFFF'); // Cold - blue
	const warmColor = new THREE.Color('#FF4500'); // Warm - red/orange

	for (let i = 0; i < particleCount; i++) {
		const i3 = i * 3;

		// Position particles around the globe
		const radius = 6 + Math.random() * 3;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.random() * Math.PI;

		particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
		particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
		particlePositions[i3 + 2] = radius * Math.cos(phi);

		// Temperature gradient colors
		const temp = Math.random();
		const color = coldColor.clone().lerp(warmColor, temp);

		particleColors[i3] = color.r;
		particleColors[i3 + 1] = color.g;
		particleColors[i3 + 2] = color.b;

		particleSizes[i] = Math.random() * 0.3 + 0.1;
	}

	const particleGeometry = new THREE.BufferGeometry();
	particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
	particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
	particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

	const particleMaterial = new THREE.PointsMaterial({
		size: 0.2,
		vertexColors: true,
		transparent: true,
		opacity: 0.8,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	});

	let globeRef = $state<THREE.Mesh | undefined>(undefined);
	let particlesRef = $state<THREE.Points | undefined>(undefined);
	let time = $state(0);

	// Animation loop
	useTask((delta) => {
		time += delta;

		if (globeRef) {
			// Rotate globe based on scroll
			globeRef.rotation.y = scrollProgress * Math.PI * 4;
			globeRef.rotation.x = Math.sin(time * 0.2) * 0.1;
		}

		if (particlesRef) {
			// Rotate particle cloud in opposite direction
			particlesRef.rotation.y = -scrollProgress * Math.PI * 2;

			// Animate particles (weather patterns)
			const positions = particlesRef.geometry.attributes.position;
			if (positions) {
				for (let i = 0; i < particleCount; i++) {
					const i3 = i * 3;
					let x = positions.getX(i);
					let y = positions.getY(i);
					let z = positions.getZ(i);

					// Create flowing effect (wind patterns)
					const angle = time * 0.5 + i * 0.01;
					const radius = Math.sqrt(x * x + y * y + z * z);

					x += Math.sin(angle) * 0.01;
					z += Math.cos(angle) * 0.01;

					// Normalize to keep particles at consistent distance
					const currentRadius = Math.sqrt(x * x + y * y + z * z);
					const scale = radius / currentRadius;

					positions.setXYZ(i, x * scale, y, z * scale);
				}
				positions.needsUpdate = true;
			}
		}
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60}>
	<OrbitControls enableDamping dampingFactor={0.05} minDistance={10} maxDistance={40} />
</T.PerspectiveCamera>

<!-- Globe -->
<T.Mesh bind:ref={globeRef} geometry={globeGeometry} material={globeMaterial} />

<!-- Weather/Climate particles -->
<T.Points bind:ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />

<!-- Lighting -->
<T.AmbientLight intensity={0.3} />
<T.DirectionalLight position={[10, 10, 5]} intensity={1} color="#7BAFD4" />
<T.PointLight position={[0, 0, 0]} intensity={0.5} color="#3B1F54" />

<!-- Project Cards -->
{#each projects as project, index (project.id)}
	{@const radius = 12 + index * 0.5}
	{@const angle = (index / projects.length) * Math.PI * 2}
	{@const x = Math.cos(angle) * radius}
	{@const z = Math.sin(angle) * radius}
	{@const y = Math.sin(index * 0.5) * 3}

	<ProjectCard
		{project}
		position={[x, y, z]}
		onClick={onProjectClick}
		selected={selectedProject?.id === project.id}
	/>
{/each}
