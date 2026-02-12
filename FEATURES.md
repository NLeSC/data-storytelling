# Features

## 3D Visualization

- [x] Interactive 3D domain scenes using Three.js/Threlte
  - [x] Life Sciences: DNA double helix with molecular particles
  - [x] Environment & Sustainability: Earth globe with atmospheric effects
  - [x] Social Sciences & Humanities: Social network clusters with data flow
  - [x] Natural Sciences & Engineering: Particle physics simulation
- [x] Floating 3D project cards with logos, hover glow, and click-to-open
- [x] Scroll-based transitions between domain scenes with smooth camera movements

## Search & Discovery

- [x] Search bar for filtering pre-loaded research domain projects
- [x] Full RSD software catalog search via debounced API queries
- [x] Deduplication of results across local and API sources
- [x] Visual distinction between domain projects (color dot) and general software (code icon)
- [x] Section headers ("Projects" / "Software") when both result types are present
- [x] Loading spinner during API search

## Project Modal

- [x] Details tab with logo, brand name, short statement, and full description
- [x] DOI badge display
- [x] Metadata grid (status, source, created, updated)
- [x] Links to RSD page and get-started URL
- [x] "Software" badge for items from the general software catalog

## AI Story Generator

- [x] Generate narratives using Google Gemini API with streaming responses
- [x] Audience types:
  - [x] Communications (general public, 800-1200 words)
  - [x] Academic (scholarly, 1500-2000 words)
  - [x] Internal Review (leadership, 1000-1500 words)
  - [x] One Pager (executive summary, <300 words)
- [x] Custom Story mode for user-defined topics

## Context Enrichment

- [x] Fetch and select related software from the RSD API
- [x] File upload (drag-and-drop PDF or text) for supplementary documentation

## Story Export

- [x] Download as Markdown (`.md`)
- [x] Generate formatted PDF
- [x] Copy to clipboard

## Settings

- [x] Google Gemini API key management (stored in localStorage)
- [x] Model selection (Gemini 3 Flash Preview, 2.5 Flash, 2.0 Flash, 1.5 Pro)
- [x] Temperature control (0.0 - 2.0)
- [x] Max tokens configuration
- [x] Custom prompt overrides per audience type

## Planned

- [ ] Training guide for data storytelling in RSE
- [ ] Story generation quality metrics (structure, factual accuracy, engagement)
- [ ] Use case application for eScience evaluation projects
