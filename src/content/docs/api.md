---
title: API
description: Complete API reference for the Astro Modular theme
category: Astro Modular
order: 2
version: 1.1.0
lastModified: 2025-10-23
image:
imageAlt:
hideCoverImage: false
hideTOC: false
draft: false
featured: true
aliases:
  - api-reference
---
This document provides a complete reference for the Astro Modular theme APIs, utilities, and configuration options.

## Content Collections

### Posts Collection
```typescript
interface PostData {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  draft?: boolean;
  image?: string;
  imageAlt?: string;
  imageOG?: boolean;
  hideCoverImage?: boolean;
  hideTOC?: boolean;
  targetKeyword?: string;
  noIndex?: boolean;
}
```

### Pages Collection
```typescript
interface PageData {
  title: string;
  description: string;
  draft?: boolean;
  lastModified?: Date;
  image?: string;
  imageAlt?: string;
  hideCoverImage?: boolean;
  hideTOC?: boolean;
  noIndex?: boolean;
}
```

### Projects Collection
```typescript
interface ProjectData {
  title: string;
  description: string;
  date: Date;
  categories?: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  status?: string; // Any string value - "completed", "in-progress", "On Hold", etc.
  image?: string;
  imageAlt?: string;
  hideCoverImage?: boolean;
  hideTOC?: boolean;
  draft?: boolean;
  noIndex?: boolean;
  featured?: boolean;
}
```

### Documentation Collection
```typescript
interface DocumentationData {
  title: string;
  description: string;
  category: string;
  order: number;
  lastModified?: Date;
  version?: string;
  image?: string;
  imageAlt?: string;
  hideCoverImage?: boolean;
  hideTOC?: boolean;
  draft?: boolean;
  noIndex?: boolean;
  showTOC?: boolean;
  featured?: boolean;
}
```

### Special Collection
```typescript
interface SpecialData {
  title: string;
  description: string;
  hideTOC?: boolean;
}
```

**Special Pages:**
- `home.md` - Homepage blurb content
- `404.md` - 404 error page content
- `posts.md` - Posts index page (title, description only)
- `projects.md` - Projects index page content
- `docs.md` - Documentation index page content

## Configuration API

### Site Configuration Interface
```typescript
interface SiteConfig {
  // Site Information
  site: string;
  title: string;
  description: string;
  author: string;
  language: string;
  
  // Global Settings
  theme: "minimal" | "oxygen" | "atom" | "ayu" | "catppuccin" | "charcoal" | "dracula" | "everforest" | "flexoki" | "gruvbox" | "macos" | "nord" | "obsidian" | "rose-pine" | "sky" | "solarized" | "things" | "custom";
  customThemeFile?: string;
  availableThemes: "all" | Array<ThemeName>;
  fonts: {
    source: "local" | "cdn";
    families: {
      body: string;
      heading: string;
      mono: string;
    };
    display: "swap" | "fallback" | "optional";
  };
  layout: {
    contentWidth: string;
  };
  tableOfContents: {
    enabled: boolean;
    depth: number;
  };
  footer: {
    enabled: boolean;
    content: string;
    showSocialIconsInFooter: boolean;
  };
  hideScrollBar: boolean;
  scrollToTop: boolean;
  featureButton: "mode" | "graph" | "theme" | "none";
  seo: {
    defaultOgImageAlt: string;
  };
  deployment: {
    platform: "netlify" | "vercel" | "github-pages";
  };
  
  // Command Palette
  commandPalette: {
    enabled: boolean;
    shortcut: string;
    placeholder: string;
    search: {
      posts: boolean;
      pages: boolean;
      projects: boolean;
      docs: boolean;
    };
    sections: {
      quickActions: boolean;
      pages: boolean;
      social: boolean;
    };
    quickActions: {
      enabled: boolean;
      toggleMode: boolean;
      graphView: boolean;
      changeTheme: boolean;
    };
  };
  
  // Profile Picture
  profilePicture: {
    enabled: boolean;
    image: string;
    alt: string;
    size: "sm" | "md" | "lg";
    url?: string;
    placement: "footer" | "header";
    style: "circle" | "square" | "none";
  };
  
  // Navigation
  navigation: {
    showNavigation: boolean;
    style: "minimal" | "traditional";
    showMobileMenu: boolean;
    pages: Array<{ title: string; url: string }>;
    social: Array<{ title: string; url: string; icon: string }>;
  };
  
  // Home Options
  homeOptions: {
    featuredPost: {
      enabled: boolean;
      type: "latest" | "featured";
      slug?: string;
    };
    recentPosts: {
      enabled: boolean;
      count: number;
    };
    projects: {
      enabled: boolean;
      count: number;
    };
    docs: {
      enabled: boolean;
      count: number;
    };
    blurb: {
      placement: "above" | "below" | "none";
    };
  };
  
  // Post Options
  postOptions: {
    postsPerPage: number;
    readingTime: boolean;
    wordCount: boolean;
    tags: boolean;
    linkedMentions: {
      enabled: boolean;
      linkedMentionsCompact: boolean;
    };
    graphView: {
      enabled: boolean;
      showInSidebar: boolean;
      showInCommandPalette: boolean;
      maxNodes: number;
      showOrphanedPosts: boolean;
    };
    postNavigation: boolean;
    showPostCardCoverImages: "all" | "featured" | "home" | "posts" | "featured-and-posts" | "none";
    postCardAspectRatio: AspectRatio;
    customPostCardAspectRatio?: string;
    comments: {
      enabled: boolean;
      provider: string;
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      mapping: string;
      strict: string;
      reactions: string;
      metadata: string;
      inputPosition: string;
      theme: string;
      lang: string;
      loading: string;
    };
  };
  
  // Optional Content Types
  optionalContentTypes: {
    projects: boolean;
    docs: boolean;
  };
}
```

### Aspect Ratio Types
```typescript
type AspectRatio = 
  | "16:9" 
  | "4:3"
  | "3:2"
  | "og"
  | "square"
  | "golden"
  | "custom";
```

## Utility Functions

### SEO Generation
```typescript
// Generate SEO data for posts
generatePostSEO(post: Post, url: string): SEOData

// Generate SEO data for projects
generateProjectSEO(project: Project, url: string): SEOData

// Generate SEO data for documentation
generateDocumentationSEO(doc: Documentation, url: string): SEOData

// Generate SEO data for pages
generatePageSEO(page: Page, url: string): SEOData
```

### Markdown Processing
```typescript
// Process markdown content with all plugins
processMarkdown(content: string): {
  excerpt: string;
  wordCount: number;
  hasMore: boolean;
  readingTime: ReadingTime;
  headings: Heading[];
}

// Calculate reading time
calculateReadingTime(content: string): ReadingTime

// Generate table of contents
generateTOC(headings: Heading[]): Heading[]
```

### Image Optimization
```typescript
// Optimize post image paths
optimizePostImagePath(image: string, slug: string, id?: string): string

// Get fallback OG image
getFallbackOGImage(): OpenGraphImage

// Process folder-based images
processFolderImages(content: string, slug: string): string
```

### Internal Links Processing
```typescript
// Process wikilinks (posts only)
remarkWikilinks(): Plugin

// Process standard markdown links (all content types)
remarkStandardLinks(): Plugin

// Combined internal links processing
remarkInternalLinks(): Plugin

// Map relative URLs to site URLs
mapRelativeUrlToSiteUrl(url: string): string
```

### Theme Management
```typescript
// Get theme colors for components
getGraphThemeColors(): GraphThemeColors

// Update theme CSS variables
updateThemeCSSVariables(theme: string): Promise<void>

// Change theme with persistence
changeTheme(theme: string): Promise<void>
```

### Graph Data Processing
```typescript
// Generate graph data from posts
generateGraphData(posts: Post[]): GraphData

// Filter graph data for local view
filterGraphDataForPost(graphData: GraphData, postSlug: string): GraphData
```

### Mermaid Diagram Support
```typescript
// Initialize Mermaid with lazy loading
renderAllDiagrams(): void

// Handle theme changes for diagrams
handleThemeChange(): void

// Clear diagram cache
clearMermaidCache(): void
```

### Obsidian Embeds Processing
```typescript
// Process Obsidian embed syntax
remarkObsidianEmbeds(): Plugin

// Supported embed types:
// - Audio: ![[audio.mp3]]
// - Video: ![[video.mp4]]
// - YouTube: ![](https://youtube.com/watch?v=ID)
// - PDF: ![[document.pdf]]
// - Twitter: ![](https://twitter.com/user/status/ID)
```

## Component Props

### PostCard Component
```typescript
interface PostCardProps {
  post: Post | Project | Documentation;
  eager?: boolean;
  showCoverImage?: boolean;
  aspectRatio?: AspectRatio;
  customAspectRatio?: string;
}
```

### TableOfContents Component
```typescript
interface TableOfContentsProps {
  headings: Heading[];
  maxDepth?: number;
}
```

### CommandPalette Component
```typescript
interface CommandPaletteProps {
  enabled: boolean;
  shortcut: string;
  placeholder: string;
  search: {
    posts: boolean;
    pages: boolean;
    projects: boolean;
    docs: boolean;
  };
  sections: {
    quickActions: boolean;
    pages: boolean;
    social: boolean;
  };
}
```

### GraphModal Component
```typescript
interface GraphModalProps {
  enabled: boolean;
  maxNodes: number;
  showOrphanedPosts: boolean;
}
```

### LocalGraph Component
```typescript
interface LocalGraphProps {
  postSlug: string;
  enabled: boolean;
  maxNodes: number;
}
```

### MermaidDiagram Component
```typescript
interface MermaidDiagramProps {
  source: string;
  theme?: string;
}
```

### ImageWrapper Component
```typescript
interface ImageWrapperProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  fetchpriority?: "high" | "low" | "auto";
  class?: string;
}
```

### GiscusComments Component
```typescript
interface GiscusCommentsProps {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  strict: string;
  reactions: string;
  metadata: string;
  inputPosition: string;
  theme: string;
  lang: string;
  loading: string;
}
```

## Type Definitions

### Core Types
```typescript
interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface ReadingTime {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogImage?: OpenGraphImage;
  ogType: 'website' | 'article';
  twitterCard: 'summary' | 'summary_large_image';
  twitterSite?: string;
  twitterCreator?: string;
}

interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface GraphData {
  nodes: GraphNode[];
  connections: GraphConnection[];
}

interface GraphNode {
  id: string;
  type: "post";
  title: string;
  slug: string;
  date: string;
  connections: number;
}

interface GraphConnection {
  source: string;
  target: string;
  type: string;
}

interface GraphThemeColors {
  postFill: string;
  postStroke: string;
  postText: string;
  tagFill: string;
  tagStroke: string;
  tagText: string;
  linkStroke: string;
  highlight: string;
  background: string;
  backgroundSecondary: string;
}
```

### Plugin Types
```typescript
// Remark plugins for markdown processing
type RemarkPlugin = Plugin<[any?], Root>;

// Rehype plugins for HTML processing
type RehypePlugin = Plugin<[any?], Root, Root>;
```

## Error Handling

### Development Mode
- **Graceful fallbacks** for missing images with placeholder system
- **Detailed error logging** with helpful messages
- **Continue processing** with warnings for missing assets
- **Placeholder images** automatically used for missing assets

### Production Mode
- **Strict validation** for all required assets
- **Build failures** for missing critical assets
- **Optimized error handling** with minimal overhead
- **Clean console output** for professional deployments

### Error Types
```typescript
interface MissingImageError {
  type: 'missing-image';
  path: string;
  source: string;
  line: number;
  fallback: string;
}

interface MissingTagError {
  type: 'missing-tag';
  tag: string;
  source: string;
  line: number;
}

interface ConfigurationError {
  type: 'configuration';
  field: string;
  message: string;
  suggestion: string;
}
```

## Performance Considerations

### Image Loading
- **Lazy loading** for below-the-fold images
- **Eager loading** for above-the-fold content
- **WebP format priority** with fallbacks
- **Responsive image generation** with multiple sizes
- **Placeholder system** for missing images

### Search Performance
- **Debounced search input** to prevent excessive queries
- **Cached search results** for repeated queries
- **Fuse.js fuzzy search** integration for accurate results
- **Virtual scrolling** for large result sets

### Theme Performance
- **CSS custom properties** for dynamic theming
- **Theme caching** for graph components
- **Lazy theme loading** for custom themes
- **Optimized color calculations** for graph rendering

### Mermaid Performance
- **Intersection Observer** for lazy diagram loading
- **Diagram caching** by source and theme
- **Progressive loading** with skeleton states
- **Memory management** with automatic cleanup

### Graph Performance
- **D3 force simulation** with optimized settings
- **Node filtering** for local graph views
- **Event cleanup** to prevent memory leaks
- **Efficient rendering** with SVG optimization

## Build Process

### Asset Sync
```typescript
// Supported media types
const supportedMediaTypes = {
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif', 'ico'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', '3gp', 'flac', 'aac'],
  video: ['mp4', 'webm', 'ogv', 'mov', 'mkv', 'avi'],
  documents: ['pdf']
};
```

### RSS and Atom Feeds
- **Automatic generation** during build process
- **Post filtering** (excludes drafts in production)
- **Image support** with Open Graph integration
- **Category mapping** from post tags
- **Cache headers** for optimal performance

### Deployment Platforms
- **Netlify**: `netlify.toml` with redirects and build settings
- **Vercel**: `vercel.json` with redirects and cache headers
- **GitHub Pages**: `public/redirects.txt` for redirects

## Development Tools

### Scripts
```bash
# Development
pnpm run dev              # Start development server
pnpm run build            # Build for production
pnpm run check-images     # Check for missing images
pnpm run sync-images      # Sync images from content to public
pnpm run process-aliases  # Process content aliases
pnpm run generate-deployment-config # Generate deployment configs

# Version management
pnpm run version          # Get current theme version
```

### Configuration Validation
- **TypeScript interfaces** for all configuration options
- **Runtime validation** for critical settings
- **Helpful error messages** with suggestions
- **Default fallbacks** for missing configuration

This API reference provides comprehensive documentation for all aspects of the Astro Modular theme, from content collections to utility functions and component interfaces.