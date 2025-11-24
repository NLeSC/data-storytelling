/**
 * Research Software Directory API Types
 */

export interface Project {
	id: string;
	slug: string;
	brand_name: string;
	concept_doi: string | null;
	description: string;
	description_url: string | null;
	description_type: string;
	get_started_url: string;
	is_published: boolean;
	short_statement: string;
	created_at: string;
	updated_at: string;
	image_id: string | null;
	closed_source: boolean;
}

export interface SoftwareForOrganisation {
	software: string; // Project ID
	organisation: string; // Organisation ID
	status: 'approved' | 'pending' | 'rejected';
	is_featured: boolean;
	position: number;
}

export interface ResearchDomain {
	id: string;
	name: string;
	slug: string;
	color: string; // Primary color for this domain
	position: { x: number; y: number; z: number }; // Base position in 3D space
}

export interface ProjectWithDomain extends Project {
	domain: ResearchDomain;
}

export const RESEARCH_DOMAINS: ResearchDomain[] = [
	{
		id: 'd6a77b80-6965-4ffa-af18-ddb6668f73dd',
		name: 'Environmental Sustainability',
		slug: 'environment-sustainability',
		color: '#7bafd4', // Blue
		position: { x: -30, y: 0, z: -30 }
	},
	{
		id: '11d3773b-3c78-4cdc-8823-a7392e0a9fe3',
		name: 'Life Sciences',
		slug: 'life-sciences',
		color: '#f4b841', // Yellow/Gold
		position: { x: 30, y: 0, z: -30 }
	},
	{
		id: '13d1a859-4c9e-48f7-bf3e-8040799300e0',
		name: 'Social Sciences & Humanities',
		slug: 'social-sciences-humanities',
		color: '#3b1f54', // Purple
		position: { x: -30, y: 0, z: 30 }
	},
	{
		id: '4765c998-2cb1-4f93-b8c7-76212e6d05aa',
		name: 'Natural Sciences & Engineering',
		slug: 'natural-sciences-engineering',
		color: '#e08f62', // Orange
		position: { x: 30, y: 0, z: 30 }
	}
];

/**
 * Get image URL for a project
 */
export function getProjectImageUrl(imageId: string | null): string | null {
	if (!imageId) return null;
	return `https://research-software-directory.org/image/rpc/get_image?uid=${imageId}`;
}

/**
 * Get project page URL
 */
export function getProjectPageUrl(slug: string): string {
	return `https://research-software-directory.org/software/${slug}`;
}
