[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/) 

# Team 2 Job App Frontend

A modern Node.js TypeScript application with ES modules support.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **ES Modules**: Modern JavaScript module system
- **tsx**: Fast TypeScript execution for development
- **Modern Node.js**: Latest JavaScript features (ES2022)
- **Express**: Fast, unopinionated web framework for Node.js
- **Nunjucks**: Powerful templating engine for dynamic HTML generation
- **Tailwind CSS 4**: Latest version of utility-first CSS framework
- **daisyUI 5.1.26**: Beautiful UI component library built on Tailwind CSS
- **Biome**: Ultra-fast formatter, linter, and code quality tools
- **Vitest**: Next generation testing framework with coverage support
- **Strict Configuration**: Comprehensive TypeScript compiler options
- **Job Roles Management**: Comprehensive job listing with "View Details" and "Apply Now" buttons for seamless navigation and application process
- **Kainos Brand Theme**: Custom blue, green, and white color scheme matching Kainos branding
- **Premium UI Experience**: Enhanced home page and job roles with smooth animations and premium effects
- **Advanced Animation System**: Shimmer effects, floating elements, staggered loading, and micro-interactions
- **Glass Morphism Design**: Modern translucent effects with backdrop blur for contemporary aesthetics
- **Unified Logo System**: Consistent transparent background Kainos logo across all components for clean, professional presentation
- **Cross-Page Consistency**: Unified branding with official Kainos logo implementation across all templates
- **Header-Footer Alignment**: Synchronized logo styling between navigation header and footer components
- **Template Inheritance System**: Reusable layout components with header and footer separation
- **Dark Mode**: Full dark mode support with dual toggle buttons (header and accessibility panel)
- **Dynamic Logo Switching**: Automatic logo toggling between light and dark versions based on theme
- **Theme Persistence**: Dark mode preference saved to localStorage and restored on page reload
- **API Integration**: Axios-based HTTP client with fallback to mock data
- **Dependency Injection**: Clean architecture with service layer separation
- **Accessibility Features**: WCAG 2.1 AA compliant with comprehensive accessibility support

## 🌙 Dark Mode

This application features a comprehensive dark mode implementation with multiple access points and persistent preferences:

### **Features**
- **Dual Toggle Buttons**: 
  - Quick access moon/sun icon in header navigation
  - Full control in accessibility settings panel
- **Dynamic Logo Switching**: 
  - Navigation logo automatically switches between light (`KainosLogoNoBackground.png`) and dark (`kainos-dark-bg.png`) versions
  - Hero section logos use premium dark background version
- **Complete Theme Coverage**:
  - Custom dark mode styles for all components (`.dark-mode` class)
  - Proper contrast ratios for WCAG AA compliance
  - Smooth transitions between light and dark themes
- **Persistent Preferences**: 
  - User selection saved to localStorage
  - Theme restored automatically on page load
  - Default to light mode for first-time visitors

### **Technical Implementation**
- **CSS Architecture**: Custom `.dark-mode` class with comprehensive style overrides
- **JavaScript Control**: Centralized dark mode management in `accessibility.js`
- **Tailwind Integration**: Configured to use custom `.dark-mode` selector
- **Logo Management**: Automatic image source switching via `switchLogos()` function

### **Usage**
1. Click the moon icon in the header to enable dark mode
2. Icon changes to sun icon when dark mode is active
3. Click again to return to light mode
4. Preference is automatically saved and persists across sessions

## ♿ Accessibility Features

This application is **WCAG 2.1 AA compliant** with comprehensive accessibility support:

### **Implemented Features**
- ✅ **Skip Links**: Jump to main content for keyboard users
- ✅ **Text Size Controls**: 4 size options (Small, Medium, Large, X-Large) with localStorage persistence  
- ✅ **Dark Mode**: Complete dark theme with dual toggle buttons (header icon + accessibility panel)
- ✅ **Dynamic Logo Switching**: Kainos logo automatically switches between light/dark versions with theme
- ✅ **Theme Persistence**: Dark mode preference saved and restored across sessions
- ✅ **Keyboard Navigation**: Full keyboard support with Enter/Space/Escape keys
- ✅ **Enhanced Focus Indicators**: High-visibility focus states for all interactive elements
- ✅ **ARIA Implementation**: Proper labels, roles, and semantic markup
- ✅ **Screen Reader Support**: Optimized for VoiceOver, NVDA, and JAWS

### **Quick Testing**
1. Press **Tab** on page load to see skip links
2. Click **Accessibility** button in navigation
3. Test text sizing, dark mode, and keyboard navigation
4. All settings persist across page refreshes

### **Documentation**
- **Full Guide**: See `ACCESSIBILITY_REPORT.md` for comprehensive details
- **Manual Testing**: See `test-accessibility-manual.md` for testing procedures  
- **Test Coverage**: 100% passing accessibility integration tests

## 📦 Project Structure
```
├── src/
│   ├── index.ts          # Main application entry point
│   ├── testing.ts        # Utility functions
│   ├── controllers/
│   │   └── job-role-controller.ts  # Job roles route handler
│   ├── services/
│   │   └── job-role-service.ts     # Job roles API service with axios
│   ├── models/
│   │   └── job-role-response.ts    # Job role data models
│   ├── data/
│   │   └── job-roles.json          # JSON data source with job roles
│   ├── styles/
│   │   └── input.css     # Tailwind CSS + daisyUI imports
│   └── views/
│       ├── templates/
│       │   ├── layout.njk    # Base template with common structure
│       │   ├── header.njk    # Reusable navigation header component
│       │   └── footer.njk    # Reusable footer component
│       ├── index.njk         # Home page template extending base layout
│       ├── job-role-list.njk # Job roles listing template
│       └── error.njk         # Error page template
├── public/
│   └── css/
│       └── styles.css    # Generated Tailwind + daisyUI styles
├── dist/                 # Compiled JavaScript output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vitest.config.ts      # Vitest testing configuration
├── biome.json           # Biome linter and formatter configuration
└── .gitignore           # Git ignore rules
```

## 🛠️ Available Scripts

### Development & Build
- **`npm run dev`**: Run the application in development mode with tsx
- **`npm run build`**: Build CSS and compile TypeScript to JavaScript
- **`npm run build:css`**: Generate Tailwind CSS with daisyUI components
- **`npm run build:css:watch`**: Watch mode for CSS generation during development
- **`npm run build:css:prod`**: Generate minified CSS for production
- **`npm start`**: Run the compiled JavaScript application
- **`npm run type-check`**: Type check without emitting files

### Testing (Vitest)
- **`npm test`**: Run tests in watch mode
- **`npm run test:run`**: Run all tests once
- **`npm run test:watch`**: Run tests in watch mode
- **`npm run test:ui`**: Open Vitest UI for interactive testing
- **`npm run test:coverage`**: Run tests with coverage report

### Code Quality (Biome)
- **`npm run lint`**: Check for linting issues
- **`npm run lint:fix`**: Fix linting issues automatically
- **`npm run format`**: Check code formatting
- **`npm run format:fix`**: Fix formatting issues automatically
- **`npm run check`**: Run both linting and formatting checks
- **`npm run check:fix`**: Fix both linting and formatting issues automatically

## 🔧 Development

1. **Development Mode**: Use `npm run dev` for fast development with tsx
2. **Testing**: Run `npm test` for watch mode or `npm run test:run` for single run
3. **Type Checking**: Run `npm run type-check` to validate TypeScript without compilation
4. **Code Quality**: Use `npm run check:fix` to automatically fix linting and formatting issues
5. **Production Build**: Use `npm run build` to compile for production

### Code Quality Workflow
```bash
# Check and fix all code quality issues
npm run check:fix

# Or run individually
npm run lint:fix    # Fix linting issues
npm run format:fix  # Fix formatting issues
```

### UI Development Workflow
```bash
# Start development with CSS watching
npm run build:css:watch  # In one terminal (watches CSS changes)
npm run dev              # In another terminal (runs the app)

# Or build CSS manually after changes
npm run build:css        # Generate CSS with daisyUI components
```

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