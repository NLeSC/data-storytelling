/**
 * Story Generator Settings Types
 */

export type LLMProvider = 'gemini' | 'local';

export type AudienceType =
	| 'communications'
	| 'academic'
	| 'internal-review'
	| 'one-pager'
	| 'course-material'
	| 'blog-post';

export const AUDIENCE_LABELS: Record<AudienceType, string> = {
	communications: 'Communications',
	academic: 'Academic',
	'internal-review': 'Internal Review',
	'one-pager': 'One Pager',
	'course-material': 'Course Material',
	'blog-post': 'Blog Post'
};

export const AUDIENCE_DESCRIPTIONS: Record<AudienceType, string> = {
	communications: 'General public and media - accessible, impact-focused storytelling',
	academic: 'Scholarly audiences - rigorous, methodology-focused content',
	'internal-review': 'Leadership and review committees - analytical, metrics-driven',
	'one-pager': 'Executive summary - ultra-concise, scannable format',
	'course-material':
		'Educational content - tutorials, exercises, and learning materials based on the project',
	'blog-post':
		'eScience Center blog style - accessible, community-focused, impact-driven storytelling'
};

export type GeminiModel =
	| 'gemini-3-pro-preview'
	| 'gemini-3-flash-preview'
	| 'gemini-2.5-pro'
	| 'gemini-2.5-flash'
	| 'gemini-2.5-flash-lite';

export const MODEL_LABELS: Record<GeminiModel, string> = {
	'gemini-3-pro-preview': 'Gemini 3 Pro (Latest)',
	'gemini-3-flash-preview': 'Gemini 3 Flash',
	'gemini-2.5-pro': 'Gemini 2.5 Pro',
	'gemini-2.5-flash': 'Gemini 2.5 Flash',
	'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite'
};

export type LocalModelId =
	| 'SmolLM2-1.7B-Instruct-q4f16_1-MLC'
	| 'Qwen3-1.7B-q4f16_1-MLC'
	| 'Qwen3-4B-q4f16_1-MLC'
	| 'Phi-3.5-mini-instruct-q4f16_1-MLC';

export const LOCAL_MODELS: LocalModelId[] = [
	'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
	'Qwen3-1.7B-q4f16_1-MLC',
	'Qwen3-4B-q4f16_1-MLC',
	'Phi-3.5-mini-instruct-q4f16_1-MLC'
];

export const LOCAL_MODEL_INFO: Record<LocalModelId, { label: string; size: string }> = {
	'SmolLM2-1.7B-Instruct-q4f16_1-MLC': { label: 'SmolLM2 1.7B', size: '~1.0 GB' },
	'Qwen3-1.7B-q4f16_1-MLC': { label: 'Qwen3 1.7B', size: '~1.1 GB' },
	'Qwen3-4B-q4f16_1-MLC': { label: 'Qwen3 4B', size: '~2.5 GB' },
	'Phi-3.5-mini-instruct-q4f16_1-MLC': { label: 'Phi 3.5 Mini', size: '~2.2 GB' }
};

export interface StorySettings {
	provider: LLMProvider;
	geminiApiKey: string;
	defaultAudience: AudienceType;
	temperature: number; // 0.0 - 2.0, default 0.7
	maxTokens: number; // default 2048
	model: GeminiModel;
	localModel: LocalModelId;
	customPrompts: Partial<Record<AudienceType, string>>;
}

export const DEFAULT_SETTINGS: StorySettings = {
	provider: 'local',
	geminiApiKey: '',
	defaultAudience: 'communications',
	temperature: 0.7,
	maxTokens: 8192,
	model: 'gemini-3-flash-preview',
	localModel: 'Qwen3-1.7B-q4f16_1-MLC',
	customPrompts: {}
};
