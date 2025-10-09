<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		scrollProgress?: number;
	}

	let { scrollProgress = 0 }: Props = $props();

	// Create particle system
	const particleCount = 2000;
	const positions = new Float32Array(particleCount * 3);
	const colors = new Float32Array(particleCount * 3);
	const sizes = new Float32Array(particleCount);

	// eScience colors
	const color1 = new THREE.Color('#7BAFD4'); // Sky blue
	const color2 = new THREE.Color('#3B1F54'); // Deep purple
	const color3 = new THREE.Color('#F4B841'); // Golden

	// Initialize particle positions and colors
	for (let i = 0; i < particleCount; i++) {
		const i3 = i * 3;

		// Position particles in a spherical volume
		const radius = Math.random() * 15 + 5;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.random() * Math.PI;

		positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
		positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
		positions[i3 + 2] = radius * Math.cos(phi);

		// Random color from palette
		const colorChoice = Math.random();
		const color = colorChoice < 0.4 ? color1 : colorChoice < 0.7 ? color2 : color3;

		colors[i3] = color.r;
		colors[i3 + 1] = color.g;
		colors[i3 + 2] = color.b;

		sizes[i] = Math.random() * 0.5 + 0.1;
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
	geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

	const material = new THREE.PointsMaterial({
		size: 0.15,
		vertexColors: true,
		transparent: true,
		opacity: 0.8,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	});

	let pointsRef = $state<THREE.Points | undefined>(undefined);
	let time = $state(0);

	// Animation loop
	useTask((delta) => {
		time += delta;
		if (pointsRef) {
			// Rotate based on scroll
			pointsRef.rotation.y = scrollProgress * Math.PI * 2;
			pointsRef.rotation.x = Math.sin(time * 0.3) * 0.2;
			pointsRef.rotation.z = Math.cos(time * 0.2) * 0.1;

			// Animate particles
			const positions = pointsRef.geometry.attributes.position;
			if (positions) {
				for (let i = 0; i < particleCount; i++) {
					const i3 = i * 3;
					const x = positions.getX(i);
					const y = positions.getY(i);
					const z = positions.getZ(i);

					// Wave effect
					positions.setY(i, y + Math.sin(time + x * 0.5) * 0.01);
				}
				positions.needsUpdate = true;
			}
		}
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 30]} fov={75} />

<T.Points bind:ref={pointsRef} {geometry} {material} />

<!-- Ambient lighting for atmosphere -->
<T.AmbientLight intensity={0.5} />
<T.PointLight position={[10, 10, 10]} intensity={1} color="#7BAFD4" />
<T.PointLight position={[-10, -10, -10]} intensity={0.5} color="#3B1F54" />
