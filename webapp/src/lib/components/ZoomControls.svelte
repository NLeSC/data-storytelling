<script lang="ts">
	import { zoomIn, zoomOut, resetZoom, zoomLevel } from '$lib/stores/zoom';
</script>

<div class="zoom-controls">
	<button class="zoom-btn" onclick={zoomIn} aria-label="Zoom in">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="12" y1="5" x2="12" y2="19"></line>
			<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
	</button>
	<button class="zoom-btn reset" onclick={resetZoom} aria-label="Reset zoom">
		<span class="zoom-level">{Math.round((2 - $zoomLevel) * 100)}%</span>
	</button>
	<button class="zoom-btn" onclick={zoomOut} aria-label="Zoom out">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
	</button>
</div>

<style>
	.zoom-controls {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		z-index: 40;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		backdrop-filter: blur(12px);
		background: rgba(0, 0, 0, 0.4);
		padding: 0.5rem;
		border-radius: 0.75rem;
		border: 1px solid rgba(123, 175, 212, 0.3);
	}

	.zoom-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(123, 175, 212, 0.2);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.zoom-btn:hover {
		background: rgba(123, 175, 212, 0.4);
		color: #fff;
	}

	.zoom-btn:active {
		transform: scale(0.95);
	}

	.zoom-btn.reset {
		font-size: 0.7rem;
		font-weight: 600;
	}

	.zoom-level {
		font-variant-numeric: tabular-nums;
	}
</style>
