<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Text, HTML } from '@threlte/extras';
	import * as THREE from 'three';
	import type { ProjectWithDomain } from '$lib/types/project';
	import { getProjectImageUrl } from '$lib/types/project';

	interface Props {
		project: ProjectWithDomain;
		position: [number, number, number];
		onClick?: (project: ProjectWithDomain) => void;
		selected?: boolean;
	}

	let { project, position, onClick, selected = false }: Props = $props();

	// State
	let meshRef = $state<THREE.Mesh | undefined>(undefined);
	let hovered = $state(false);
	let rotation = $state(0);
	let floatOffset = $state(Math.random() * Math.PI * 2); // Random phase for floating
	let rotationSpeed = $state(0.001 + Math.random() * 0.002);

	// Derived values
	const imageUrl = $derived(getProjectImageUrl(project.image_id));
	const cardColor = $derived(project.domain.color);
	const scale = $derived(hovered ? 1.15 : selected ? 1.1 : 1);

	// Load texture for logo
	let texture = $state<THREE.Texture | null>(null);
	$effect(() => {
		if (imageUrl) {
			const loader = new THREE.TextureLoader();
			loader.load(
				imageUrl,
				(loadedTexture) => {
					texture = loadedTexture;
				},
				undefined,
				(error) => {
					console.error('Error loading texture for', project.brand_name, error);
				}
			);
		}
	});

	// Animation
	let elapsedTime = $state(0);
	useTask((delta) => {
		elapsedTime += delta;
		if (meshRef) {
			// Gentle rotation
			rotation += rotationSpeed;
			meshRef.rotation.y = rotation;

			// Floating animation
			const time = elapsedTime + floatOffset;
			meshRef.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
		}
	});

	// Event handlers
	function handleClick() {
		if (onClick) {
			onClick(project);
		}
	}

	function handlePointerOver() {
		hovered = true;
		if (typeof document !== 'undefined') {
			document.body.style.cursor = 'pointer';
		}
	}

	function handlePointerOut() {
		hovered = false;
		if (typeof document !== 'undefined') {
			document.body.style.cursor = 'auto';
		}
	}
</script>

<T.Group position={[position[0], position[1], position[2]]}>
	<T.Mesh
		bind:ref={meshRef}
		onclick={handleClick}
		onpointerover={handlePointerOver}
		onpointerout={handlePointerOut}
		scale={[scale, scale, scale]}
	>
		<!-- Card base -->
		<T.BoxGeometry args={[2, 2.5, 0.1]} />
		<T.MeshStandardMaterial
			color={cardColor}
			metalness={0.3}
			roughness={0.4}
			emissive={cardColor}
			emissiveIntensity={hovered ? 0.3 : selected ? 0.2 : 0.1}
		/>
	</T.Mesh>

	<!-- Logo (if available) -->
	{#if texture}
		<T.Mesh position={[0, 0.4, 0.06]}>
			<T.PlaneGeometry args={[1.5, 1.5]} />
			<T.MeshBasicMaterial map={texture} transparent={true} />
		</T.Mesh>
	{/if}

	<!-- Project name as 3D text -->
	<Text
		text={project.brand_name}
		fontSize={0.15}
		maxWidth={1.8}
		textAlign="center"
		anchorX="center"
		anchorY="middle"
		position={[0, -0.8, 0.06]}
		color="#ffffff"
		outlineWidth={0.02}
		outlineColor="#000000"
	/>

	<!-- Domain indicator (small sphere) -->
	<T.Mesh position={[0.85, 1.15, 0.06]}>
		<T.SphereGeometry args={[0.1, 16, 16]} />
		<T.MeshStandardMaterial color={cardColor} emissive={cardColor} emissiveIntensity={0.5} />
	</T.Mesh>

	<!-- Hover HTML overlay (optional) -->
	{#if hovered}
		<HTML transform position={[0, -1.4, 0]} center>
			<div class="project-tooltip">
				<p class="text-xs text-white/90 max-w-[150px] text-center">
					{project.short_statement.substring(0, 80)}...
				</p>
			</div>
		</HTML>
	{/if}
</T.Group>

<style>
	.project-tooltip {
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(10px);
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(123, 175, 212, 0.3);
		pointer-events: none;
	}
</style>
