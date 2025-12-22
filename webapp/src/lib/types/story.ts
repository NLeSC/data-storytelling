/**
 * Story Generator Types
 */

import type { AudienceType } from './settings';

export interface RelatedSoftware {
	id: string;
	slug: string;
	brand_name: string;
	short_statement: string | null;
	description: string;
	image_id: string | null;
}

export interface UploadedFile {
	id: string;
	name: string;
	type: 'pdf' | 'text';
	extractedText: string;
	size: number;
}

export interface GeneratedStory {
	id: string;
	projectId: string;
	projectName: string;
	audience: AudienceType;
	content: string;
	generatedAt: string; // ISO timestamp
	contextSummary: {
		includedSoftwareIds: string[];
		uploadedFileNames: string[];
	};
}

export interface StoryGenerationRequest {
	project: {
		id: string;
		brand_name: string;
		description: string;
		short_statement: string | null;
		concept_doi: string | null;
		get_started_url: string | null;
	};
	audience: AudienceType;
	relatedSoftware: RelatedSoftware[];
	additionalContext: string; // from uploaded files
}

export interface StoryGenerationState {
	isGenerating: boolean;
	error: string | null;
	currentStory: string;
	streamedContent: string;
}

export interface StoredStories {
	version: number;
	stories: Record<string, GeneratedStory[]>;
}

export const STORAGE_KEYS = {
	SETTINGS: 'data-storytelling-settings',
	STORIES: 'data-storytelling-stories'
} as const;
