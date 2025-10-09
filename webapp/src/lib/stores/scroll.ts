import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import Lenis from 'lenis';

interface ScrollState {
	scrollY: number;
	scrollProgress: number;
	windowHeight: number;
	documentHeight: number;
	velocity: number;
	direction: 1 | -1;
}

let lenisInstance: Lenis | null = null;

function createScrollStore() {
	const { subscribe, set, update } = writable<ScrollState>({
		scrollY: 0,
		scrollProgress: 0,
		windowHeight: 0,
		documentHeight: 0,
		velocity: 0,
		direction: 1
	});

	if (browser) {
		// Initialize Lenis smooth scroll
		lenisInstance = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2
		});

		// Update scroll state on Lenis scroll event
		lenisInstance.on('scroll', ({ scroll, velocity, direction }: any) => {
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollProgress = scroll / (documentHeight - windowHeight);

			set({
				scrollY: scroll,
				scrollProgress: Math.max(0, Math.min(1, scrollProgress)),
				windowHeight,
				documentHeight,
				velocity,
				direction: direction as 1 | -1
			});
		});

		// Lenis animation frame
		function raf(time: number) {
			lenisInstance?.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		// Handle window resize
		const handleResize = () => {
			update((state) => ({
				...state,
				windowHeight: window.innerHeight,
				documentHeight: document.documentElement.scrollHeight
			}));
		};
		window.addEventListener('resize', handleResize);
	}

	return {
		subscribe,
		scrollTo: (target: number | string, options?: { offset?: number; duration?: number }) => {
			if (lenisInstance) {
				lenisInstance.scrollTo(target, options);
			}
		},
		stop: () => lenisInstance?.stop(),
		start: () => lenisInstance?.start()
	};
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
