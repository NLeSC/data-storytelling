<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import CustomStoryGeneratorTab from './CustomStoryGeneratorTab.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onOpenSettings: () => void;
	}

	let { isOpen, onClose, onOpenSettings }: Props = $props();

	// Close on escape key + body scroll lock
	$effect(() => {
		if (typeof window === 'undefined') return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			window.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = '';
		};
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		id="custom-story-modal"
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
	>
		<div class="modal-content" transition:scale={{ duration: 300, start: 0.9 }}>
			<div class="modal-header">
				<h2 class="modal-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 20h9"/>
						<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
					</svg>
					Custom Story Generator
				</h2>
				<button class="close-button" onclick={onClose} aria-label="Close modal">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<div class="modal-body">
				<CustomStoryGeneratorTab {onOpenSettings} />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(10px);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		overflow-y: auto;
	}

	.modal-content {
		background: linear-gradient(
			135deg,
			rgba(10, 10, 10, 0.95) 0%,
			rgba(59, 31, 84, 0.9) 50%,
			rgba(10, 10, 10, 0.95) 100%
		);
		backdrop-filter: blur(20px);
		border-radius: 1.5rem;
		border: 1px solid rgba(123, 175, 212, 0.3);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		max-width: 1200px;
		width: 100%;
		height: 90vh;
		padding: 3rem;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(123, 175, 212, 0.2);
	}

	.modal-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: #7bafd4;
		margin: 0;
	}

	.close-button {
		background: rgba(123, 175, 212, 0.2);
		border: 1px solid rgba(123, 175, 212, 0.3);
		border-radius: 0.5rem;
		color: #7bafd4;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.close-button:hover {
		background: rgba(123, 175, 212, 0.3);
		border-color: #7bafd4;
		transform: scale(1.1);
	}

	.modal-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	@media (max-width: 768px) {
		.modal-content {
			padding: 2rem;
			height: 95vh;
		}

		.modal-title {
			font-size: 1.1rem;
		}
	}
</style>
