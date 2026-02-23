/**
 * Research Software Directory API Service
 */

import type {
	Project,
	SoftwareForOrganisation,
	ProjectWithDomain,
	ResearchDomain
} from '$lib/types/project';
import { RESEARCH_DOMAINS } from '$lib/types/project';

const API_BASE = 'https://research-software-directory.org/api/v1';

/**
 * Fetch software IDs for a given organisation
 */
async function fetchSoftwareForOrganisation(
	organisationId: string
): Promise<SoftwareForOrganisation[]> {
	const url = `${API_BASE}/software_for_organisation?organisation=eq.${organisationId}&status=eq.approved`;
	const response = await fetch(url, {
		headers: { Accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch software for organisation ${organisationId}`);
	}

	return response.json();
}

/**
 * Fetch full project details by ID
 */
async function fetchProjectById(projectId: string): Promise<Project | null> {
	const url = `${API_BASE}/software?id=eq.${projectId}`;
	const response = await fetch(url, {
		headers: { Accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch project ${projectId}`);
	}

	const projects = await response.json();
	const raw = projects[0];
	if (!raw) return null;
	return {
		...raw,
		description: raw.description ?? '',
		short_statement: raw.short_statement ?? '',
		get_started_url: raw.get_started_url ?? ''
	};
}

/**
 * Fetch all projects for a specific research domain
 */
export async function fetchProjectsForDomain(domain: ResearchDomain): Promise<ProjectWithDomain[]> {
	try {
		// 1. Get software IDs for this organisation
		const softwareRelations = await fetchSoftwareForOrganisation(domain.id);

		// 2. Fetch full details for each project
		const projectPromises = softwareRelations.map(async (relation) => {
			const project = await fetchProjectById(relation.software);
			if (project) {
				return {
					...project,
					domain
				} as ProjectWithDomain;
			}
			return null;
		});

		const projects = await Promise.all(projectPromises);

		// 3. Filter out nulls and return
		return projects.filter((p): p is ProjectWithDomain => p !== null);
	} catch (error) {
		console.error(`Error fetching projects for domain ${domain.name}:`, error);
		return [];
	}
}

/**
 * Fetch all projects from all research domains
 * Deduplicates projects that appear in multiple domains (keeps first occurrence)
 */
export async function fetchAllProjects(): Promise<ProjectWithDomain[]> {
	try {
		const domainPromises = RESEARCH_DOMAINS.map((domain) => fetchProjectsForDomain(domain));
		const projectsByDomain = await Promise.all(domainPromises);

		// Flatten array of arrays
		const allProjects = projectsByDomain.flat();

		// Deduplicate by project ID (keep first occurrence)
		const uniqueProjects = new Map<string, ProjectWithDomain>();
		allProjects.forEach((project) => {
			if (!uniqueProjects.has(project.id)) {
				uniqueProjects.set(project.id, project);
			}
		});

		return Array.from(uniqueProjects.values());
	} catch (error) {
		console.error('Error fetching all projects:', error);
		return [];
	}
}

/**
 * Fetch projects in batches to avoid rate limiting
 * Deduplicates projects that appear in multiple domains (keeps first occurrence)
 */
export async function fetchAllProjectsBatched(batchSize = 50): Promise<ProjectWithDomain[]> {
	const allProjects: ProjectWithDomain[] = [];
	const seenProjectIds = new Set<string>();

	for (const domain of RESEARCH_DOMAINS) {
		try {
			const softwareRelations = await fetchSoftwareForOrganisation(domain.id);

			// Process in batches
			for (let i = 0; i < softwareRelations.length; i += batchSize) {
				const batch = softwareRelations.slice(i, i + batchSize);
				const projectPromises = batch.map(async (relation) => {
					// Skip if we've already seen this project
					if (seenProjectIds.has(relation.software)) {
						return null;
					}

					const project = await fetchProjectById(relation.software);
					if (project) {
						seenProjectIds.add(project.id);
						return {
							...project,
							domain
						} as ProjectWithDomain;
					}
					return null;
				});

				const batchProjects = await Promise.all(projectPromises);
				const validProjects = batchProjects.filter((p): p is ProjectWithDomain => p !== null);
				allProjects.push(...validProjects);

				// Small delay between batches to avoid rate limiting
				if (i + batchSize < softwareRelations.length) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			}
		} catch (error) {
			console.error(`Error fetching projects for domain ${domain.name}:`, error);
		}
	}

	return allProjects;
}
