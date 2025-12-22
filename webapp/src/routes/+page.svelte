<script lang="ts">
	import { base } from '$app/paths';
	import { Canvas } from '@threlte/core';
	import { scrollStore, getSectionProgress } from '$lib/stores/scroll';
	import HeroScene from '$lib/components/threlte/HeroScene.svelte';
	import EnvironmentalScene from '$lib/components/threlte/EnvironmentalScene.svelte';
	import EngineeringScene from '$lib/components/threlte/EngineeringScene.svelte';
	import SSHScene from '$lib/components/threlte/SSHScene.svelte';
	import LifeSciencesScene from '$lib/components/threlte/LifeSciencesScene.svelte';
	import FloatingShapes from '$lib/components/FloatingShapes.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import ProjectModal from '$lib/components/ProjectModal.svelte';
	import { fetchAllProjects } from '$lib/api/projects';
	import type { ProjectWithDomain } from '$lib/types/project';
	import { onMount } from 'svelte';

	// Section progress stores
	const heroProgress = getSectionProgress(0, 5);
	const envProgress = getSectionProgress(1, 5);
	const engProgress = getSectionProgress(2, 5);
	const sshProgress = getSectionProgress(3, 5);
	const lifeProgress = getSectionProgress(4, 5);

	let currentSection = $state(0);
	let projects = $state<ProjectWithDomain[]>([]);
	let selectedProject = $state<ProjectWithDomain | null>(null);

	// Filter projects by domain
	const environmentalProjects = $derived(
		projects.filter((p) => p.domain.slug === 'environment-sustainability')
	);
	const engineeringProjects = $derived(
		projects.filter((p) => p.domain.slug === 'natural-sciences-engineering')
	);
	const sshProjects = $derived(
		projects.filter((p) => p.domain.slug === 'social-sciences-humanities')
	);
	const lifeSciencesProjects = $derived(projects.filter((p) => p.domain.slug === 'life-sciences'));

	// Load projects on mount
	onMount(async () => {
		try {
			projects = await fetchAllProjects();
			console.log(`Loaded ${projects.length} projects`);
		} catch (error) {
			console.error('Error loading projects:', error);
		}
	});

	function handleProjectClick(project: ProjectWithDomain) {
		selectedProject = project;
	}

	function closeModal() {
		selectedProject = null;
	}

	// Determine which section is currently in view
	$effect(() => {
		const progress = $scrollStore.scrollProgress;
		currentSection = Math.floor(progress * 5);
	});

	// Parallax effect on sections
	$effect(() => {
		if (typeof document === 'undefined') return;

		const sections = document.querySelectorAll('.section-container');
		const velocity = $scrollStore.velocity;

		sections.forEach((section, index) => {
			const rect = section.getBoundingClientRect();

			// Calculate progress only when section is in viewport
			const viewportCenter = window.innerHeight / 2;
			const sectionCenter = rect.top + rect.height / 2;
			const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
			const maxDistance = window.innerHeight;
			const sectionProgress = Math.max(0, Math.min(1, 1 - distanceFromCenter / maxDistance));

			const canvas = section.querySelector('.canvas-background') as HTMLElement;
			const content = section.querySelector('.content-overlay') as HTMLElement;

			if (canvas) {
				// Background moves slower (parallax effect)
				const bgOffset = rect.top * 0.3;
				canvas.style.transform = `translateY(${bgOffset}px) scale(${1 + Math.abs(velocity) * 0.02})`;
			}

			if (content) {
				// Content moves at normal speed - no offset to maintain centering
				content.style.transform = `translateY(50%)`;
			}
		});
	});
</script>

<svelte:head>
	<title>eScience Center - A Data Story</title>
	<meta
		name="description"
		content="Showcasing data storytelling capabilities across scientific domains"
	/>
</svelte:head>

<FloatingShapes />
<ScrollProgress />

<div class="landing-container">
	<!-- Fixed Navigation -->
	<nav class="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-sm bg-black/30">
		<div class="max-w-7xl mx-auto flex items-center justify-between">
			<div class="">
				<svg width="200" viewBox="0 0 1729 294" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M0 0H799.968C846.019 0 883.35 38.4084 883.35 85.7875L883.35 233.401L883.35 205.865C871.351 202.814 864.131 194.472 863.745 179.39V177.595L883.35 177.594V151.352L863.87 151.352L863.911 150.84C865.034 137.867 872.353 128.343 883.35 124.665L883.349 96.935C848.39 101.146 827.293 126.677 827.293 165.828C827.293 204.771 847.868 229.274 883.35 233.401L883.35 293.269H61.0114C28.3644 293.269 1.70649 266.888 0.0787475 233.715C29.6954 231.425 50.258 216.441 55.338 193.584H21.2741L21.1435 193.871C17.8474 200.946 10.5242 205.452 0 206.798V177.595L56.4693 177.595V162.957L56.4621 161.706C56.0195 123.565 35.2839 99.9179 0 96.6967V0ZM0 123.973V151.351L20.52 151.352C19.8976 136.939 12.2573 127.006 0 123.973ZM208.902 108.043C207.77 77.2961 178.678 54.0864 138.706 54.0864C96.849 54.0864 69.3214 75.5016 69.3214 108.043C69.3214 134.363 85.5363 150.754 118.595 157.334L142.226 162.119C164.474 166.666 173.524 173.006 173.524 184.013C173.524 197.053 158.692 207.144 138.958 207.144C103.374 207.144 100.891 190.471 99.1312 176.473H62.4277C63.8104 208.656 94.5865 235.577 137.826 235.577C183.329 235.577 211.359 214.281 211.359 179.467C211.359 152.668 195.647 137.713 159.195 130.415L137.323 125.989C116.081 121.682 107.408 115.58 107.408 104.932C107.408 91.7723 119.977 83.3977 138.958 83.3977C157.309 83.3977 171.444 94.4043 173.204 108.043H208.902ZM340.348 148.465C337.547 118.436 318.753 96.3185 284.664 96.3185C244.388 96.3185 221.74 121.084 221.74 164.871C221.74 209.137 244.505 234.022 284.664 234.022C318.169 234.022 339.182 214.999 341.984 185.449H310.23C307.662 198.489 298.556 205.428 284.664 205.428C266.452 205.428 256.062 191.191 256.062 164.871C256.062 138.91 266.336 127.539 284.664 127.539C299.14 127.539 306.26 135.903 308.595 148.465H340.348ZM816.769 148.465C813.967 118.436 795.173 96.3185 761.084 96.3185C720.808 96.3185 698.16 121.084 698.16 164.871C698.16 209.137 720.925 234.022 761.084 234.022C794.589 234.022 815.603 214.999 818.404 185.449H786.651C784.082 198.489 774.976 205.428 761.084 205.428C742.872 205.428 732.482 191.191 732.482 164.871C732.482 138.91 742.756 127.539 761.084 127.539C775.56 127.539 782.68 135.903 785.015 148.465H816.769ZM394.331 231.15V103.978H361.629V231.15H394.331ZM543.285 161.706C542.808 120.591 518.75 96.3185 478.307 96.3185C437.078 96.3185 411.687 122.878 411.687 165.828C411.687 208.658 436.575 234.022 478.809 234.022C512.748 234.022 536.63 218.469 542.161 193.584H508.097L507.966 193.871C503.981 202.425 494.111 207.223 479.815 207.223C460.709 207.223 451.158 199.01 450.655 179.39V177.595H543.292V162.957L543.285 161.706ZM682.595 145.849C682.595 114.264 666.003 96.3185 635.207 96.3185C614.719 96.3185 598.378 105.531 591.968 120.366V99.1898H556.521V231.15H595.615V161.6C596.897 142.068 605.549 129.518 622.518 129.518C639.865 129.518 646.017 135.919 646.017 154.104V231.15H682.595V145.849ZM450.897 150.841C452.343 134.063 463.763 125.178 480.563 125.178C497.657 125.178 506.589 133.885 507.343 151.352H450.856L450.897 150.841ZM396.116 86.0106V54.0864H361.736V86.0106H396.116Z"
						fill="currentColor"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M1474.72 234.012C1482.44 234.012 1489.88 233.289 1494.84 232.446V205.702C1490.98 206.064 1488.23 206.184 1482.99 206.184C1469.35 206.184 1458.17 202.491 1458.17 190.926V131.174H1494.84V103.588H1458.17V63.7019L1423.18 70.7V103.588H1399.48V131.174H1423.18V199.238C1423.18 225.139 1437.79 234.012 1474.72 234.012ZM1108.03 186.592C1105.19 216.417 1083.92 235.615 1049.99 235.615C1009.32 235.615 986.273 210.5 986.273 165.824C986.273 121.63 1009.21 96.6359 1049.99 96.6359C1084.51 96.6359 1103.54 118.958 1106.37 149.265H1074.22C1071.86 136.587 1064.65 128.146 1049.99 128.146C1031.43 128.146 1021.03 139.622 1021.03 165.824C1021.03 192.388 1031.55 206.757 1049.99 206.757C1064.06 206.757 1073.28 199.754 1075.88 186.592H1108.03ZM1250.47 163.892C1250.47 121.63 1225.96 96.6359 1184.47 96.6359C1142.59 96.6359 1116.8 123.442 1116.8 166.79C1116.8 210.017 1142.08 235.615 1184.98 235.615C1219.45 235.615 1243.71 219.918 1249.33 194.803H1214.73C1210.77 203.617 1200.68 208.568 1186 208.568C1166.59 208.568 1156.89 200.279 1156.38 180.477V178.666H1250.47V163.892ZM1156.58 152.179C1157.86 134.913 1169.52 125.763 1186.76 125.763C1204.12 125.763 1213.19 134.55 1213.96 152.179H1156.58ZM1631.07 163.892C1631.07 121.63 1606.56 96.6359 1565.06 96.6359C1523.19 96.6359 1497.39 123.442 1497.39 166.79C1497.39 210.017 1522.67 235.615 1565.57 235.615C1600.05 235.615 1624.3 219.918 1629.92 194.803H1595.32C1591.36 203.617 1581.28 208.568 1566.6 208.568C1547.19 208.568 1537.49 200.279 1536.98 180.477V178.666H1631.07V163.892ZM1537.18 152.179C1538.46 134.913 1550.12 125.763 1567.35 125.763C1584.72 125.763 1593.79 134.55 1594.56 152.179H1537.18ZM1303.7 233.207V163.175C1305 143.508 1313.77 130.871 1330.96 130.871C1348.53 130.871 1354.76 137.316 1354.76 155.627V233.207H1391.82V147.315C1391.82 115.511 1375.01 97.4413 1343.81 97.4413C1323.05 97.4413 1306.5 106.717 1300.01 121.655V100.333H1264.1V233.207H1303.7ZM1682.54 164.752V232.405H1649.8V102.817H1679.07V126.059C1682.37 112.853 1700.13 100.656 1716.04 100.656C1720.58 100.656 1726.15 101.256 1728.99 102.336V134.152C1726.37 133.071 1718.65 131.991 1713.31 131.991C1697.5 131.991 1682.54 151.03 1682.54 164.752Z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<div class="flex gap-8 text-sm">
				<a href="{base}/story-map" class="nav-link">The Story Map</a>
				<a href="#environmental" class="nav-link">Domains</a>
				<a href="#footer" class="nav-link">Resources</a>
			</div>
		</div>
	</nav>

	<!-- Section 1: Hero -->
	<section id="hero" class="section-container">
		<div class="canvas-background">
			<Canvas>
				<HeroScene scrollProgress={$heroProgress} />
			</Canvas>
		</div>
		<div class="content-overlay">
			<div class="hero-content">
				<h1 class="hero-title">
					eScience Center<br />
					<span class="text-blue-300">a Data Story</span>
				</h1>
				<p class="hero-subtitle">
					Transforming scientific research through compelling data narratives
				</p>
			</div>
		</div>
		<div class="scroll-indicator">
			<div class="scroll-arrow"></div>
		</div>
	</section>

	<!-- Section 2: Environmental -->
	<section id="environmental" class="section-container">
		<div class="canvas-background">
			<Canvas>
				<EnvironmentalScene
					scrollProgress={$envProgress}
					projects={environmentalProjects}
					onProjectClick={handleProjectClick}
					{selectedProject}
				/>
			</Canvas>
		</div>
		<div class="content-overlay">
			<div class="domain-content">
				<h2 class="domain-title">Environmental</h2>
				<p class="domain-description">
					Visualizing climate patterns, weather data, and environmental systems through interactive
					3D representations
				</p>
				<div class="domain-features">
					<div class="feature-tag">Climate Data</div>
					<div class="feature-tag">Weather Patterns</div>
					<div class="feature-tag">Geospatial Analysis</div>
					<div class="feature-tag">Temperature Gradients</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Section 3: Engineering -->
	<section id="engineering" class="section-container">
		<div class="canvas-background">
			<Canvas>
				<EngineeringScene
					scrollProgress={$engProgress}
					projects={engineeringProjects}
					onProjectClick={handleProjectClick}
					{selectedProject}
				/>
			</Canvas>
		</div>
		<div class="content-overlay">
			<div class="domain-content">
				<h2 class="domain-title">Engineering</h2>
				<p class="domain-description">
					Bringing complex systems, network architectures, and structural simulations to life
				</p>
				<div class="domain-features">
					<div class="feature-tag">System Architecture</div>
					<div class="feature-tag">Network Graphs</div>
					<div class="feature-tag">CAD Models</div>
					<div class="feature-tag">Structural Analysis</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Section 4: SSH (Social Sciences & Humanities) -->
	<section id="ssh" class="section-container">
		<div class="canvas-background">
			<Canvas>
				<SSHScene
					scrollProgress={$sshProgress}
					projects={sshProjects}
					onProjectClick={handleProjectClick}
					{selectedProject}
				/>
			</Canvas>
		</div>
		<div class="content-overlay">
			<div class="domain-content">
				<h2 class="domain-title">SSH</h2>
				<p class="domain-description">
					Making social networks, relationships, and human data comprehensible through visual
					storytelling
				</p>
				<div class="domain-features">
					<div class="feature-tag">Social Networks</div>
					<div class="feature-tag">Network Analysis</div>
					<div class="feature-tag">Text Data</div>
					<div class="feature-tag">Relationship Mapping</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Section 5: Life Sciences -->
	<section id="life-sciences" class="section-container">
		<div class="canvas-background">
			<Canvas>
				<LifeSciencesScene
					scrollProgress={$lifeProgress}
					projects={lifeSciencesProjects}
					onProjectClick={handleProjectClick}
					{selectedProject}
				/>
			</Canvas>
		</div>
		<div class="content-overlay">
			<div class="domain-content">
				<h2 class="domain-title">Life Sciences</h2>
				<p class="domain-description">
					Exploring genomic data, molecular structures, and biological systems in stunning 3D detail
				</p>
				<div class="domain-features">
					<div class="feature-tag">DNA Visualization</div>
					<div class="feature-tag">Protein Structures</div>
					<div class="feature-tag">Genomic Data</div>
					<div class="feature-tag">Molecular Biology</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer id="footer" class="footer-container">
		<div class="footer-content">
			<div class="footer-links">
				<a href="#" class="footer-link">More info</a>
				<span class="footer-divider">|</span>
				<a href="#" class="footer-link">Credits</a>
				<span class="footer-divider">|</span>
				<a href="#" class="footer-link">Resources</a>
				<span class="footer-divider">|</span>
				<a href="#" class="footer-link">...</a>
			</div>
		</div>
	</footer>
</div>

<!-- Project Modal (shared across all sections) -->
<ProjectModal project={selectedProject} onClose={closeModal} />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		background: #0a0a0a;
		color: #ffffff;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	:global(html) {
		scroll-behavior: auto;
	}

	:global(html.lenis, html.lenis body) {
		height: auto;
	}

	:global(.lenis.lenis-smooth) {
		scroll-behavior: auto !important;
	}

	:global(.lenis.lenis-smooth [data-lenis-prevent]) {
		overscroll-behavior: contain;
	}

	:global(.lenis.lenis-stopped) {
		overflow: hidden;
	}

	:global(.lenis.lenis-scrolling iframe) {
		pointer-events: none;
	}

	.landing-container {
		width: 100%;
		min-height: 100vh;
	}

	.section-container {
		position: relative;
		width: 100%;
		min-height: 100vh;
		overflow: hidden;
	}

	.section-container::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 50% 50%,
			rgba(123, 175, 212, 0.15) 0%,
			rgba(59, 31, 84, 0.1) 50%,
			transparent 100%
		);
		animation: gradientShift 20s ease-in-out infinite;
		pointer-events: none;
		z-index: 0;
	}

	@keyframes gradientShift {
		0%,
		100% {
			background-position: 0% 50%;
			opacity: 0.8;
		}
		25% {
			background-position: 100% 50%;
			opacity: 1;
		}
		50% {
			background-position: 50% 100%;
			opacity: 0.6;
		}
		75% {
			background-position: 0% 0%;
			opacity: 0.9;
		}
	}

	.canvas-background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		will-change: transform;
	}

	.content-overlay {
		position: relative;
		z-index: 10;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		will-change: transform;
	}

	.content-overlay > * {
		pointer-events: auto;
	}

	/* Navigation */
	.nav-link {
		color: #7bafd4;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	.nav-link::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(123, 175, 212, 0.2), rgba(244, 184, 65, 0.1));
		transform: translateX(-100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.nav-link:hover {
		color: #f4b841;
		transform: translateY(-2px);
	}

	.nav-link:hover::before {
		transform: translateX(0);
	}

	.nav-link:active {
		transform: translateY(0);
	}

	/* Hero Section */
	.hero-content {
		text-align: center;
		max-width: 900px;
		padding: 2rem;
	}

	.hero-title {
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: 1.5rem;
		background: linear-gradient(135deg, #7bafd4 0%, #3b1f54 50%, #f4b841 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-shift 6s ease infinite;
		background-size: 200% 200%;
	}

	@keyframes gradient-shift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.hero-subtitle {
		font-size: clamp(1.25rem, 2vw, 1.75rem);
		color: #7bafd4;
		opacity: 0.9;
		font-weight: 300;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
	}

	.scroll-arrow {
		width: 24px;
		height: 40px;
		border: 2px solid #7bafd4;
		border-radius: 12px;
		position: relative;
		animation: scroll-bounce 2s ease-in-out infinite;
	}

	.scroll-arrow::before {
		content: '';
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 6px;
		height: 6px;
		background: #7bafd4;
		border-radius: 50%;
		animation: scroll-dot 2s ease-in-out infinite;
	}

	@keyframes scroll-bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(10px);
		}
	}

	@keyframes scroll-dot {
		0% {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateX(-50%) translateY(16px);
		}
	}

	/* Domain Sections */
	.domain-content {
		max-width: 600px;
		padding: 3rem;
		margin-left: 5%;
		backdrop-filter: blur(20px) saturate(180%);
		background: linear-gradient(
			135deg,
			rgba(123, 175, 212, 0.15) 0%,
			rgba(59, 31, 84, 0.1) 50%,
			rgba(244, 184, 65, 0.05) 100%
		);
		border-radius: 1.5rem;
		border: 1px solid;
		border-image: linear-gradient(135deg, rgba(123, 175, 212, 0.5), rgba(244, 184, 65, 0.3)) 1;
		box-shadow:
			0 8px 32px 0 rgba(0, 0, 0, 0.37),
			inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform;
	}

	.domain-content:hover {
		transform: translateY(-8px) scale(1.02);
		background: linear-gradient(
			135deg,
			rgba(123, 175, 212, 0.25) 0%,
			rgba(59, 31, 84, 0.2) 50%,
			rgba(244, 184, 65, 0.15) 100%
		);
		box-shadow:
			0 12px 48px 0 rgba(123, 175, 212, 0.3),
			inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
	}

	.domain-title {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		margin-bottom: 1rem;
		color: #7bafd4;
		opacity: 0;
		transform: translateY(30px);
		animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		animation-delay: 0.2s;
	}

	.domain-description {
		font-size: clamp(1.125rem, 1.5vw, 1.25rem);
		line-height: 1.6;
		color: #e0e0e0;
		margin-bottom: 2rem;
		opacity: 0;
		transform: translateY(30px);
		animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		animation-delay: 0.4s;
	}

	@keyframes fadeInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.domain-features {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.feature-tag {
		padding: 0.5rem 1rem;
		background: rgba(59, 31, 84, 0.4);
		border: 1px solid #3b1f54;
		border-radius: 2rem;
		font-size: 0.875rem;
		color: #7bafd4;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		cursor: pointer;
		opacity: 0;
		transform: translateY(20px) scale(0.9);
		animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.feature-tag:nth-child(1) {
		animation-delay: 0.6s;
	}
	.feature-tag:nth-child(2) {
		animation-delay: 0.7s;
	}
	.feature-tag:nth-child(3) {
		animation-delay: 0.8s;
	}
	.feature-tag:nth-child(4) {
		animation-delay: 0.9s;
	}

	@keyframes fadeInScale {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.feature-tag::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(123, 175, 212, 0.3), rgba(244, 184, 65, 0.2));
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.feature-tag:hover {
		background: rgba(59, 31, 84, 0.7);
		border-color: #7bafd4;
		transform: translateY(-4px) scale(1.05);
		box-shadow: 0 8px 20px rgba(123, 175, 212, 0.3);
	}

	.feature-tag:hover::before {
		opacity: 1;
	}

	.feature-tag:active {
		transform: translateY(-2px) scale(1.02);
	}

	/* Footer */
	.footer-container {
		background: linear-gradient(180deg, rgba(10, 10, 10, 0.9) 0%, #0a0a0a 100%);
		padding: 4rem 2rem;
		text-align: center;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-links {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.footer-link {
		color: #7bafd4;
		text-decoration: none;
		transition: color 0.3s ease;
		font-size: 1.125rem;
	}

	.footer-link:hover {
		color: #f4b841;
	}

	.footer-divider {
		color: #3b1f54;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.domain-content {
			margin-left: 0;
			margin: 2rem;
			padding: 2rem;
		}

		nav {
			padding: 1rem;
		}

		nav .flex {
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}
	}
</style>
