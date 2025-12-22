/**
 * Settings store with localStorage persistence
 */

import type { StorySettings, AudienceType, GeminiModel } from '$lib/types/settings';
import { DEFAULT_SETTINGS } from '$lib/types/settings';
import { STORAGE_KEYS } from '$lib/types/story';
import { getFromStorage, saveToStorage } from '$lib/utils/storage';

// Create a reactive settings state
let settings = $state<StorySettings>(DEFAULT_SETTINGS);
let initialized = $state(false);

/**
 * Initialize settings from localStorage
 * Call this on mount in a component
 */
export function initSettings(): void {
	if (initialized) return;

	const stored = getFromStorage<StorySettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
	settings = { ...DEFAULT_SETTINGS, ...stored };
	initialized = true;
}

/**
 * Get current settings (reactive)
 */
export function getSettings(): StorySettings {
	return settings;
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
	return settings.geminiApiKey.trim().length > 0;
}

/**
 * Update settings and persist to localStorage
 */
export function updateSettings(updates: Partial<StorySettings>): void {
	settings = { ...settings, ...updates };
	saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Set API key
 */
export function setApiKey(key: string): void {
	updateSettings({ geminiApiKey: key });
}

/**
 * Set default audience
 */
export function setDefaultAudience(audience: AudienceType): void {
	updateSettings({ defaultAudience: audience });
}

/**
 * Set temperature
 */
export function setTemperature(temp: number): void {
	const clamped = Math.max(0, Math.min(2, temp));
	updateSettings({ temperature: clamped });
}

/**
 * Set max tokens
 */
export function setMaxTokens(tokens: number): void {
	const clamped = Math.max(100, Math.min(8192, tokens));
	updateSettings({ maxTokens: clamped });
}

/**
 * Set model
 */
export function setModel(model: GeminiModel): void {
	updateSettings({ model });
}

/**
 * Set custom prompt for audience
 */
export function setCustomPrompt(audience: AudienceType, prompt: string): void {
	updateSettings({
		customPrompts: {
			...settings.customPrompts,
			[audience]: prompt
		}
	});
}

/**
 * Clear custom prompt for audience
 */
export function clearCustomPrompt(audience: AudienceType): void {
	const { [audience]: _, ...rest } = settings.customPrompts;
	updateSettings({ customPrompts: rest });
}

/**
 * Reset all settings to defaults
 */
export function resetSettings(): void {
	settings = { ...DEFAULT_SETTINGS };
	saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Export settings store for reactive access
 */
export const settingsStore = {
	get current() {
		return settings;
	},
	get initialized() {
		return initialized;
	}
};
