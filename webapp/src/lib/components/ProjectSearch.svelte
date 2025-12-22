<script lang="ts">
	import type { ProjectWithDomain } from '$lib/types/project';
	import { computePosition, flip, offset, size, autoUpdate } from '@floating-ui/dom';

	interface Props {
		projects: ProjectWithDomain[];
		onSelect?: (project: ProjectWithDomain) => void;
		placeholder?: string;
	}

	let { projects, onSelect, placeholder = 'Search projects...' }: Props = $props();

	let query = $state('');
	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let referenceEl: HTMLDivElement | undefined = $state();
	let floatingEl: HTMLElement | undefined = $state();
	let cleanup: (() => void) | undefined = $state();

	const filteredProjects = $derived(
		query.trim().length > 0
			? projects.filter(
					(p) =>
						p.brand_name.toLowerCase().includes(query.toLowerCase()) ||
						p.short_statement?.toLowerCase().includes(query.toLowerCase())
				)
			: []
	);

	function updatePosition() {
		if (!referenceEl || !floatingEl) return;

		computePosition(referenceEl, floatingEl, {
			placement: 'bottom-start',
			middleware: [
				offset(8),
				flip(),
				size({
					apply({ availableHeight, elements }) {
						Object.assign(elements.floating.style, {
							maxHeight: `${Math.min(availableHeight - 16, 256)}px`
						});
					}
				})
			]
		}).then(({ x, y }) => {
			if (floatingEl) {
				Object.assign(floatingEl.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			}
		});
	}

	$effect(() => {
		if (isOpen && referenceEl && floatingEl) {
			cleanup = autoUpdate(referenceEl, floatingEl, updatePosition);
		}

		return () => {
			if (cleanup) {
				cleanup();
				cleanup = undefined;
			}
		};
	});

	function handleSelect(project: ProjectWithDomain) {
		query = project.brand_name;
		isOpen = false;
		selectedIndex = -1;

		if (onSelect) {
			onSelect(project);
		} else {
			console.log('Selected project:', project.brand_name, project.id);
		}
	}

	function scrollSelectedIntoView() {
		if (!floatingEl || selectedIndex < 0) return;
		const items = floatingEl.querySelectorAll('li');
		const selectedItem = items[selectedIndex];
		if (selectedItem) {
			selectedItem.scrollIntoView({ block: 'nearest' });
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen || filteredProjects.length === 0) {
			if (event.key === 'ArrowDown' && query.trim().length > 0) {
				isOpen = true;
				selectedIndex = 0;
				event.preventDefault();
			}
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, filteredProjects.length - 1);
				requestAnimationFrame(scrollSelectedIntoView);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				requestAnimationFrame(scrollSelectedIntoView);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < filteredProjects.length) {
					handleSelect(filteredProjects[selectedIndex]);
				}
				break;
			case 'Escape':
				isOpen = false;
				selectedIndex = -1;
				break;
		}
	}

	function handleFocus() {
		if (query.trim().length > 0 && filteredProjects.length > 0) {
			isOpen = true;
		}
	}

	function handleBlur(event: FocusEvent) {
		const relatedTarget = event.relatedTarget as HTMLElement | null;
		if (relatedTarget && floatingEl?.contains(relatedTarget)) {
			return;
		}
		setTimeout(() => {
			isOpen = false;
			selectedIndex = -1;
		}, 150);
	}

	function handleInput() {
		isOpen = query.trim().length > 0;
		selectedIndex = -1;
	}

	function handleListWheel(event: WheelEvent) {
		event.stopPropagation();
	}
</script>

<div class="relative" bind:this={referenceEl}>
	<div class="relative">
		<input
			bind:value={query}
			oninput={handleInput}
			onfocus={handleFocus}
			onblur={handleBlur}
			onkeydown={handleKeydown}
			type="text"
			{placeholder}
			class="w-48 lg:w-64 px-4 py-2 pl-10 text-sm bg-white/10 border border-white/20 rounded-lg
				   text-white placeholder-white/50 backdrop-blur-sm
				   focus:outline-none focus:ring-2 focus:ring-[#7bafd4]/50 focus:border-[#7bafd4]/50
				   transition-all duration-200"
		/>
		<svg
			class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>
</div>

{#if isOpen && filteredProjects.length > 0}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ul
		bind:this={floatingEl}
		class="fixed w-48 lg:w-64 overflow-y-auto
			   bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-[100]"
		style="overscroll-behavior: contain;"
		onwheel={handleListWheel}
	>
		{#each filteredProjects as project, index (project.id)}
			<li>
				<button
					type="button"
					onclick={() => handleSelect(project)}
					onmouseenter={() => (selectedIndex = index)}
					class="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
						   {index === selectedIndex ? 'bg-[#7bafd4]/30' : 'hover:bg-white/10'}"
				>
					<span
						class="w-2 h-2 rounded-full flex-shrink-0"
						style="background-color: {project.domain.color}"
					></span>
					<div class="min-w-0">
						<p class="text-sm text-white truncate">{project.brand_name}</p>
						{#if project.short_statement}
							<p class="text-xs text-white/50 truncate">{project.short_statement}</p>
						{/if}
					</div>
				</button>
			</li>
		{/each}
	</ul>
{:else if isOpen && query.trim().length > 0 && filteredProjects.length === 0}
	<div
		bind:this={floatingEl}
		class="fixed w-48 lg:w-64 px-4 py-3
			   bg-black/95 backdrop-blur-md border border-white/20 rounded-lg z-[100]"
	>
		<p class="text-sm text-white/50">No projects found</p>
	</div>
{/if}
