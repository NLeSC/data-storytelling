<script lang="ts">
	import { scrollStore } from '$lib/stores/scroll';

	let scrollProgress = $derived($scrollStore.scrollProgress);
</script>

<div class="floating-shapes">
	{#each Array(6) as _, i}
		<div
			class="shape shape-{i + 1}"
			style="transform: translate3d(0, {scrollProgress * (50 + i * 20)}px, 0) rotate({scrollProgress * 360}deg)"
		></div>
	{/each}
</div>

<style>
	.floating-shapes {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 5;
		overflow: hidden;
	}

	.shape {
		position: absolute;
		opacity: 0.1;
		filter: blur(2px);
		will-change: transform;
	}

	.shape-1 {
		width: 200px;
		height: 200px;
		background: linear-gradient(135deg, #7bafd4, #3b1f54);
		border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
		top: 10%;
		left: 5%;
	}

	.shape-2 {
		width: 150px;
		height: 150px;
		background: linear-gradient(135deg, #f4b841, #7bafd4);
		border-radius: 50%;
		top: 60%;
		right: 10%;
	}

	.shape-3 {
		width: 180px;
		height: 180px;
		background: linear-gradient(135deg, #3b1f54, #f4b841);
		border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
		bottom: 20%;
		left: 15%;
	}

	.shape-4 {
		width: 120px;
		height: 120px;
		background: linear-gradient(135deg, #7bafd4, #f4b841);
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		top: 30%;
		right: 20%;
	}

	.shape-5 {
		width: 160px;
		height: 160px;
		background: linear-gradient(135deg, #f4b841, #3b1f54);
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		bottom: 40%;
		right: 5%;
	}

	.shape-6 {
		width: 140px;
		height: 140px;
		background: linear-gradient(135deg, #3b1f54, #7bafd4);
		border-radius: 50% 50% 30% 70% / 30% 70% 50% 50%;
		top: 50%;
		left: 8%;
	}
</style>
