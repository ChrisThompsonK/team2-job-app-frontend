
# Team 2 Job App Frontend

[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

A modern, accessible job application portal built with Node.js, TypeScript, Express, Nunjucks, Tailwind CSS, and DaisyUI.

## 🚀 Features
- TypeScript, ES Modules, Express, Nunjucks templating
- Tailwind CSS 4, DaisyUI, Biome, Vitest
- Modern homepage UI, animated backgrounds, stat cards
- Readable time display (HH:MM, weekday, date)
- Job roles listing, details, and application workflow
- Kainos brand theme, unified logo system
- Dark mode (dual toggle, persistent)
- Accessibility: skip links, text size, ARIA, keyboard navigation

## 📦 Project Structure
```
├── src/
│   ├── index.ts
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── data/
│   ├── styles/
│   └── views/
├── public/
│   ├── css/
│   ├── js/
│   └── KainosLogoNoBackground.png
├── dist/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vitest.config.ts
├── biome.json
└── .gitignore
```


## 🛠️ Scripts
- `npm run dev` — Start development server
- `npm run build` — Build CSS and TypeScript
- `npm run build:css` — Generate CSS
- `npm run test` — Run tests (Vitest)
- `npm run lint` — Lint code (Biome)
- `npm run format` — Format code (Biome)

## 🔧 Quickstart
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build CSS: `npm run build:css`
4. Run tests: `npm test`

---

## 🏗️ Tech Stack

- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express**: Fast web framework for Node.js
- **Nunjucks**: Rich templating engine with inheritance, async, and more
- **Tailwind CSS 4**: Utility-first CSS framework (latest version)
- **daisyUI 5.1.26**: Semantic component classes for Tailwind CSS
- **Lucide**: Beautiful & consistent SVG icon library with 1000+ icons
- **Axios**: Promise-based HTTP client for API calls
- **Vitest**: Next generation testing framework with coverage
- **tsx**: TypeScript execution engine
- **ES Modules**: Modern module system
- **Biome**: Fast formatter, linter, and import organizer

## 🎨 Icon System (Lucide)

The application uses [Lucide](https://lucide.dev/) for beautiful, consistent SVG icons:

### Features
- **1000+ Icons**: Comprehensive collection of clean, consistent icons
- **SVG-Based**: Crisp icons that scale perfectly at any size
- **Customizable**: Full control over size, stroke width, color, and styling
- **Performance**: Optimized SVG markup with minimal overhead
- **Accessibility**: Semantic SVG markup with proper attributes

### Usage in Templates

#### Basic Usage
```njk
{{ lucideIcon('info', { size: 24, className: 'text-blue-500' }) | safe }}
```

#### Available Icons
- `info` - Information/help icon
- `map-pin`, `location` - Location/address icon  
- `tag` - Category/capability icon
- `briefcase`, `band` - Job role/level icon
- `calendar` - Date/schedule icon
- `x-circle`, `error` - Error/close icon

#### Configuration Options
```typescript
{
  size?: number;          // Icon size (default: 24)
  strokeWidth?: number;   // Line thickness (default: 2)
  className?: string;     // CSS classes (default: '')
  color?: string;         // Stroke color (default: 'currentColor')
}
```

#### Example Implementation
```njk
<!-- Job role location with custom styling -->
<div class="flex items-center gap-2">
  {{ lucideIcon('map-pin', { 
    size: 20, 
    className: 'w-5 h-5 text-secondary' 
  }) | safe }}
  <span>{{ jobRole.location }}</span>
</div>
```

### Icon Helper Implementation
- **Server-Side Rendering**: Icons are generated server-side for optimal performance
- **Nunjucks Integration**: Available as both global function and filter
- **Type Safety**: Full TypeScript support with proper type definitions
- **Fallback Handling**: Graceful degradation for missing icons

## 🎯 Job Roles Feature

The application includes a comprehensive job roles management system:

### Routes
- **`/`**: Enhanced home page with premium animations, hero section, and interactive stat cards
- **`/job-roles`**: Premium job listings with smooth card animations and enhanced visual effects
- **`/job-roles/{id}`**: Individual job role details accessible via "View Details" button with comprehensive role information

### Architecture
- **JobRoleService**: Handles API communication with axios, includes fallback to mock data
- **JobRoleController**: Express route handlers with proper error handling
- **JobRoleResponse**: TypeScript models for type safety
- **Dependency Injection**: Clean separation of concerns with service layer
- **View-Based Titles**: Page titles are defined directly in templates for better maintainability

### Features
- Display job roles with role name, location, capability, band, and closing date
- **Dual Action Buttons**: Each job role card features both "View Details" (secondary style) and "Apply Now" (primary gradient) buttons for complete user workflow
- **Seamless Navigation**: "View Details" button links to individual job role information pages (`/job-roles/{id}`) with proper routing
- **Kainos Brand Identity**: Professional theme with navy blue (#2E4374), green (#8BC34A), and white colors
- **Official Logo Integration**: Consistent Kainos brand logo across homepage, job roles pages, header, and footer
- **Advanced Animation System**: Smooth CSS animations with staggered loading, floating elements, and pulse effects
- **Interactive UI Elements**: Enhanced hover effects with scale transforms, gradient backgrounds, and cubic-bezier transitions
- **Premium Visual Effects**: Shimmer animations, glass morphism, glow effects, and 3D button interactions
- **Micro-Interactions**: Icon rotations, badge ripple effects, card lift animations, and smooth color transitions
- **Cross-Template Consistency**: Unified styling and branding between index.njk and job-role-list.njk
- Responsive card-based layout with **Lucide SVG icons** and badges plus custom Kainos styling and rounded corners
- **Enhanced Visual Design**: Custom animated icons with color-coded gradient backgrounds and premium branded buttons
- **Staggered Animations**: Cards appear with sequential timing for smooth loading experience
- **Button Visibility**: Fixed contrast issues ensuring all interactive elements are clearly visible
- **JSON Data Source**: Comprehensive job roles data loaded from JSON file
- Automatic fallback to mock data when API is unavailable
- Error handling with user-friendly error pages styled to match Kainos branding
- Beautiful UI combining daisyUI components with Lucide icons and custom advanced CSS animations and effects

### Data Management
- **Primary Data**: JSON file (`src/data/job-roles.json`) with 12 diverse job roles
- **API Integration**: Attempts to fetch from backend API first
- **Graceful Fallback**: Falls back to JSON data when API is unavailable
- **Fallback Safety**: Hardcoded fallback data if JSON file fails to load


### Recent Quality Improvements
- **Consistent Logo Implementation**: Unified transparent background Kainos logo with responsive sizing (h-8 for header/footer, h-16 for hero sections)
- **File Structure Cleanup**: Fixed HTML structural issues and removed duplicate content
- **CSS Class Corrections**: Resolved Tailwind class naming issues (h-10 vs h10)
- **Button Visibility**: Enhanced contrast for better accessibility and user experience
- **Cross-Page Branding**: Consistent Kainos visual identity throughout the application
- **Code Quality**: All files pass Biome formatting and linting checks
- **Test Coverage**: Comprehensive test suite with 25/25 tests passing consistently


### Template Architecture
- **View-Driven Titles**: Page titles are defined directly in Nunjucks templates rather than passed from controllers
- **Separation of Concerns**: Controllers focus on data handling, views handle presentation
- **Maintainability**: Title changes can be made directly in templates without touching controller code
- **Consistency**: Each template owns its title and heading content

## 📝 Configuration

The project uses modern TypeScript configuration with:
- ES2022 target and lib
- ESNext modules with bundler resolution
- Strict type checking enabled
- Source maps and declarations generated
- Comprehensive compiler options for better code quality

### Vitest Configuration
- **Environment**: Node.js testing environment
- **Globals**: Enabled (describe, it, expect available globally)
- **Coverage**: V8 provider with HTML/JSON/text reports
- **File Patterns**: Tests in `**/*.{test,spec}.{js,ts,tsx}` files
- **UI**: Interactive testing interface available

### Tailwind CSS + daisyUI Configuration
- **Tailwind CSS 4**: Latest version with modern CSS features
- **daisyUI Integration**: Uses `@plugin "daisyui"` directive in CSS
- **Dark Mode**: Custom `.dark-mode` class selector configured in `tailwind.config.js`
- **Content Sources**: Configured to scan `src/**/*.{html,js,ts,njk}` files
- **Component Classes**: Full access to daisyUI's semantic component library
- **Build Process**: Automated CSS generation with component tree-shaking

### Biome Configuration
- **Linting**: Recommended rules with TypeScript support
- **Formatting**: Tab indentation (2 spaces), 80-character line width
- **Code Style**: Double quotes, trailing commas (ES5), semicolons
- **File Coverage**: All files in `src/` directory