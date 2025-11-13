<script lang="ts">
	import { scrollStore } from '$lib/stores/scroll';

	let scrollProgress = $derived($scrollStore.scrollProgress);
	let sections = ['Hero', 'Environmental', 'Engineering', 'SSH', 'Life Sciences'];
	let currentSection = $derived(Math.floor(scrollProgress * 5));

	function scrollToSection(index: number) {
		const sections = document.querySelectorAll('.section-container');
		if (sections[index]) {
			sections[index].scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<!-- Progress bar at top -->
<div class="progress-bar">
	<div class="progress-fill" style="width: {scrollProgress * 100}%"></div>
</div>

<!-- Section dots -->
<div class="section-dots">
	{#each sections as section, i}
		<button
			class="dot"
			class:active={currentSection === i}
			onclick={() => scrollToSection(i)}
			aria-label="Navigate to {section}"
		>
			<span class="tooltip">{section}</span>
		</button>
	{/each}
</div>

<style>
	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(123, 175, 212, 0.1);
		z-index: 1000;
		pointer-events: none;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #7bafd4, #f4b841);
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 0 10px rgba(123, 175, 212, 0.5);
	}

	.section-dots {
		position: fixed;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		z-index: 100;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(123, 175, 212, 0.3);
		border: 2px solid rgba(123, 175, 212, 0.5);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		padding: 0;
	}

	.dot:hover {
		background: rgba(123, 175, 212, 0.6);
		transform: scale(1.3);
		box-shadow: 0 0 15px rgba(123, 175, 212, 0.5);
	}

	.dot.active {
		background: #7bafd4;
		border-color: #f4b841;
		transform: scale(1.5);
		box-shadow: 0 0 20px rgba(123, 175, 212, 0.8);
	}

	.tooltip {
		position: absolute;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(10, 10, 10, 0.9);
		backdrop-filter: blur(10px);
		color: #7bafd4;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid rgba(123, 175, 212, 0.3);
	}

	.dot:hover .tooltip {
		opacity: 1;
		transform: translateY(-50%) translateX(-0.5rem);
	}

	@media (max-width: 768px) {
		.section-dots {
			right: 1rem;
		}

		.tooltip {
			display: none;
		}
	}
</style>
