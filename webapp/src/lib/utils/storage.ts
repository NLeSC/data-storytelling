/**
 * localStorage utilities with versioning and type safety
 */

interface StorageWrapper<T> {
	version: number;
	data: T;
}

const CURRENT_VERSION = 1;

/**
 * Get data from localStorage with type safety
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
	if (typeof window === 'undefined') return defaultValue;

	try {
		const stored = localStorage.getItem(key);
		if (!stored) return defaultValue;

		const parsed: StorageWrapper<T> = JSON.parse(stored);

		// Version check - could add migration logic here if needed
		if (parsed.version !== CURRENT_VERSION) {
			console.warn(`Storage version mismatch for ${key}, using default`);
			return defaultValue;
		}

		return parsed.data;
	} catch (error) {
		console.error(`Error reading from localStorage key "${key}":`, error);
		return defaultValue;
	}
}

/**
 * Save data to localStorage with versioning
 */
export function saveToStorage<T>(key: string, data: T): boolean {
	if (typeof window === 'undefined') return false;

	try {
		const wrapper: StorageWrapper<T> = {
			version: CURRENT_VERSION,
			data
		};
		localStorage.setItem(key, JSON.stringify(wrapper));
		return true;
	} catch (error) {
		console.error(`Error saving to localStorage key "${key}":`, error);
		return false;
	}
}

/**
 * Remove item from localStorage
 */
export function removeFromStorage(key: string): boolean {
	if (typeof window === 'undefined') return false;

	try {
		localStorage.removeItem(key);
		return true;
	} catch (error) {
		console.error(`Error removing localStorage key "${key}":`, error);
		return false;
	}
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
	if (typeof window === 'undefined') return false;

	try {
		const testKey = '__storage_test__';
		localStorage.setItem(testKey, testKey);
		localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}
