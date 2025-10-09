<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { scrollStore, getSectionProgress } from '$lib/stores/scroll';
	import HeroScene from '$lib/components/threlte/HeroScene.svelte';
	import EnvironmentalScene from '$lib/components/threlte/EnvironmentalScene.svelte';
	import EngineeringScene from '$lib/components/threlte/EngineeringScene.svelte';
	import SSHScene from '$lib/components/threlte/SSHScene.svelte';
	import LifeSciencesScene from '$lib/components/threlte/LifeSciencesScene.svelte';

	// Section progress stores
	const heroProgress = getSectionProgress(0, 5);
	const envProgress = getSectionProgress(1, 5);
	const engProgress = getSectionProgress(2, 5);
	const sshProgress = getSectionProgress(3, 5);
	const lifeProgress = getSectionProgress(4, 5);

	let currentSection = $state(0);

	// Determine which section is currently in view
	$effect(() => {
		const progress = $scrollStore.scrollProgress;
		currentSection = Math.floor(progress * 5);
	});
</script>

<svelte:head>
	<title>eScience Center - A Data Story</title>
	<meta
		name="description"
		content="Showcasing data storytelling capabilities across scientific domains"
	/>
</svelte:head>

<div class="landing-container">
	<!-- Fixed Navigation -->
	<nav class="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-sm bg-black/30">
		<div class="max-w-7xl mx-auto flex items-center justify-between">
			<div class="text-xl font-bold text-blue-300">Logo</div>
			<div class="flex gap-8 text-sm">
				<a href="#hero" class="nav-link">The Story Map</a>
				<a href="#footer" class="nav-link">Awesome Resources</a>
				<a href="#footer" class="nav-link">Other Options?</a>
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
				<EnvironmentalScene scrollProgress={$envProgress} />
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
				<EngineeringScene scrollProgress={$engProgress} />
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
				<SSHScene scrollProgress={$sshProgress} />
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
				<LifeSciencesScene scrollProgress={$lifeProgress} />
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
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
	}

	.landing-container {
		width: 100%;
		min-height: 100vh;
	}

	.section-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.canvas-background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
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
	}

	.content-overlay > * {
		pointer-events: auto;
	}

	/* Navigation */
	.nav-link {
		color: #7bafd4;
		text-decoration: none;
		transition: color 0.3s ease;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
	}

	.nav-link:hover {
		color: #f4b841;
		background: rgba(123, 175, 212, 0.1);
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
		backdrop-filter: blur(10px);
		background: rgba(10, 10, 10, 0.7);
		border-radius: 1rem;
		border: 1px solid rgba(123, 175, 212, 0.3);
	}

	.domain-title {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		margin-bottom: 1rem;
		color: #7bafd4;
	}

	.domain-description {
		font-size: clamp(1.125rem, 1.5vw, 1.25rem);
		line-height: 1.6;
		color: #e0e0e0;
		margin-bottom: 2rem;
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
		transition: all 0.3s ease;
	}

	.feature-tag:hover {
		background: rgba(59, 31, 84, 0.7);
		border-color: #7bafd4;
		transform: translateY(-2px);
	}

	/* Footer */
	.footer-container {
		background: linear-gradient(180deg, rgba(10, 10, 10, 0.9) 0%, #0a0a0a 100%);
		padding: 4rem 2rem;
		text-align: center;
		scroll-snap-align: start;
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
