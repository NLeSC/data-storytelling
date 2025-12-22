/**
 * Extended RSD API for fetching related software
 */

import type { RelatedSoftware } from '$lib/types/story';

const API_BASE = 'https://research-software-directory.org/api/v1';

/**
 * Fetch related software for a given software item
 * Uses the software_for_software endpoint to find relationships
 */
export async function fetchRelatedSoftware(softwareId: string): Promise<RelatedSoftware[]> {
	try {
		// Get related software IDs (where this software is the origin)
		const relationsUrl = `${API_BASE}/software_for_software?origin=eq.${softwareId}`;
		const relationsResponse = await fetch(relationsUrl, {
			headers: { Accept: 'application/json' }
		});

		if (!relationsResponse.ok) {
			console.error('Failed to fetch software relations');
			return [];
		}

		const relations = (await relationsResponse.json()) as Array<{ relation: string }>;

		if (relations.length === 0) {
			return [];
		}

		// Fetch full details for each related software
		const softwarePromises = relations.map(async (rel) => {
			const softwareUrl = `${API_BASE}/software?id=eq.${rel.relation}&select=id,slug,brand_name,short_statement,description,image_id`;
			const response = await fetch(softwareUrl, {
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) return null;

			const data = (await response.json()) as RelatedSoftware[];
			return data[0] || null;
		});

		const results = await Promise.all(softwarePromises);
		return results.filter((s): s is RelatedSoftware => s !== null);
	} catch (error) {
		console.error('Error fetching related software:', error);
		return [];
	}
}

/**
 * Fetch software in the same organisation
 * Useful for finding related projects from the same research domain
 */
export async function fetchSoftwareInOrganisation(
	organisationId: string,
	excludeSoftwareId?: string,
	limit = 20
): Promise<RelatedSoftware[]> {
	try {
		const url = `${API_BASE}/software_for_organisation?organisation=eq.${organisationId}&status=eq.approved`;
		const response = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			console.error('Failed to fetch organisation software');
			return [];
		}

		const relations = (await response.json()) as Array<{ software: string }>;

		// Filter out the current software and limit results
		const filteredRelations = relations
			.filter((rel) => rel.software !== excludeSoftwareId)
			.slice(0, limit);

		if (filteredRelations.length === 0) {
			return [];
		}

		// Fetch details for each software
		const softwarePromises = filteredRelations.map(async (rel) => {
			const softwareUrl = `${API_BASE}/software?id=eq.${rel.software}&select=id,slug,brand_name,short_statement,description,image_id`;
			const response = await fetch(softwareUrl, {
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) return null;

			const data = (await response.json()) as RelatedSoftware[];
			return data[0] || null;
		});

		const results = await Promise.all(softwarePromises);
		return results.filter((s): s is RelatedSoftware => s !== null);
	} catch (error) {
		console.error('Error fetching organisation software:', error);
		return [];
	}
}

/**
 * Search for software by keywords
 */
export async function searchSoftware(query: string, limit = 10): Promise<RelatedSoftware[]> {
	try {
		// Use ilike for case-insensitive partial matching on brand_name
		const encodedQuery = encodeURIComponent(`%${query}%`);
		const url = `${API_BASE}/software?brand_name=ilike.${encodedQuery}&is_published=eq.true&select=id,slug,brand_name,short_statement,description,image_id&limit=${limit}`;

		const response = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			console.error('Failed to search software');
			return [];
		}

		return (await response.json()) as RelatedSoftware[];
	} catch (error) {
		console.error('Error searching software:', error);
		return [];
	}
}

/**
 * Fetch a single software item by ID
 */
export async function fetchSoftwareById(softwareId: string): Promise<RelatedSoftware | null> {
	try {
		const url = `${API_BASE}/software?id=eq.${softwareId}&select=id,slug,brand_name,short_statement,description,image_id`;
		const response = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as RelatedSoftware[];
		return data[0] || null;
	} catch (error) {
		console.error('Error fetching software by ID:', error);
		return null;
	}
}
