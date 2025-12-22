# Data Storytelling Web Application

An interactive 3D visualization platform for exploring research software projects from the Netherlands eScience Center, featuring AI-powered story generation for multiple audiences.

## Features

### 3D Project Exploration

- **Interactive 3D Scenes**: Four domain-specific visualizations using Three.js/Threlte:
  - **Life Sciences**: DNA double helix with molecular particles
  - **Environment & Sustainability**: Earth globe with atmospheric effects
  - **Social Sciences & Humanities**: Social network clusters with data flow
  - **Natural Sciences & Engineering**: Particle physics simulation

- **Project Cards**: Floating 3D cards displaying project logos that:
  - Rotate and float with gentle animations
  - Glow and scale on hover for better discoverability
  - Click to open detailed project modal

- **Dynamic Navigation**: Scroll-based transitions between domain scenes with smooth camera movements

### Project Modal

- **Details Tab**: Complete project information including:
  - Project logo and brand name
  - Short statement and full description
  - Technologies used
  - Links to RSD, repository, and project website

- **Story Generator Tab**: AI-powered narrative generation (see below)

### AI Story Generator

Generate compelling narratives about research software projects using Google Gemini API.

#### Audience Types

| Audience | Description | Output |
|----------|-------------|--------|
| **Communications** | General public and media | Accessible, impact-focused storytelling (800-1200 words) |
| **Academic** | Scholarly audiences | Rigorous, methodology-focused content (1500-2000 words) |
| **Internal Review** | Leadership and committees | Analytical, metrics-driven assessment (1000-1500 words) |
| **One Pager** | Executive summary | Ultra-concise, scannable format (<300 words) |

#### Context Enrichment

- **Related Software**: Fetch and select related software from the Research Software Directory API to provide additional context
- **File Upload**: Drag-and-drop PDF or text files to include supplementary documentation

#### Story Export

- **Markdown**: Download as `.md` file for further editing
- **PDF**: Generate formatted PDF documents
- **Copy**: Quick copy to clipboard

### Settings Panel

Configure the AI story generator via the settings panel (gear icon):

- **API Key**: Google Gemini API key (stored in localStorage)
- **Model Selection**: Choose from available Gemini models:
  - Gemini 3 Flash Preview (Latest)
  - Gemini 2.5 Flash
  - Gemini 2.0 Flash
  - Gemini 1.5 Pro
- **Temperature**: Control creativity (0.0 - 2.0)
- **Max Tokens**: Limit response length
- **Custom Prompts**: Override default prompts per audience type

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Svelte 5 runes
- **3D Graphics**: [Threlte](https://threlte.xyz/) (Three.js for Svelte)
- **Styling**: TailwindCSS with glassmorphism design
- **AI**: Google Gemini API with streaming responses
- **Data Source**: [Research Software Directory](https://research-software-directory.org/) REST API

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime (recommended) or Node.js 18+
- Google Gemini API key (for story generation)

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Configuration

1. Click the gear icon in the navigation header
2. Enter your Google Gemini API key
3. Adjust model and generation settings as needed

Get a Gemini API key at: https://aistudio.google.com/apikey


## Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  RSD API        │────▶│  Project Data    │────▶│  3D Scene       │
│  (Projects)     │     │  (ProjectWithDomain)   │  (Threlte)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  Project Modal   │
                        │  ├─ Details Tab  │
                        │  └─ Story Tab    │
                        └──────────────────┘
                                │
                                ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Related        │────▶│  Story Generator │────▶│  Gemini API     │
│  Software       │     │  (Context)       │     │  (Streaming)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  Generated Story │
                        │  (MD/PDF Export) │
                        └──────────────────┘
```

## Security Notes

- API keys are stored in browser localStorage (client-side only)
- No server-side processing - all API calls made directly from browser
- Consider using environment variables for production deployments

## License

Apache 2.0 - See the [main repository](../) for full license details.
