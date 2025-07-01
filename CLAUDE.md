# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses Bun as the primary package manager and runtime.

### Core Development Commands
- `bun dev` - Start development server with Vite HMR
- `bun run build` - Build for production (includes type checking)
- `bun run type-check` - Run TypeScript type checking without emitting files
- `bun run lint` - Run ESLint with React-specific rules
- `bun run preview` - Preview production build locally
- `bun run clean` - Clean build artifacts and node_modules

### Build Process
The build command automatically runs type checking before building. The application is configured for deployment to GitHub Pages with the base path `/rack-server-design-tool/`.

## Architecture Overview

This is a React-based drag-and-drop rack server design tool built with modern web technologies.

### Core Technologies
- **React 19** with TypeScript in strict mode
- **Vite** for build tooling and development server
- **Bun** for package management and runtime
- **React DnD** with HTML5 backend for drag-and-drop functionality
- **Zustand** for state management (via useRackDesign hook)
- **TanStack Query** for server state management
- **Tailwind CSS** with custom rack-specific design tokens

### Key Architecture Patterns

#### State Management
- Primary state is managed through the `useRackDesign` hook (`src/hooks/useRackDesign.ts`)
- This hook manages the current rack design, components, and CRUD operations
- Theme state is managed via `ThemeContext` for dark/light mode switching

#### Component Architecture
- **Rack System**: `RackContainer` → `RackGrid` → individual rack units
- **Component Library**: Category-based component browser with drag-and-drop
- **Design Canvas**: Scrollable design area with snap-to-grid functionality
- **Properties Panel**: Right sidebar for component details and configuration

#### Drag and Drop System
- Uses React DnD with HTML5 backend
- Components can be dragged from library to rack positions
- Automatic snap-to-grid alignment with visual guides
- Collision detection prevents component overlap

### Path Aliases
The project uses TypeScript path mapping for clean imports:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`
- `@/utils/*` → `./src/utils/*`
- `@/data/*` → `./src/data/*`

### Component Data Structure
Server components are defined in `src/data/serverComponents.ts` with the following structure:
- UniFi networking equipment (extensive catalog)
- Generic servers (1U, 2U, 4U, 8U)
- Storage arrays and NAS devices
- Power and UPS components
- Networking switches and routers
- Accessories (blank panels, patch panels, shelves)

### Responsive Design
- Mobile: Floating component library overlay
- Desktop: Fixed left sidebar with collapsible library
- Properties panel: Full overlay on mobile, fixed right sidebar on desktop

### Key Features to Understand
- **Auto-snapping**: Components automatically align to rack unit positions
- **Port Labeling**: Special handling for patch panels with individual port configuration
- **Component Customization**: Users can rename components and add custom descriptions
- **Real-time Statistics**: Live tracking of power, weight, and utilization
- **Import/Export**: Local storage and JSON file support for design persistence

### Styling Approach
Uses Tailwind CSS with custom design tokens for:
- Rack-specific colors and spacing
- Component category color coding
- Dark mode support throughout
- Responsive grid systems for rack layout
- Custom animations and transitions

## Development Notes

### Image Loading
- Components use placeholder SVGs when images fail to load
- Image error handling is implemented in the main App component
- Images are expected in `/public/images/[category]/` directories

### TypeScript Configuration
- Strict mode enabled with additional checks for unused locals/parameters
- ES2020 target with ESNext modules
- Bundler module resolution for Vite compatibility

### Performance Optimizations
- React.memo used for expensive component renders
- Efficient drag-and-drop collision detection
- Lazy loading for component images
- Optimized bundle size with Vite's esbuild minification