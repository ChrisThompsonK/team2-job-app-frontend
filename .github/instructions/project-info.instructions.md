---
applyTo: '**'
---

# Project Information and Architecture

## Project Overview

**team2-job-app-frontend** is a modern Node.js TypeScript Express server application built with ES modules. It's designed as a job roles management system with a focus on modern web development practices and clean architecture patterns.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+ (ESM only, no CommonJS)
- **Language**: TypeScript 5.9+ with strict configuration and comprehensive type checking
- **Web Framework**: Express.js 5.1+ with ES module imports
- **Template Engine**: Nunjucks 3.2+ for server-side rendering
- **CSS Framework**: Tailwind CSS v4 (latest) with CLI-based processing
- **UI Components**: DaisyUI 5.1+ for semantic component classes
- **Testing**: Vitest 3.2+ with coverage via V8
- **Code Quality**: Biome 2.2+ (replaces ESLint + Prettier)

### Development Tools
- **TypeScript Execution**: tsx 4.20+ for development with watch mode
- **Build Process**: Native TypeScript compiler (tsc)
- **CSS Processing**: Tailwind CSS CLI (no PostCSS config needed)

## Architecture Patterns

### MVC Structure
```
src/
├── controllers/     # Express route handlers and business logic
├── services/        # Data access layer and business services
├── models/          # TypeScript interfaces and data models
├── routes/          # Route configuration and middleware
└── index.ts         # Application entry point and server setup
```

### Key Design Patterns
- **Service Layer Pattern**: Business logic isolated in service classes
- **Dependency Injection**: Controllers accept service dependencies via constructor
- **Interface Segregation**: Clean interfaces for service contracts
- **Repository Pattern**: Memory-based data storage with interface abstraction

## Application Structure

### Server Configuration
- **Port**: 3000 (hardcoded)
- **Static Files**: Served from `/public` directory
- **Views**: Nunjucks templates in `/views` directory
- **Auto-restart**: tsx watch handles file changes during development

### Data Layer
- **Current Implementation**: In-memory data storage via `JobRoleMemoryService`
- **Sample Data**: Provided by `SampleJobRoleProvider`
- **Service Interface**: `JobRoleService` for easy swapping of implementations
- **Data Model**: `JobRole` interface with typed properties

### View Layer
- **Template Engine**: Nunjucks with autoescape enabled
- **Styling**: DaisyUI components with Tailwind CSS utilities
- **Responsive Design**: Mobile-first approach with overflow handling for tables
- **Theme System**: DaisyUI theming with `data-theme="lofi"` default
- **Form Patterns**: Modern `fieldset` + `validator` approach for accessibility and validation
- **Error Handling**: Efficient Nunjucks filters (`first`, `selectattr`) for error display

## Build and Development Workflow

### Development Commands
- `npm run dev`: Parallel CSS watching + tsx server with hot reload
- `npm run css:watch`: Tailwind CSS file watcher for style changes
- `npm run type-check`: TypeScript type validation without compilation

### Production Commands
- `npm run build`: CSS build + TypeScript compilation to `/dist`
- `npm run start`: Production server from compiled JavaScript
- `npm run serve`: Full build + start sequence

### Quality Assurance
- `npm run check`: Biome format + lint with auto-fix (MANDATORY before commits)
- `npm run test`: Vitest test runner with watch mode
- `npm run test:coverage`: Test coverage reporting via V8

## Key Features and Capabilities

### Current Features
1. **Job Roles Display**: Complete CRUD-ready job roles listing
2. **Responsive UI**: Mobile-optimized table with DaisyUI components
3. **Type Safety**: Full TypeScript coverage with strict configuration
4. **Modern CSS**: Tailwind v4 with semantic DaisyUI classes
5. **Development Experience**: Hot reload, watch modes, fast feedback loops

### Architectural Strengths
1. **ES Modules**: Modern JavaScript module system throughout
2. **Strict TypeScript**: Comprehensive type checking and safety
3. **Clean Architecture**: Separation of concerns with clear layers
4. **Testable Design**: Dependency injection enables easy unit testing
5. **Modern Tooling**: Latest versions of all dependencies with caret versioning

## Important Implementation Details

### TypeScript Configuration
- **Target**: ES2022 with ESNext modules
- **Strict Mode**: All strict checks enabled including unused parameters
- **Module Resolution**: Node.js style with JSON module support
- **Source Maps**: Enabled for debugging with declaration files

### CSS and Styling
- **No Tailwind Config**: Uses Tailwind v4 with `@theme` directive in CSS
- **DaisyUI Integration**: Plugin-based approach with semantic classes
- **Build Process**: CLI-based CSS processing (no PostCSS required)
- **Custom Styling**: Layer-based approach for component extensions

### Testing Setup
- **Framework**: Vitest with Node.js environment
- **Globals**: describe, it, expect available globally
- **Coverage**: V8-based coverage reporting with HTML output
- **Integration**: TypeScript types included for test environment

### Biome Configuration
- **Line Width**: 120 characters
- **Indentation**: 2 spaces
- **File Handling**: Tracks all files, uses Git ignore patterns
- **Auto-fix**: Enabled for both formatting and linting

## Development Guidelines

### File Structure Conventions
- All TypeScript files use `.ts` extension (no `.js` files in src)
- Interfaces defined in separate files (`interfaces.ts`)
- Controllers, services, and models in dedicated directories
- Views use `.njk` extension for Nunjucks templates

### Import/Export Patterns
- ES module imports/exports exclusively
- Named exports preferred over default exports (except main app)
- Type-only imports using `type` keyword where appropriate
- Absolute imports from project root (no relative path traversal)

### Error Handling
- Express error handling through try/catch in controllers
- Service layer throws typed errors
- Template rendering includes error states and empty states

This architecture provides a solid foundation for scaling the application while maintaining code quality, type safety, and modern development practices.
