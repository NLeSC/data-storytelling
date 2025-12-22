<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';
	import ProjectCard from './ProjectCard.svelte';
	import type { ProjectWithDomain } from '$lib/types/project';
	import { zoomLevel } from '$lib/stores/zoom';

	interface Props {
		scrollProgress?: number;
		projects?: ProjectWithDomain[];
		onProjectClick?: (project: ProjectWithDomain) => void;
		selectedProject?: ProjectWithDomain | null;
	}

	let { scrollProgress = 0, projects = [], onProjectClick, selectedProject }: Props = $props();

	const baseZoom = 38;
	let cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);

	// DNA helix parameters
	const helixHeight = 20;
	const helixRadius = 3;
	const turns = 4;
	const pairsPerTurn = 8;
	const totalPairs = turns * pairsPerTurn;

	// Base pair colors (representing different nucleotides)
	const colors = [
		new THREE.Color('#FF6B6B'), // Adenine - red
		new THREE.Color('#4ECDC4'), // Thymine - cyan
		new THREE.Color('#45B7D1'), // Guanine - blue
		new THREE.Color('#FFA07A') // Cytosine - orange
	];

	// Create DNA structure
	const dnaGroups: Array<{ pos: THREE.Vector3; rotation: number; color: THREE.Color }> = [];

	for (let i = 0; i < totalPairs; i++) {
		const t = i / totalPairs;
		const angle = t * turns * Math.PI * 2;
		const y = (t - 0.5) * helixHeight;

		// Create position for base pair
		const x1 = Math.cos(angle) * helixRadius;
		const z1 = Math.sin(angle) * helixRadius;
		const x2 = Math.cos(angle + Math.PI) * helixRadius;
		const z2 = Math.sin(angle + Math.PI) * helixRadius;

		dnaGroups.push({
			pos: new THREE.Vector3(x1, y, z1),
			rotation: angle,
			color: colors[i % colors.length]
		});

		dnaGroups.push({
			pos: new THREE.Vector3(x2, y, z2),
			rotation: angle + Math.PI,
			color: colors[(i + 2) % colors.length]
		});
	}

	// Create molecular particles (proteins, etc.)
	const moleculeCount = 100;
	const moleculePositions = new Float32Array(moleculeCount * 3);
	const moleculeColors = new Float32Array(moleculeCount * 3);

	for (let i = 0; i < moleculeCount; i++) {
		const i3 = i * 3;
		const radius = 10 + Math.random() * 5;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.random() * Math.PI;

		moleculePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
		moleculePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
		moleculePositions[i3 + 2] = radius * Math.cos(phi);

		const color = colors[Math.floor(Math.random() * colors.length)];
		moleculeColors[i3] = color.r;
		moleculeColors[i3 + 1] = color.g;
		moleculeColors[i3 + 2] = color.b;
	}

	const moleculeGeometry = new THREE.BufferGeometry();
	moleculeGeometry.setAttribute('position', new THREE.BufferAttribute(moleculePositions, 3));
	moleculeGeometry.setAttribute('color', new THREE.BufferAttribute(moleculeColors, 3));

	const moleculeMaterial = new THREE.PointsMaterial({
		size: 0.3,
		vertexColors: true,
		transparent: true,
		opacity: 0.6,
		blending: THREE.AdditiveBlending
	});

	let dnaGroupRef = $state<THREE.Group | undefined>(undefined);
	let moleculesRef = $state<THREE.Points | undefined>(undefined);
	let time = $state(0);

	// Animation loop
	useTask((delta) => {
		time += delta;

		// Update camera zoom (preserving rotation direction)
		if (cameraRef) {
			const targetDistance = baseZoom * $zoomLevel;
			const currentDistance = cameraRef.position.length();
			if (currentDistance > 0.1) {
				const newDistance = currentDistance + (targetDistance - currentDistance) * 0.1;
				cameraRef.position.normalize().multiplyScalar(newDistance);
			}
		}

		if (dnaGroupRef) {
			// Rotate DNA helix
			dnaGroupRef.rotation.y = scrollProgress * Math.PI * 4;
			// Slight vertical movement
			dnaGroupRef.position.y = Math.sin(time * 0.3) * 2;
		}

		if (moleculesRef) {
			// Gentle rotation
			moleculesRef.rotation.y = -scrollProgress * Math.PI * 2;
			moleculesRef.rotation.x = Math.sin(time * 0.2) * 0.3;

			// Animate molecules
			const positions = moleculesRef.geometry.attributes.position;
			if (positions) {
				for (let i = 0; i < moleculeCount; i++) {
					const i3 = i * 3;
					let x = positions.getX(i);
					let y = positions.getY(i);
					let z = positions.getZ(i);

					// Orbital motion
					const radius = Math.sqrt(x * x + y * y + z * z);
					const angle = time * 0.2 + i * 0.05;

					const newX = x * Math.cos(angle * 0.1) - z * Math.sin(angle * 0.1);
					const newZ = x * Math.sin(angle * 0.1) + z * Math.cos(angle * 0.1);

					positions.setXYZ(i, newX, y + Math.sin(time + i) * 0.02, newZ);
				}
				positions.needsUpdate = true;
			}
		}
	});
</script>

<T.PerspectiveCamera bind:ref={cameraRef} makeDefault position={[0, 0, 38]} fov={60}>
	<OrbitControls enableDamping dampingFactor={0.05} minDistance={20} maxDistance={80} enableZoom={false} />
</T.PerspectiveCamera>

<!-- DNA Double Helix -->
<T.Group bind:ref={dnaGroupRef}>
	{#each dnaGroups as basePair, i}
		<!-- Base (sphere) -->
		<T.Mesh position={basePair.pos.toArray()}>
			<T.SphereGeometry args={[0.4, 12, 12]} />
			<T.MeshBasicMaterial color={basePair.color} />
		</T.Mesh>

		<!-- Connection line (base pair) -->
		{#if i % 2 === 0 && i < dnaGroups.length - 1}
			<T.Line>
				<T.BufferGeometry
					attach="geometry"
					oncreate={(ref) => {
						const positions = new Float32Array(6);
						positions[0] = basePair.pos.x;
						positions[1] = basePair.pos.y;
						positions[2] = basePair.pos.z;
						positions[3] = dnaGroups[i + 1].pos.x;
						positions[4] = dnaGroups[i + 1].pos.y;
						positions[5] = dnaGroups[i + 1].pos.z;
						ref.setAttribute('position', new THREE.BufferAttribute(positions, 3));
					}}
				/>
				<T.LineBasicMaterial attach="material" color="#7BAFD4" transparent={true} opacity={0.5} />
			</T.Line>
		{/if}

		<!-- Backbone connections -->
		{#if i % 2 === 0 && i < dnaGroups.length - 2}
			<T.Line>
				<T.BufferGeometry
					attach="geometry"
					oncreate={(ref) => {
						const positions = new Float32Array(6);
						positions[0] = basePair.pos.x;
						positions[1] = basePair.pos.y;
						positions[2] = basePair.pos.z;
						positions[3] = dnaGroups[i + 2].pos.x;
						positions[4] = dnaGroups[i + 2].pos.y;
						positions[5] = dnaGroups[i + 2].pos.z;
						ref.setAttribute('position', new THREE.BufferAttribute(positions, 3));
					}}
				/>
				<T.LineBasicMaterial attach="material" color="#3B1F54" transparent={true} opacity={0.7} />
			</T.Line>
		{/if}
	{/each}
</T.Group>

<!-- Molecular particles -->
<T.Points bind:ref={moleculesRef} geometry={moleculeGeometry} material={moleculeMaterial} />

<!-- Lighting -->
<T.AmbientLight intensity={0.6} />
<T.PointLight position={[10, 10, 10]} intensity={0.8} color="#FF6B6B" />
<T.PointLight position={[-10, -10, 10]} intensity={0.6} color="#4ECDC4" />

<!-- Project Cards -->
{#each projects as project, index (project.id)}
	{@const radius = 16 + index * 0.5}
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
