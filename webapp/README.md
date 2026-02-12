# Data Storytelling Web Application

An interactive 3D visualization platform for exploring research software projects from the Netherlands eScience Center, featuring AI-powered story generation for multiple audiences.

## Features

See the full [feature list](../FEATURES.md) for all implemented and planned features.

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
