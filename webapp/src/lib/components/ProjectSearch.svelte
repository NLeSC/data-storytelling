<script lang="ts">
	import type { ProjectWithDomain } from '$lib/types/project';
	import { SOFTWARE_DOMAIN } from '$lib/types/project';
	import { searchSoftwareFull } from '$lib/api/rsd-software';
	import { computePosition, flip, offset, size, autoUpdate } from '@floating-ui/dom';

	interface Props {
		projects: ProjectWithDomain[];
		onSelect?: (project: ProjectWithDomain) => void;
		placeholder?: string;
	}

	let { projects, onSelect, placeholder = 'Search projects & software...' }: Props = $props();

	let query = $state('');
	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let referenceEl: HTMLDivElement | undefined = $state();
	let floatingEl: HTMLElement | undefined = $state();
	let cleanup: (() => void) | undefined = $state();

	let apiResults = $state<ProjectWithDomain[]>([]);
	let isSearching = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	const filteredProjects = $derived(
		query.trim().length > 0
			? projects.filter(
					(p) =>
						p.brand_name.toLowerCase().includes(query.toLowerCase()) ||
						p.short_statement?.toLowerCase().includes(query.toLowerCase())
				)
			: []
	);

	const preloadedIds = $derived(new Set(projects.map((p) => p.id)));

	const dedupedApiResults = $derived(
		apiResults.filter((r) => !preloadedIds.has(r.id))
	);

	const hasBothSections = $derived(filteredProjects.length > 0 && dedupedApiResults.length > 0);
	const allResults = $derived([...filteredProjects, ...dedupedApiResults]);
	const hasResults = $derived(allResults.length > 0);

	function triggerApiSearch(searchQuery: string) {
		clearTimeout(debounceTimer);
		if (searchQuery.trim().length < 2) {
			apiResults = [];
			isSearching = false;
			return;
		}
		isSearching = true;
		debounceTimer = setTimeout(async () => {
			const results = await searchSoftwareFull(searchQuery);
			apiResults = results.map((p) => ({ ...p, domain: SOFTWARE_DOMAIN }));
			isSearching = false;
		}, 300);
	}

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
							maxHeight: `${Math.min(availableHeight - 16, 320)}px`
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
		const items = floatingEl.querySelectorAll('[data-result-item]');
		const selectedItem = items[selectedIndex];
		if (selectedItem) {
			selectedItem.scrollIntoView({ block: 'nearest' });
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen || allResults.length === 0) {
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
				selectedIndex = Math.min(selectedIndex + 1, allResults.length - 1);
				requestAnimationFrame(scrollSelectedIntoView);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				requestAnimationFrame(scrollSelectedIntoView);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < allResults.length) {
					handleSelect(allResults[selectedIndex]);
				}
				break;
			case 'Escape':
				isOpen = false;
				selectedIndex = -1;
				break;
		}
	}

	function handleFocus() {
		if (query.trim().length > 0 && hasResults) {
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
		triggerApiSearch(query);
	}

	function handleListWheel(event: WheelEvent) {
		event.stopPropagation();
	}
</script>

<div id="project-search" class="relative" bind:this={referenceEl}>
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
		{#if isSearching}
			<svg
				class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6bc5a0] animate-spin"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
			</svg>
		{:else}
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
		{/if}
	</div>
</div>

{#if isOpen && (hasResults || isSearching)}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ul
		bind:this={floatingEl}
		class="fixed w-48 lg:w-64 overflow-y-auto
			   bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-[100]"
		style="overscroll-behavior: contain;"
		onwheel={handleListWheel}
	>
		{#if filteredProjects.length > 0}
			{#if hasBothSections}
				<li class="px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/40 font-semibold border-b border-white/10">
					Projects
				</li>
			{/if}
			{#each filteredProjects as project, index (project.id)}
				<li>
					<button
						type="button"
						data-result-item
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
		{/if}

		{#if dedupedApiResults.length > 0}
			{#if hasBothSections}
				<li class="px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/40 font-semibold border-b border-white/10 {filteredProjects.length > 0 ? 'border-t' : ''}">
					Software
				</li>
			{/if}
			{#each dedupedApiResults as software, i (software.id)}
				{@const globalIndex = filteredProjects.length + i}
				<li>
					<button
						type="button"
						data-result-item
						onclick={() => handleSelect(software)}
						onmouseenter={() => (selectedIndex = globalIndex)}
						class="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
							   {globalIndex === selectedIndex ? 'bg-[#7bafd4]/30' : 'hover:bg-white/10'}"
					>
						<svg
							class="w-3 h-3 flex-shrink-0 text-[#6bc5a0]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2"
						>
							<polyline points="16 18 22 12 16 6"></polyline>
							<polyline points="8 6 2 12 8 18"></polyline>
						</svg>
						<div class="min-w-0">
							<p class="text-sm text-white truncate">{software.brand_name}</p>
							{#if software.short_statement}
								<p class="text-xs text-white/50 truncate">{software.short_statement}</p>
							{/if}
						</div>
					</button>
				</li>
			{/each}
		{/if}

		{#if isSearching && dedupedApiResults.length === 0 && filteredProjects.length === 0}
			<li class="px-4 py-3 text-sm text-white/40 flex items-center gap-2">
				<svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
				</svg>
				Searching software catalog...
			</li>
		{/if}
	</ul>
{:else if isOpen && query.trim().length > 0 && !hasResults && !isSearching}
	<div
		bind:this={floatingEl}
		class="fixed w-48 lg:w-64 px-4 py-3
			   bg-black/95 backdrop-blur-md border border-white/20 rounded-lg z-[100]"
	>
		<p class="text-sm text-white/50">No results found</p>
	</div>
{/if}
