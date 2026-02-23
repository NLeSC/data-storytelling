/**
 * Extended RSD API for fetching related software
 */

import type { RelatedSoftware } from '$lib/types/story';
import type { Project } from '$lib/types/project';

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
 * Normalize a raw software API response into a safe Project object.
 * The RSD API can return null for fields like description and short_statement.
 */
function normalizeSoftware(raw: Record<string, unknown>): Project {
	return {
		id: raw.id as string,
		slug: raw.slug as string,
		brand_name: raw.brand_name as string,
		short_statement: (raw.short_statement as string) ?? '',
		description: (raw.description as string) ?? '',
		concept_doi: (raw.concept_doi as string) ?? null,
		description_url: (raw.description_url as string) ?? null,
		description_type: (raw.description_type as string) ?? 'markdown',
		get_started_url: (raw.get_started_url as string) ?? '',
		is_published: (raw.is_published as boolean) ?? true,
		created_at: raw.created_at as string,
		updated_at: raw.updated_at as string,
		image_id: (raw.image_id as string) ?? null,
		closed_source: (raw.closed_source as boolean) ?? false
	};
}

/**
 * Search for software returning full Project-compatible objects.
 * Searches both brand_name and short_statement fields.
 */
export async function searchSoftwareFull(query: string, limit = 10): Promise<Project[]> {
	try {
		const encodedQuery = encodeURIComponent(`%${query}%`);
		const url = `${API_BASE}/software?or=(brand_name.ilike.${encodedQuery},short_statement.ilike.${encodedQuery})&is_published=eq.true&limit=${limit}`;

		const response = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			console.error('Failed to search software');
			return [];
		}

		const raw = (await response.json()) as Record<string, unknown>[];
		return raw.map(normalizeSoftware);
	} catch (error) {
		console.error('Error searching software:', error);
		return [];
	}
}

/**
 * RSD project API response shape (differs from software)
 */
interface RsdProjectRaw {
	id: string;
	slug: string;
	title: string;
	subtitle: string | null;
	description: string;
	grant_id: string | null;
	is_published: boolean;
	created_at: string;
	updated_at: string;
	image_id: string | null;
	date_start: string | null;
	date_end: string | null;
}

/**
 * Search RSD projects and map to Project-compatible objects.
 * Searches both title and description fields.
 */
export async function searchRsdProjects(query: string, limit = 10): Promise<Project[]> {
	try {
		const encodedQuery = encodeURIComponent(`%${query}%`);
		const url = `${API_BASE}/project?or=(title.ilike.${encodedQuery},subtitle.ilike.${encodedQuery})&is_published=eq.true&limit=${limit}`;

		const response = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			console.error('Failed to search RSD projects');
			return [];
		}

		const raw = (await response.json()) as RsdProjectRaw[];
		return raw.map((p) => ({
			id: p.id,
			slug: p.slug,
			brand_name: p.title,
			short_statement: p.subtitle ?? '',
			description: p.description ?? '',
			concept_doi: null,
			description_url: null,
			description_type: 'markdown',
			get_started_url: '',
			is_published: p.is_published,
			created_at: p.created_at,
			updated_at: p.updated_at,
			image_id: p.image_id,
			closed_source: false
		}));
	} catch (error) {
		console.error('Error searching RSD projects:', error);
		return [];
	}
}

/**
 * Enriched metadata from the RSD API for story generation context
 */
export interface EnrichedMetadata {
	team: {
		given_names: string;
		family_names: string;
		role: string | null;
		affiliation: string | null;
		orcid: string | null;
		is_contact_person: boolean;
	}[];
	keywords: string[];
	urls: { title: string; url: string }[];
	mentions: {
		title: string;
		doi: string | null;
		authors: string | null;
		journal: string | null;
		publication_year: number | null;
		mention_type: string;
	}[];
	licenses: { name: string; license: string; open_source: boolean }[];
	packages: { url: string; package_manager: string; download_count: number | null }[];
	researchDomains: { name: string; key: string }[];
}

const EMPTY_METADATA: EnrichedMetadata = {
	team: [],
	keywords: [],
	urls: [],
	mentions: [],
	licenses: [],
	packages: [],
	researchDomains: []
};

async function fetchJson<T>(url: string): Promise<T[]> {
	const response = await fetch(url, { headers: { Accept: 'application/json' } });
	if (!response.ok) return [];
	return (await response.json()) as T[];
}

/**
 * Fetch keywords from junction table → keyword table
 */
async function fetchKeywords(
	id: string,
	type: 'software' | 'rsd-project'
): Promise<string[]> {
	const junctionTable = type === 'software' ? 'keyword_for_software' : 'keyword_for_project';
	const fkColumn = type === 'software' ? 'software' : 'project';
	const junctions = await fetchJson<{ keyword: string }>(
		`${API_BASE}/${junctionTable}?${fkColumn}=eq.${id}`
	);
	if (junctions.length === 0) return [];

	const keywordIds = junctions.map((j) => j.keyword).join(',');
	const keywords = await fetchJson<{ value: string }>(
		`${API_BASE}/keyword?id=in.(${keywordIds})`
	);
	return keywords.map((k) => k.value);
}

/**
 * Fetch mentions from junction table → mention table
 */
async function fetchMentions(
	id: string,
	junctionTable: string,
	fkColumn: string
): Promise<EnrichedMetadata['mentions']> {
	const junctions = await fetchJson<{ mention: string }>(
		`${API_BASE}/${junctionTable}?${fkColumn}=eq.${id}`
	);
	if (junctions.length === 0) return [];

	const mentionIds = junctions.map((j) => j.mention).join(',');
	return fetchJson<EnrichedMetadata['mentions'][number]>(
		`${API_BASE}/mention?id=in.(${mentionIds})&select=title,doi,authors,journal,publication_year,mention_type`
	);
}

/**
 * Fetch research domains from junction table → research_domain table
 */
async function fetchResearchDomains(projectId: string): Promise<EnrichedMetadata['researchDomains']> {
	const junctions = await fetchJson<{ research_domain: string }>(
		`${API_BASE}/research_domain_for_project?project=eq.${projectId}`
	);
	if (junctions.length === 0) return [];

	const domainIds = junctions.map((j) => j.research_domain).join(',');
	return fetchJson<{ name: string; key: string }>(
		`${API_BASE}/research_domain?id=in.(${domainIds})&select=name,key`
	);
}

/**
 * Fetch all enriched metadata for a software item or project.
 * All sub-fetches run in parallel. Failed fetches return empty arrays.
 */
export async function fetchEnrichedMetadata(
	id: string,
	type: 'software' | 'rsd-project'
): Promise<EnrichedMetadata> {
	try {
		if (type === 'software') {
			const [team, keywords, licenses, mentions, packages] = await Promise.all([
				fetchJson<EnrichedMetadata['team'][number]>(
					`${API_BASE}/contributor?software=eq.${id}&select=given_names,family_names,role,affiliation,orcid,is_contact_person`
				),
				fetchKeywords(id, 'software'),
				fetchJson<EnrichedMetadata['licenses'][number]>(
					`${API_BASE}/license_for_software?software=eq.${id}&select=name,license,open_source`
				),
				fetchMentions(id, 'mention_for_software', 'software'),
				fetchJson<EnrichedMetadata['packages'][number]>(
					`${API_BASE}/package_manager?software=eq.${id}&select=url,package_manager,download_count`
				)
			]);
			return { team, keywords, urls: [], mentions, licenses, packages, researchDomains: [] };
		} else {
			const [team, keywords, urls, outputMentions, impactMentions, researchDomains] =
				await Promise.all([
					fetchJson<EnrichedMetadata['team'][number]>(
						`${API_BASE}/team_member?project=eq.${id}&select=given_names,family_names,role,affiliation,orcid,is_contact_person`
					),
					fetchKeywords(id, 'rsd-project'),
					fetchJson<{ title: string; url: string }>(
						`${API_BASE}/url_for_project?project=eq.${id}&select=title,url`
					),
					fetchMentions(id, 'output_for_project', 'project'),
					fetchMentions(id, 'impact_for_project', 'project'),
					fetchResearchDomains(id)
				]);
			// Deduplicate output + impact mentions by title
			const seenTitles = new Set<string>();
			const allMentions = [...outputMentions, ...impactMentions].filter((m) => {
				if (seenTitles.has(m.title)) return false;
				seenTitles.add(m.title);
				return true;
			});
			return { team, keywords, urls, mentions: allMentions, licenses: [], packages: [], researchDomains };
		}
	} catch (error) {
		console.error('Error fetching enriched metadata:', error);
		return { ...EMPTY_METADATA };
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
