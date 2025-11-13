<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		scrollProgress?: number;
	}

	let { scrollProgress = 0 }: Props = $props();

	// Create network nodes
	const nodeCount = 30;
	const nodes: Array<{ position: THREE.Vector3; connections: number[] }> = [];

	for (let i = 0; i < nodeCount; i++) {
		const radius = 8 + Math.random() * 5;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.random() * Math.PI;

		const position = new THREE.Vector3(
			radius * Math.sin(phi) * Math.cos(theta),
			radius * Math.sin(phi) * Math.sin(theta),
			radius * Math.cos(phi)
		);

		nodes.push({ position, connections: [] });
	}

	// Create connections between nodes
	for (let i = 0; i < nodeCount; i++) {
		const connectionCount = Math.floor(Math.random() * 3) + 1;
		for (let j = 0; j < connectionCount; j++) {
			const targetIndex = Math.floor(Math.random() * nodeCount);
			if (targetIndex !== i && !nodes[i].connections.includes(targetIndex)) {
				nodes[i].connections.push(targetIndex);
			}
		}
	}

	// Create line geometry for connections
	const lineMaterial = new THREE.LineBasicMaterial({
		color: '#7BAFD4',
		transparent: true,
		opacity: 0.3,
		blending: THREE.AdditiveBlending
	});

	const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];
	nodes.forEach((node, i) => {
		node.connections.forEach((targetIndex) => {
			lines.push({
				start: node.position,
				end: nodes[targetIndex].position
			});
		});
	});

	// Create wireframe structure (architectural element)
	const boxGeometry = new THREE.BoxGeometry(6, 6, 6);
	const boxWireframe = new THREE.EdgesGeometry(boxGeometry);
	const boxLineMaterial = new THREE.LineBasicMaterial({
		color: '#3B1F54',
		transparent: true,
		opacity: 0.6
	});

	const torusGeometry = new THREE.TorusGeometry(4, 0.5, 16, 100);
	const torusWireframe = new THREE.EdgesGeometry(torusGeometry);
	const torusLineMaterial = new THREE.LineBasicMaterial({
		color: '#F4B841',
		transparent: true,
		opacity: 0.5
	});

	let networkGroupRef = $state<THREE.Group | undefined>(undefined);
	let boxRef = $state<THREE.LineSegments | undefined>(undefined);
	let torusRef = $state<THREE.LineSegments | undefined>(undefined);
	let time = $state(0);

	// Animation loop
	useTask((delta) => {
		time += delta;

		if (networkGroupRef) {
			networkGroupRef.rotation.y = scrollProgress * Math.PI * 3;
			networkGroupRef.rotation.x = Math.sin(time * 0.3) * 0.2;
		}

		if (boxRef) {
			boxRef.rotation.x = time * 0.2;
			boxRef.rotation.y = time * 0.3;
			boxRef.position.y = Math.sin(time * 0.5) * 2;
		}

		if (torusRef) {
			torusRef.rotation.x = Math.PI / 2 + time * 0.1;
			torusRef.rotation.z = time * 0.2;
		}
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 25]} fov={60} />

<!-- Network graph -->
<T.Group bind:ref={networkGroupRef}>
	<!-- Nodes -->
	{#each nodes as node}
		<T.Mesh position={node.position.toArray()}>
			<T.SphereGeometry args={[0.3, 16, 16]} />
			<T.MeshBasicMaterial color="#7BAFD4" />
		</T.Mesh>
	{/each}

	<!-- Connections -->
	{#each lines as line}
		<T.Line>
			<T.BufferGeometry
				attach="geometry"
				oncreate={(ref) => {
					const positions = new Float32Array(6);
					positions[0] = line.start.x;
					positions[1] = line.start.y;
					positions[2] = line.start.z;
					positions[3] = line.end.x;
					positions[4] = line.end.y;
					positions[5] = line.end.z;
					ref.setAttribute('position', new THREE.BufferAttribute(positions, 3));
				}}
			/>
			<T is={lineMaterial} attach="material" />
		</T.Line>
	{/each}
</T.Group>

<!-- Wireframe box structure -->
<T.LineSegments bind:ref={boxRef} geometry={boxWireframe} material={boxLineMaterial} />

<!-- Wireframe torus structure -->
<T.LineSegments
	bind:ref={torusRef}
	geometry={torusWireframe}
	material={torusLineMaterial}
	position={[0, 0, 0]}
/>

<!-- Lighting -->
<T.AmbientLight intensity={0.4} />
<T.PointLight position={[10, 10, 10]} intensity={1} color="#7BAFD4" />
<T.PointLight position={[-10, -10, -5]} intensity={0.5} color="#F4B841" />
