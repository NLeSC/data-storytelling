import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

interface ScrollState {
	scrollY: number;
	scrollProgress: number;
	windowHeight: number;
	documentHeight: number;
	velocity: number;
	direction: 1 | -1;
}

function createScrollStore() {
	const { subscribe, set } = writable<ScrollState>({
		scrollY: 0,
		scrollProgress: 0,
		windowHeight: 0,
		documentHeight: 0,
		velocity: 0,
		direction: 1
	});

	if (browser) {
		let lastScrollY = 0;
		let lastTime = performance.now();
		let rafId: number | null = null;
		let cachedDocumentHeight = document.documentElement.scrollHeight;
		let cachedWindowHeight = window.innerHeight;

		const commitUpdate = () => {
			rafId = null;
			const now = performance.now();
			const deltaTime = (now - lastTime) / 1000;
			const scrollY = window.scrollY;
			const scrollProgress = scrollY / (cachedDocumentHeight - cachedWindowHeight);

			const rawVelocity = deltaTime > 0 ? (scrollY - lastScrollY) / deltaTime / 1000 : 0;
			const velocity = Math.max(-5, Math.min(5, rawVelocity));
			const direction = scrollY >= lastScrollY ? 1 : -1;

			lastScrollY = scrollY;
			lastTime = now;

			set({
				scrollY,
				scrollProgress: Math.max(0, Math.min(1, scrollProgress)),
				windowHeight: cachedWindowHeight,
				documentHeight: cachedDocumentHeight,
				velocity,
				direction: direction as 1 | -1
			});
		};

		const onScroll = () => {
			if (rafId === null) {
				rafId = requestAnimationFrame(commitUpdate);
			}
		};

		const onResize = () => {
			cachedDocumentHeight = document.documentElement.scrollHeight;
			cachedWindowHeight = window.innerHeight;
			if (rafId === null) rafId = requestAnimationFrame(commitUpdate);
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		commitUpdate();
	}

	return {
		subscribe,
		scrollTo: (target: number | string, options?: { offset?: number; duration?: number }) => {
			if (typeof target === 'number') {
				window.scrollTo({ top: target + (options?.offset ?? 0), behavior: 'smooth' });
			} else {
				const element = document.querySelector(target);
				if (element) {
					const top = element.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
					window.scrollTo({ top, behavior: 'smooth' });
				}
			}
		},
		stop: () => {},
		start: () => {}
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
