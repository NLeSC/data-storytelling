<script lang="ts">
	import { scrollStore } from '$lib/stores/scroll';

	let scrollProgress = $derived($scrollStore.scrollProgress);
</script>

<div class="floating-shapes">
	{#each Array(6) as _, i}
		<div
			class="shape shape-{i + 1}"
			style="transform: translateY({scrollProgress * (50 + i * 20)}px) rotate({scrollProgress * 360}deg)"
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
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform;
	}

	.shape-1 {
		width: 200px;
		height: 200px;
		background: linear-gradient(135deg, #7bafd4, #3b1f54);
		border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
		top: 10%;
		left: 5%;
		animation: float1 25s ease-in-out infinite;
	}

	.shape-2 {
		width: 150px;
		height: 150px;
		background: linear-gradient(135deg, #f4b841, #7bafd4);
		border-radius: 50%;
		top: 60%;
		right: 10%;
		animation: float2 20s ease-in-out infinite;
	}

	.shape-3 {
		width: 180px;
		height: 180px;
		background: linear-gradient(135deg, #3b1f54, #f4b841);
		border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
		bottom: 20%;
		left: 15%;
		animation: float3 30s ease-in-out infinite;
	}

	.shape-4 {
		width: 120px;
		height: 120px;
		background: linear-gradient(135deg, #7bafd4, #f4b841);
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		top: 30%;
		right: 20%;
		animation: float4 22s ease-in-out infinite;
	}

	.shape-5 {
		width: 160px;
		height: 160px;
		background: linear-gradient(135deg, #f4b841, #3b1f54);
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		bottom: 40%;
		right: 5%;
		animation: float5 28s ease-in-out infinite;
	}

	.shape-6 {
		width: 140px;
		height: 140px;
		background: linear-gradient(135deg, #3b1f54, #7bafd4);
		border-radius: 50% 50% 30% 70% / 30% 70% 50% 50%;
		top: 50%;
		left: 8%;
		animation: float6 24s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		25% {
			transform: translate(30px, -30px) rotate(90deg);
		}
		50% {
			transform: translate(-20px, -60px) rotate(180deg);
		}
		75% {
			transform: translate(-40px, -30px) rotate(270deg);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		33% {
			transform: translate(-40px, 40px) rotate(120deg);
		}
		66% {
			transform: translate(30px, -30px) rotate(240deg);
		}
	}

	@keyframes float3 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(50px, 50px) rotate(180deg);
		}
	}

	@keyframes float4 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		25% {
			transform: translate(-25px, 35px) rotate(80deg);
		}
		50% {
			transform: translate(40px, 20px) rotate(160deg);
		}
		75% {
			transform: translate(20px, -40px) rotate(240deg);
		}
	}

	@keyframes float5 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		40% {
			transform: translate(-35px, -35px) rotate(140deg);
		}
		80% {
			transform: translate(45px, 25px) rotate(280deg);
		}
	}

	@keyframes float6 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		30% {
			transform: translate(35px, -40px) rotate(100deg);
		}
		60% {
			transform: translate(-30px, 30px) rotate(200deg);
		}
	}
</style>
