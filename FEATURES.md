# Features

## 3D Visualization

- [x] Interactive 3D domain scenes using Three.js/Threlte
  - [x] Life Sciences: DNA double helix with molecular particles
  - [x] Environment & Sustainability: Earth globe with atmospheric effects
  - [x] Social Sciences & Humanities: Social network clusters with data flow
  - [x] Natural Sciences & Engineering: Particle physics simulation
- [x] Floating 3D project cards with logos, hover glow, and click-to-open
- [x] Scroll-based transitions between domain scenes with smooth camera movements
- [x] Hero scene with 2000+ animated particles
- [x] Zoom controls (in/out/reset)

## Search & Discovery

- [x] Search bar for filtering pre-loaded research domain projects
- [x] Full RSD software catalog search via debounced API queries
- [x] RSD project search (separate from software)
- [x] Three result categories: Domain Projects, Software, RSD Projects
- [x] Deduplication of results across local and API sources
- [x] Visual distinction between domain projects (color dot), software (code icon), and projects (book icon)
- [x] Section headers when multiple result types are present
- [x] Keyboard navigation (Arrow keys, Enter, Escape)
- [x] Loading spinner during API search

## Project Modal

- [x] Details tab with logo, brand name, short statement, and full description
- [x] DOI badge display
- [x] Metadata grid (status, source, created, updated)
- [x] Links to RSD page and get-started URL
- [x] "Software" badge for items from the general software catalog
- [x] Domain color indicators
- [x] Escape key / backdrop click to close with body scroll lock

## AI Story Generator

- [x] Generate narratives using Google Gemini API with streaming responses
- [x] Audience types:
  - [x] Communications (general public, 800-1200 words)
  - [x] Academic (scholarly, 1500-2000 words)
  - [x] Internal Review (leadership, 1000-1500 words)
  - [x] One Pager (executive summary, <300 words)
  - [x] Course Material (educational, 2000-3000 words)
  - [x] Blog Post (eScience Center Medium style, 800-1200 words)
- [x] Custom Story mode for user-defined topics with URL references
- [x] Live markdown rendering during streaming
- [x] Custom prompt overrides per audience type

## Context Enrichment

- [x] Fetch and select related software from the RSD API
- [x] Bulk actions for software selection (Select All / Clear)
- [x] File upload (drag-and-drop PDF or text) for supplementary documentation
- [x] URL references input for custom stories

## Story Export

- [x] Download as Markdown (`.md`) with front-matter metadata
- [x] Generate formatted PDF via print interface
- [x] Copy to clipboard with visual confirmation
- [x] Sanitized filenames with audience label and timestamp

## Settings

- [x] Google Gemini API key management (stored in localStorage, show/hide toggle)
- [x] Model selection (Gemini 3 Flash Preview, 2.5 Pro, 2.5 Flash, 2.5 Flash Lite)
- [x] Temperature control (0.0 - 2.0)
- [x] Max tokens configuration (100 - 8192)
- [x] Default audience selector
- [x] Custom prompt editor per audience with reset to defaults
- [x] localStorage persistence with schema versioning

## UI & Accessibility

- [x] Glassmorphism design with dark theme and backdrop blur
- [x] Scroll progress bar and section navigation dots
- [x] Floating action button for custom story mode
- [x] Animated background shapes (scroll-responsive)
- [x] Keyboard navigation and focus management throughout
- [x] ARIA labels, roles, and screen reader support
- [x] Responsive design (mobile-first)

## Planned

- [ ] Training guide for data storytelling in RSE
- [ ] Story generation quality metrics (structure, factual accuracy, engagement)
- [ ] Use case application for eScience evaluation projects
