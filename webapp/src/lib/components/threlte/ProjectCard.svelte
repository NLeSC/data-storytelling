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
	let logoWidth = $state(1.4);
	let logoHeight = $state(1.4);

	$effect(() => {
		if (imageUrl) {
			const loader = new THREE.TextureLoader();
			loader.load(
				imageUrl,
				(loadedTexture) => {
					texture = loadedTexture;

					// Calculate aspect ratio and adjust dimensions
					const image = loadedTexture.image;
					if (image && image.width && image.height) {
						const aspectRatio = image.width / image.height;
						const maxSize = 1.4; // Maximum size

						if (aspectRatio > 1) {
							// Wider than tall
							logoWidth = maxSize;
							logoHeight = maxSize / aspectRatio;
						} else {
							// Taller than wide
							logoHeight = maxSize;
							logoWidth = maxSize * aspectRatio;
						}
					}
				},
				undefined,
				(error) => {
					console.error('Error loading texture for', project.brand_name, error);
				}
			);
		}
	});

	// Floating Y position
	let floatY = $state(0);

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
			floatY = Math.sin(time * 0.5) * 0.3;
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

<T.Group
	position={[position[0], position[1] + floatY, position[2]]}
	bind:ref={meshRef}
	scale={[scale, scale, scale]}
>
	<!-- Card base with border -->
	<T.Mesh onclick={handleClick} onpointerover={handlePointerOver} onpointerout={handlePointerOut}>
		<T.BoxGeometry args={[2.2, 2.8, 0.08]} />
		<T.MeshStandardMaterial
			color={cardColor}
			metalness={0.4}
			roughness={0.3}
			emissive={cardColor}
			emissiveIntensity={hovered ? 0.4 : selected ? 0.3 : 0.15}
		/>
	</T.Mesh>

	<!-- FRONT SIDE -->
	<!-- White card surface (front) -->
	<T.Mesh
		position={[0, 0, 0.05]}
		onclick={handleClick}
		onpointerover={handlePointerOver}
		onpointerout={handlePointerOut}
	>
		<T.BoxGeometry args={[2, 2.6, 0.01]} />
		<T.MeshStandardMaterial color="#ffffff" />
	</T.Mesh>

	<!-- Logo (front) -->
	{#if texture}
		<T.Mesh
			position={[0, 0.5, 0.06]}
			onclick={handleClick}
			onpointerover={handlePointerOver}
			onpointerout={handlePointerOut}
		>
			<T.PlaneGeometry args={[logoWidth, logoHeight]} />
			<T.MeshBasicMaterial map={texture} transparent={true} />
		</T.Mesh>
	{:else}
		<T.Mesh
			position={[0, 0.5, 0.06]}
			onclick={handleClick}
			onpointerover={handlePointerOver}
			onpointerout={handlePointerOut}
		>
			<T.PlaneGeometry args={[1.4, 1.4]} />
			<T.MeshBasicMaterial color={cardColor} opacity={0.3} transparent={true} />
		</T.Mesh>
	{/if}

	<!-- Project name (front) -->
	<Text
		text={project.brand_name}
		fontSize={0.12}
		maxWidth={1.8}
		textAlign="center"
		anchorX="center"
		anchorY="middle"
		position={[0, -0.5, 0.06]}
		color="#1a1a1a"
		outlineWidth={0}
	/>

	<!-- Short statement on hover (front) -->
	{#if hovered}
		<Text
			text={project.short_statement.substring(0, 60) + '...'}
			fontSize={0.08}
			maxWidth={1.8}
			textAlign="center"
			anchorX="center"
			anchorY="top"
			position={[0, -0.9, 0.06]}
			color="#666666"
			outlineWidth={0}
		/>
	{/if}

	<!-- BACK SIDE -->
	<!-- White card surface (back) -->
	<T.Mesh
		position={[0, 0, -0.05]}
		rotation={[0, Math.PI, 0]}
		onclick={handleClick}
		onpointerover={handlePointerOver}
		onpointerout={handlePointerOut}
	>
		<T.BoxGeometry args={[2, 2.6, 0.01]} />
		<T.MeshStandardMaterial color="#ffffff" />
	</T.Mesh>

	<!-- Logo (back) -->
	{#if texture}
		<T.Mesh
			position={[0, 0.5, -0.06]}
			rotation={[0, Math.PI, 0]}
			onclick={handleClick}
			onpointerover={handlePointerOver}
			onpointerout={handlePointerOut}
		>
			<T.PlaneGeometry args={[logoWidth, logoHeight]} />
			<T.MeshBasicMaterial map={texture} transparent={true} />
		</T.Mesh>
	{:else}
		<T.Mesh
			position={[0, 0.5, -0.06]}
			rotation={[0, Math.PI, 0]}
			onclick={handleClick}
			onpointerover={handlePointerOver}
			onpointerout={handlePointerOut}
		>
			<T.PlaneGeometry args={[1.4, 1.4]} />
			<T.MeshBasicMaterial color={cardColor} opacity={0.3} transparent={true} />
		</T.Mesh>
	{/if}

	<!-- Project name (back) -->
	<Text
		text={project.brand_name}
		fontSize={0.12}
		maxWidth={1.8}
		textAlign="center"
		anchorX="center"
		anchorY="middle"
		position={[0, -0.5, -0.06]}
		rotation={[0, Math.PI, 0]}
		color="#1a1a1a"
		outlineWidth={0}
	/>

	<!-- Short statement on hover (back) -->
	{#if hovered}
		<Text
			text={project.short_statement.substring(0, 60) + '...'}
			fontSize={0.08}
			maxWidth={1.8}
			textAlign="center"
			anchorX="center"
			anchorY="top"
			position={[0, -0.9, -0.06]}
			rotation={[0, Math.PI, 0]}
			color="#666666"
			outlineWidth={0}
		/>
	{/if}
</T.Group>
