# Project Gallery Implementation

## Overview

A 3D interactive gallery displaying 193 research software projects from the Netherlands eScience Center, organized by research domain and rendered as floating cards in 3D space using Three.js and Threlte.

## Features

### 3D Visualization
- **193 project cards** distributed in 3D space
- **4 research domains** each with their own color-coded cluster:
  - Environmental Sustainability (Blue) - 37 projects
  - Life Sciences (Gold) - 41 projects
  - Social Sciences & Humanities (Purple) - 50 projects
  - Natural Sciences & Engineering (Orange) - 65 projects

### Animations
- Cards float gently with sine-wave vertical movement
- Each card has a unique rotation animation
- Smooth hover effects with scale transitions
- Domain marker spheres at cluster centers

### Interactions
- **Drag to rotate** - OrbitControls for camera movement
- **Scroll to zoom** - Zoom in/out of the 3D space
- **Click cards** - Opens detailed modal with full project info
- **Hover cards** - Shows project preview tooltip

### Filtering & Search
- **Domain filters** - View projects from specific domains
- **Search bar** - Filter projects by name or description
- **Reset button** - Return to default view
- **Statistics display** - Shows project counts

### Project Details Modal
- Full project name and logo
- Short statement and description
- DOI badge (when available)
- Metadata (publication status, source type, dates)
- Action buttons:
  - Get Started (repository/documentation link)
  - View on Research Software Directory

## File Structure

```
webapp/src/
├── lib/
│   ├── api/
│   │   └── projects.ts                    # API service for fetching projects
│   ├── types/
│   │   └── project.ts                     # TypeScript types & constants
│   └── components/
│       ├── ProjectGallery.svelte          # Main gallery component
│       ├── ProjectModal.svelte            # Project details modal
│       └── threlte/
│           ├── ProjectCard.svelte         # Individual 3D card component
│           └── ProjectGalleryScene.svelte # 3D scene setup
└── routes/
    └── +page.svelte                       # Main page (includes gallery section)
```

## API Integration

### Research Software Directory API
- **Base URL**: `https://research-software-directory.org/api/v1`
- **Endpoints used**:
  - `/software_for_organisation` - Get project IDs for each domain
  - `/software?id=eq.{id}` - Get full project details
  - `/image/rpc/get_image?uid={uid}` - Get project logos

### Organization IDs
```javascript
{
  'Environmental': 'd6a77b80-6965-4ffa-af18-ddb6668f73dd',
  'Life Sciences': '11d3773b-3c78-4cdc-8823-a7392e0a9fe3',
  'SSH': '13d1a859-4c9e-48f7-bf3e-8040799300e0',
  'Engineering': '4765c998-2cb1-4f93-b8c7-76212e6d05aa'
}
```

## Card Positioning Algorithm

Projects are distributed in circular clusters around each domain's base position:

```javascript
// Radius grows with number of projects in domain
const radius = 5 + Math.sqrt(totalInDomain) * 2;

// Distribute evenly in circle
const angle = (index / totalInDomain) * Math.PI * 2;

// Vary height for visual interest
const heightVariation = Math.sin(index * 0.5) * 3;

// Add randomness to break perfect patterns
const randomOffset = (Math.random() - 0.5) * 2;
```

## Performance Considerations

### Loading Strategy
- All 193 projects loaded at once (no pagination)
- Async batch loading to avoid rate limiting
- 100ms delay between batches
- Loading spinner during data fetch

### 3D Rendering
- Box geometry for cards (low poly count)
- Texture loading for logos (cached by browser)
- OrbitControls with damping for smooth movement
- Conditional rendering (domain filtering)

### Optimization Opportunities
- [ ] Implement LOD (Level of Detail) for distant cards
- [ ] Use instanced meshes if card count increases
- [ ] Add frustum culling for off-screen cards
- [ ] Lazy load textures when cards come into view

## Usage

### Navigate to Gallery
1. Run `bun dev` to start the development server
2. Navigate to the homepage
3. Scroll down to the "Project Gallery" section
4. Or click "Project Gallery" in the navigation

### Explore Projects
1. Use mouse to drag and rotate the 3D view
2. Scroll to zoom in/out
3. Hover over cards to see project previews
4. Click cards to open detailed information
5. Use domain filters to focus on specific research areas
6. Search for projects by name or keywords

## Technologies Used

- **Svelte 5** - Component framework with runes
- **SvelteKit** - Application framework
- **Three.js** - 3D graphics library
- **Threlte** - Svelte wrapper for Three.js
- **@threlte/core** - Core Threlte functionality
- **@threlte/extras** - Additional Threlte components (OrbitControls, Text, HTML)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Future Enhancements

### Features
- [ ] Add project tags/keywords filtering
- [ ] Implement timeline view (sort by creation date)
- [ ] Add project relationships/connections visualization
- [ ] Export/share specific gallery views
- [ ] Add VR/AR mode support

### Data
- [ ] Show contributor information
- [ ] Display project statistics (stars, forks, downloads)
- [ ] Show related projects
- [ ] Add project categories/topics

### Visuals
- [ ] Add particle effects
- [ ] Implement different card layouts (compact, detailed)
- [ ] Add domain transition animations
- [ ] Custom shaders for card materials
- [ ] Add sound effects for interactions

## Troubleshooting

### Cards not appearing
- Check browser console for API errors
- Verify organization IDs are correct
- Ensure project data is being fetched successfully

### Performance issues
- Reduce number of visible cards using domain filters
- Check if too many textures are loading
- Monitor browser DevTools performance tab

### Modal not opening
- Check that onClick handler is properly bound
- Verify project data is complete
- Check z-index conflicts with other elements

## Credits

- **Data Source**: [Research Software Directory](https://research-software-directory.org)
- **Organization**: [Netherlands eScience Center](https://www.esciencecenter.nl)
- **Implementation**: Built with Svelte 5 and Threlte
