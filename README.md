# Rack Server Design Tool

A modern, web-based rack server design tool built with React, TypeScript, and Vite. Design and visualize data center rack layouts with auto-snapping, drag-and-drop functionality, and comprehensive component libraries.

![Rack Server Design Tool](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue)
![Vite](https://img.shields.io/badge/Vite-5.2.11-green)
![Bun](https://img.shields.io/badge/Bun-1.0+-orange)

## ✨ Features

### 🎯 **Core Functionality**

- **Drag & Drop Interface** - Intuitive component placement from library to rack
- **Auto-Snapping System** - Automatic alignment to rack units with visual guides
- **Real-time Validation** - Collision detection and fit validation
- **Component Categories** - Servers, storage, network, power, cooling, and accessories

### 📊 **Design Tools**

- **42U Standard Rack** - Industry-standard rack dimensions and mounting
- **Visual Snap Guides** - Real-time feedback during component placement
- **Zoom & Pan Controls** - Detailed view controls for precise placement
- **Grid System** - Accurate rack unit measurements and guides

### 💾 **Data Management**

- **Save/Load Designs** - Local storage with JSON export/import
- **Design Statistics** - Power consumption, weight, utilization tracking
- **Component Database** - Pre-loaded with real server specifications
- **Export Options** - JSON, PDF, and image export capabilities

### 🎨 **User Experience**

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Automatic theme detection
- **Keyboard Shortcuts** - Efficient workflow with hotkeys
- **Component Search** - Fast filtering and categorization

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.0+ (recommended) or Node.js 18+
- Modern web browser with ES6+ support

### Installation

```bash
# Clone the repository
git clone https://github.com/asheliahut/rack-server-design-tool.git
cd rack-server-design-tool

# Install dependencies with Bun (recommended)
bun install

# Or with npm
npm install

# Start development server
bun dev
# Or with npm: npm run dev
```

### Build for Production

```bash
# Build with Bun
bun run build

# Or with npm
npm run build

# Preview production build
bun run preview
```

## 📁 Project Structure

```
rack-server-design-tool/
├── public/
│   └── images/              # Component images and placeholders
│       ├── servers/         # Server component images
│       ├── storage/         # Storage component images
│       ├── network/         # Network component images
│       ├── power/           # Power component images
│       ├── accessories/     # Accessory component images
│       └── placeholders/    # Fallback placeholder images
├── src/
│   ├── components/          # React components
│   │   ├── rack/           # Rack display components
│   │   ├── library/        # Component library sidebar
│   │   ├── design/         # Design tools and canvas
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── data/               # Component data and configurations
│   ├── styles/             # CSS and styling
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── bunfig.toml           # Bun configuration
└── README.md             # This file
```

## 🎮 Usage

### Basic Workflow

1. **Browse Components** - Use the left sidebar to explore available components
2. **Search & Filter** - Find specific components using the search bar
3. **Drag & Drop** - Drag components from the library to the rack
4. **Auto-Snap** - Components automatically snap to valid rack positions
5. **Adjust & Arrange** - Move components within the rack as needed
6. **Monitor Stats** - Track power, weight, and utilization in real-time
7. **Save Design** - Export or save your rack design

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save design |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` | Redo action |
| `+` / `-` | Zoom in/out |
| `Space + Drag` | Pan canvas |
| `Delete` | Remove selected component |
| `Escape` | Deselect component |

### Component Categories

- **🖥️ Servers** - Rack-mount servers (1U, 2U, 4U)
- **💾 Storage** - Storage arrays and disk enclosures
- **🔌 Network** - Switches, routers, and network equipment
- **⚡ Power** - UPS units and power distribution
- **❄️ Cooling** - Fans and cooling units
- **🔧 Management** - KVM switches and management tools
- **⬜ Blank Panels** - Filler panels and cable management

## 🛠️ Development

### Tech Stack

- **Frontend Framework** - React 18.3.1 with TypeScript
- **Build Tool** - Vite 5.2.11 for fast development and building
- **Package Manager** - Bun 1.0+ for ultra-fast package management
- **Styling** - Tailwind CSS with custom rack-specific utilities
- **Drag & Drop** - React DnD with HTML5 backend
- **State Management** - Zustand for lightweight state management
- **Data Fetching** - TanStack Query for server state management
- **Icons** - Lucide React for consistent iconography

### Available Scripts

```bash
# Development
bun dev              # Start development server
bun run type-check   # Run TypeScript type checking

# Building
bun run build        # Build for production
bun run preview      # Preview production build

# Code Quality
bun run lint         # Run ESLint
bun run clean        # Clean build artifacts

# Utilities
bun add [package]    # Add new dependency
bun update          # Update all dependencies
bun outdated        # Check for outdated packages
```

### Adding New Components

1. Add component specifications to `src/data/serverComponents.ts`
2. Add component images to `public/images/[category]/`
3. Update type definitions if needed in `src/types/rack.ts`
4. Test the component in the design tool

Example component definition:

```typescript
{
  id: 'my-server-1u',
  name: 'My Custom Server',
  category: 'server',
  height: 1,           // Rack units
  width: 100,          // Percentage (50% or 100%)
  depth: 2,            // Depth category (0=shallow, 1=medium, 2=deep)
  imageUrl: '/images/servers/my-custom-server.jpg',
  specifications: {
    manufacturer: 'Acme Corp',
    model: 'ServerPro 1000',
    power: '450W',
    weight: '12.5kg',
    capacity: '16 cores, 64GB RAM',
    ports: 4,
  },
}
```

### Performance Optimizations

- **Bun Runtime** - 3-4x faster package installation and bundling
- **Vite HMR** - Instant hot module replacement during development
- **Image Lazy Loading** - Components images loaded on demand
- **Virtual Scrolling** - Efficient rendering of large component lists
- **Memoized Components** - Optimized re-rendering with React.memo
- **Efficient Snap Calculations** - Optimized algorithms for real-time snapping

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode conventions
- Use Tailwind CSS for styling
- Write tests for new components and utilities
- Ensure components are accessible (WCAG 2.1 AA)
- Optimize for performance and bundle size

## 📋 Roadmap

### Version 1.1

- [ ] Real-time collaboration features
- [ ] Advanced cable management visualization
- [ ] Power and thermal analysis tools
- [ ] Integration with DCIM systems

### Version 1.2

- [ ] 3D rack visualization
- [ ] Automated optimal placement suggestions
- [ ] Custom component creation tools
- [ ] Advanced reporting and analytics

### Version 2.0

- [ ] Multi-rack data center planning
- [ ] AI-powered capacity planning
- [ ] Integration with vendor catalogs
- [ ] Mobile app companion

## 🐛 Known Issues

- Safari on iOS may have touch event conflicts with drag operations
- Very large designs (>100 components) may experience performance impacts
- PDF export requires manual page breaks for complex designs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React DnD** - For excellent drag and drop functionality
- **Tailwind CSS** - For utility-first styling approach
- **Lucide** - For beautiful, consistent icons
- **Vite** - For lightning-fast development experience
- **Bun** - For incredibly fast package management

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/asheliahut/rack-server-design-tool/issues)
- **Discussions** - [GitHub Discussions](https://github.com/asheliahut/rack-server-design-tool/discussions)
- **Email** - [Contact the maintainers](mailto:support@example.com)

---

**Made with ❤️ for data center professionals and IT infrastructure teams**
