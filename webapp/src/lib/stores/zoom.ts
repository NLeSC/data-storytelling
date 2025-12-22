import { writable } from 'svelte/store';

// Zoom level: 1 = default, < 1 = zoomed in, > 1 = zoomed out
export const zoomLevel = writable(1);

export function zoomIn() {
	zoomLevel.update((z) => Math.max(0.5, z - 0.15));
}

export function zoomOut() {
	zoomLevel.update((z) => Math.min(2, z + 0.15));
}

export function resetZoom() {
	zoomLevel.set(1);
}
