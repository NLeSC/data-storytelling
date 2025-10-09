import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

interface ScrollState {
	scrollY: number;
	scrollProgress: number;
	windowHeight: number;
	documentHeight: number;
}

function createScrollStore() {
	const { subscribe, set, update } = writable<ScrollState>({
		scrollY: 0,
		scrollProgress: 0,
		windowHeight: 0,
		documentHeight: 0
	});

	if (browser) {
		const updateScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollProgress = scrollY / (documentHeight - windowHeight);

			set({
				scrollY,
				scrollProgress: Math.max(0, Math.min(1, scrollProgress)),
				windowHeight,
				documentHeight
			});
		};

		window.addEventListener('scroll', updateScroll, { passive: true });
		window.addEventListener('resize', updateScroll);
		updateScroll();
	}

	return { subscribe };
}

export const scrollStore = createScrollStore();

/**
 * Get scroll progress for a specific section
 * @param sectionIndex - Index of the section (0-based)
 * @param totalSections - Total number of sections
 */
export const getSectionProgress = (sectionIndex: number, totalSections: number) =>
	derived(scrollStore, ($scroll) => {
		const sectionSize = 1 / totalSections;
		const sectionStart = sectionIndex * sectionSize;
		const sectionEnd = (sectionIndex + 1) * sectionSize;

		if ($scroll.scrollProgress < sectionStart) return 0;
		if ($scroll.scrollProgress > sectionEnd) return 1;

		return ($scroll.scrollProgress - sectionStart) / sectionSize;
	});
