<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import ProjectCard from './ProjectCard.svelte';
	import type { ProjectWithDomain } from '$lib/types/project';
	import { zoomLevel } from '$lib/stores/zoom';

	// Enable interactivity for 3D objects (clicks, hover, etc.)
	interactivity();

	interface Props {
		scrollProgress?: number;
		projects?: ProjectWithDomain[];
		onProjectClick?: (project: ProjectWithDomain) => void;
		selectedProject?: ProjectWithDomain | null;
	}

	let { scrollProgress = 0, projects = [], onProjectClick, selectedProject }: Props = $props();

	const baseZoom = 35;
	let cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);

	// Create social network nodes in clusters
	const clusterCount = 5;
	const nodesPerCluster = 10;
	const clusters: Array<{
		center: THREE.Vector3;
		nodes: Array<{ position: THREE.Vector3; size: number }>;
	}> = [];

	for (let c = 0; c < clusterCount; c++) {
		const angle = (c / clusterCount) * Math.PI * 2;
		const radius = 8;
		const center = new THREE.Vector3(
			Math.cos(angle) * radius,
			(Math.random() - 0.5) * 4,
			Math.sin(angle) * radius
		);

		const nodes: Array<{ position: THREE.Vector3; size: number }> = [];

		for (let n = 0; n < nodesPerCluster; n++) {
			const offset = new THREE.Vector3(
				(Math.random() - 0.5) * 3,
				(Math.random() - 0.5) * 3,
				(Math.random() - 0.5) * 3
			);
			nodes.push({
				position: center.clone().add(offset),
				size: Math.random() * 0.3 + 0.2
			});
		}

		clusters.push({ center, nodes });
	}

	// Create connections within and between clusters
	interface Connection {
		start: THREE.Vector3;
		end: THREE.Vector3;
		opacity: number;
	}
	const connections: Connection[] = [];

	// Within cluster connections
	clusters.forEach((cluster) => {
		cluster.nodes.forEach((node, i) => {
			if (i < cluster.nodes.length - 1) {
				const target = cluster.nodes[Math.floor(Math.random() * cluster.nodes.length)];
				connections.push({
					start: node.position,
					end: target.position,
					opacity: 0.3
				});
			}
		});
	});

	// Between cluster connections
	for (let i = 0; i < clusterCount; i++) {
		const nextCluster = (i + 1) % clusterCount;
		const node1 = clusters[i].nodes[0];
		const node2 = clusters[nextCluster].nodes[0];
		connections.push({
			start: node1.position,
			end: node2.position,
			opacity: 0.5
		});
	}

	// Create data flow particles
	const flowParticleCount = 50;
	const flowPositions = new Float32Array(flowParticleCount * 3);
	const flowColors = new Float32Array(flowParticleCount * 3);

	const flowColor = new THREE.Color('#F4B841');

	for (let i = 0; i < flowParticleCount; i++) {
		const i3 = i * 3;
		const randomNode = clusters[Math.floor(Math.random() * clusterCount)].nodes[0];

		flowPositions[i3] = randomNode.position.x;
		flowPositions[i3 + 1] = randomNode.position.y;
		flowPositions[i3 + 2] = randomNode.position.z;

		flowColors[i3] = flowColor.r;
		flowColors[i3 + 1] = flowColor.g;
		flowColors[i3 + 2] = flowColor.b;
	}

	const flowGeometry = new THREE.BufferGeometry();
	flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
	flowGeometry.setAttribute('color', new THREE.BufferAttribute(flowColors, 3));

	const flowMaterial = new THREE.PointsMaterial({
		size: 0.15,
		vertexColors: true,
		transparent: true,
		opacity: 1,
		blending: THREE.AdditiveBlending
	});

	let networkGroupRef = $state<THREE.Group | undefined>(undefined);
	let flowParticlesRef = $state<THREE.Points | undefined>(undefined);
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

		if (networkGroupRef) {
			// Gentle rotation with scroll
			networkGroupRef.rotation.y = scrollProgress * Math.PI * 2;
			networkGroupRef.scale.setScalar(1 + scrollProgress * 0.5);
		}

		if (flowParticlesRef) {
			// Animate data flow particles
			const positions = flowParticlesRef.geometry.attributes.position;
			if (positions) {
				for (let i = 0; i < flowParticleCount; i++) {
					const i3 = i * 3;
					let x = positions.getX(i);
					let y = positions.getY(i);
					let z = positions.getZ(i);

					// Move particles along connections
					const speed = 2;
					const phase = (time * speed + i * 0.5) % connections.length;
					const connectionIndex = Math.floor(phase);
					const progress = phase - connectionIndex;

					const conn = connections[connectionIndex % connections.length];
					const newPos = conn.start.clone().lerp(conn.end, progress);

					positions.setXYZ(i, newPos.x, newPos.y, newPos.z);
				}
				positions.needsUpdate = true;
			}
		}
	});
</script>

<T.PerspectiveCamera bind:ref={cameraRef} makeDefault position={[0, 0, 35]} fov={60}>
	<OrbitControls enableDamping dampingFactor={0.05} minDistance={20} maxDistance={80} enableZoom={false} />
</T.PerspectiveCamera>

<!-- Social network -->
<T.Group bind:ref={networkGroupRef}>
	<!-- Cluster centers -->
	{#each clusters as cluster}
		<T.Mesh position={cluster.center.toArray()}>
			<T.SphereGeometry args={[0.5, 16, 16]} />
			<T.MeshBasicMaterial color="#3B1F54" />
		</T.Mesh>

		<!-- Nodes in cluster -->
		{#each cluster.nodes as node}
			<T.Mesh position={node.position.toArray()}>
				<T.SphereGeometry args={[node.size, 12, 12]} />
				<T.MeshBasicMaterial color="#7BAFD4" />
			</T.Mesh>
		{/each}
	{/each}

	<!-- Connections -->
	{#each connections as connection}
		<T.Line>
			<T.BufferGeometry
				attach="geometry"
				oncreate={(ref) => {
					const positions = new Float32Array(6);
					positions[0] = connection.start.x;
					positions[1] = connection.start.y;
					positions[2] = connection.start.z;
					positions[3] = connection.end.x;
					positions[4] = connection.end.y;
					positions[5] = connection.end.z;
					ref.setAttribute('position', new THREE.BufferAttribute(positions, 3));
				}}
			/>
			<T.LineBasicMaterial
				attach="material"
				color="#7BAFD4"
				transparent={true}
				opacity={connection.opacity}
			/>
		</T.Line>
	{/each}
</T.Group>

<!-- Data flow particles -->
<T.Points bind:ref={flowParticlesRef} geometry={flowGeometry} material={flowMaterial} />

<!-- Lighting -->
<T.AmbientLight intensity={0.5} />
<T.PointLight position={[10, 10, 10]} intensity={0.8} color="#F4B841" />

<!-- Project Cards -->
{#each projects as project, index (project.id)}
	{@const radius = 18 + index * 0.5}
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
