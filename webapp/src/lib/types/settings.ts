/**
 * Story Generator Settings Types
 */

export type AudienceType = 'communications' | 'academic' | 'internal-review' | 'one-pager' | 'course-material';

export const AUDIENCE_LABELS: Record<AudienceType, string> = {
	communications: 'Communications',
	academic: 'Academic',
	'internal-review': 'Internal Review',
	'one-pager': 'One Pager',
	'course-material': 'Course Material'
};

export const AUDIENCE_DESCRIPTIONS: Record<AudienceType, string> = {
	communications: 'General public and media - accessible, impact-focused storytelling',
	academic: 'Scholarly audiences - rigorous, methodology-focused content',
	'internal-review': 'Leadership and review committees - analytical, metrics-driven',
	'one-pager': 'Executive summary - ultra-concise, scannable format',
	'course-material': 'Educational content - tutorials, exercises, and learning materials based on the project'
};

export type GeminiModel = 'gemini-3-flash-preview' | 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite';

export const MODEL_LABELS: Record<GeminiModel, string> = {
	'gemini-3-flash-preview': 'Gemini 3 Flash (Latest)',
	'gemini-2.5-pro': 'Gemini 2.5 Pro',
	'gemini-2.5-flash': 'Gemini 2.5 Flash',
	'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite'
};

export interface StorySettings {
	geminiApiKey: string;
	defaultAudience: AudienceType;
	temperature: number; // 0.0 - 2.0, default 0.7
	maxTokens: number; // default 2048
	model: GeminiModel;
	customPrompts: Partial<Record<AudienceType, string>>;
}

export const DEFAULT_SETTINGS: StorySettings = {
	geminiApiKey: '',
	defaultAudience: 'communications',
	temperature: 0.7,
	maxTokens: 2048,
	model: 'gemini-3-flash-preview',
	customPrompts: {}
};
