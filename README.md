# Team 2 Job App Frontend

[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

A modern, accessible job application portal built with Node.js, TypeScript, Express, Nunjucks, Tailwind CSS, and DaisyUI.

## 🚀 Features
- TypeScript, ES Modules, Express, Nunjucks templating
- Tailwind CSS 4, DaisyUI, Biome, Vitest
- **User Authentication System** - Complete login and registration with session management
  - Login with email/password authentication
  - User registration with validation (name, email, password strength)
  - Personalized success messages showing user's full name
  - Secure session management with Express Session
  - Client-side and server-side validation
  - Password visibility toggle and strength requirements
- **Galano Grotesque Typography**: Modern, clean Galano Grotesque font family applied system-wide for professional consistency and optimal readability
- Modern homepage UI with animated backgrounds and stat cards
- **About & Contact Pages** - Professional informational pages with company mission, values, team stats, and contact information
- Job roles listing, details, and application workflow
  - **Status Badges**: Each job card now displays a badge indicating if the job is Open or Closed
  - **Conditional Apply Button**: The "Apply Now" button is only shown for jobs with status Open
- **Complete Application System** - Full application submission with file upload, validation, and error handling
- **Applicant Management** - View and manage job applicants with responsive table, pagination, and filtering
- **Pagination System** - Efficient browsing with page controls, ellipsis navigation, and loading states
- **Admin job role creation** - Full CRUD functionality to create and save job roles to database
- **CSV Export** - Generate comprehensive reports of all job roles in CSV format for stakeholder distribution
- Backend API integration via Axios for all services (job roles, applications, authentication)
- Kainos brand theme, unified logo system
- Dark mode (opt-in, dual toggles, persistent via localStorage; light theme is default) with a minimal header/link override (`public/css/overrides.css`)
- Accessibility: skip links, text size, ARIA, keyboard navigation
- **Accessible Mobile Navigation**: Off‑canvas mobile menu moved outside header stacking context for reliable overlay, includes focus trapping, ESC/backdrop close, body scroll lock, proper `role="dialog"` + `aria-modal` semantics

## 📦 Project Structure
```
├── src/
│   ├── index.ts                          # Application entry point & routing
│   ├── controllers/
│   │   ├── job-role-controller.ts        # Public job role operations (read-only)
│   │   ├── admin-controller.ts           # Admin operations (create, update, delete)
│   │   ├── application-controller.ts     # Job application submission and applicant viewing
│   │   ├── auth-controller.ts            # Authentication page rendering (login, register)
│   │   ├── user-controller.ts            # User session management (logout)
│   │   └── *.test.ts                     # Controller unit tests
│   ├── services/
│   │   ├── job-role-service.ts           # JobRoleService interface
│   │   ├── axios-job-role-service.ts     # API implementation with Axios
│   │   ├── application-service.ts        # ApplicationService interface
│   │   ├── axios-application-service.ts  # Application API implementation with Axios
│   │   ├── auth-service.ts               # Authentication service with Axios
│   │   └── interfaces.ts                 # Service interfaces
│   ├── models/
│   │   ├── job-role-response.ts          # TypeScript data models
│   │   ├── job-role-create.ts            # Create request model
│   │   ├── job-role-detailed-response.ts # Detailed response model
│   │   ├── application-request.ts        # Application submission models
│   │   ├── applicant-display.ts          # Applicant listing and pagination models
│   │   ├── auth-request.ts               # Authentication request models (login, register)
│   │   ├── auth-response.ts              # Authentication response models
│   │   └── user.ts                       # User and authentication models
│   ├── types/
│   │   └── session.ts                    # Express session type extensions
│   ├── utils/
│   │   ├── job-role-validator.ts         # Comprehensive validation logic
│   │   ├── job-role-validation-constants.ts  # Valid options for dropdowns
│   │   ├── application-validator.ts      # Application form validation
│   │   ├── auth-validator.ts             # Authentication form validation (email, password)
│   │   ├── csv-export.ts                 # CSV generation and export utilities
│   │   └── validation.ts                 # General validation helpers
│   ├── data/
│   │   └── job-roles.json                # Sample data (fallback)
│   ├── styles/
│   │   └── input.css                     # Tailwind CSS source
│   └── views/
│       ├── job-role-list.njk             # Job roles listing page
│       ├── job-role-information.njk      # Individual job role details
│       ├── job-role-create.njk           # Admin job role creation form
│       ├── job-application-form.njk      # Job application submission form
│       ├── job-applicants-list.njk       # Applicants management page
│       ├── application-success.njk       # Application confirmation page
│       ├── about.njk                     # About us page
│       ├── contact.njk                   # Contact page
│       ├── login.njk                     # User login form
│       ├── register.njk                  # User registration form
│       ├── index.njk                     # Homepage with login success toast
│       ├── error.njk                     # Error page
│       └── templates/                    # Layout & partials
├── public/
│   ├── css/
│   │   ├── styles.css                    # Compiled Tailwind + DaisyUI output
│   │   └── overrides.css                 # Post-build dark mode & nav override rules
│   ├── js/
│   │   ├── accessibility.js              # Accessibility features (text size, keyboard nav)
│   │   └── auth.js                       # Authentication handling (login, register forms)
│   └── *.png                             # Static assets
├── dist/                                  # Compiled TypeScript output
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vitest.config.ts
├── biome.json
└── .gitignore
```


## 🛠️ Scripts

### Development
- `npm run dev` — Start development server with hot reload (runs CSS watch + tsx server in parallel)
- `npm run css:watch` — Watch and rebuild CSS on file changes

### Building
- `npm run build` — Full production build (CSS + TypeScript compilation)
- `npm run build:css` — Generate CSS from Tailwind
- `npm run start` — Start production server from compiled code
- `npm run serve` — Build and start production server

### Testing & Quality
- `npm run test` — Run tests in watch mode (Vitest)
- `npm run test:run` — Run tests once (CI mode)
- `npm run test:coverage` — Generate test coverage report
- `npm run type-check` — TypeScript type validation (no compilation)
- `npm run check` — Biome format + lint with auto-fix (run before commits)
- `npm run lint` — Biome lint only
- `npm run format` — Biome format only

## 🔧 Quickstart
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build CSS: `npm run build:css`
4. Run tests: `npm test`

---

## 🏗️ Tech Stack

- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript with strict mode enabled
- **Express**: Fast web framework for Node.js
- **Express Session**: Secure session middleware for persistent authentication
- **Nunjucks**: Rich templating engine with inheritance, async, and more
- **Tailwind CSS 4**: Utility-first CSS framework (latest version)
- **daisyUI 5.1.26**: Semantic component classes for Tailwind CSS
- **Lucide**: Beautiful & consistent SVG icon library with 1000+ icons
- **Axios 1.12.2**: Promise-based HTTP client for all API calls (job roles, applications, authentication)
- **Vitest**: Next generation testing framework with 242 tests and coverage
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

## 🔐 Authentication System

The application features a complete user authentication system with login and registration capabilities:

### Features
- **User Registration**: Create new accounts with email, password, and name validation
- **User Login**: Authenticate with email and password
- **Session Management**: Secure session handling with Express Session and HTTP-only cookies
- **Password Security**: Client-side and server-side password strength validation
  - Minimum 8 characters
  - Uppercase and lowercase letters required
  - Numbers and special characters required
- **Success Notifications**: Personalized toast messages showing "Logged in successfully as: [Name]"
- **Form Validation**: Real-time client-side validation with server-side backup
- **Error Handling**: Clear error messages for invalid credentials, network issues, and validation failures
- **Secure Redirects**: Prevents authenticated users from accessing login/register pages

### Authentication Flow
1. User visits `/login` or `/register`
2. Fills out form with validation feedback
3. Credentials sent to backend API (`http://localhost:8000/api/auth`)
4. On success: Session created, user redirected to homepage with success message
5. On error: Detailed error message displayed with suggestions

### Technical Implementation
- **AuthController**: Renders login and register pages, handles authentication state
- **AxiosAuthService**: Communicates with backend authentication API
- **AuthValidator**: Comprehensive validation for email, password, and name fields
- **Client-Side Handler** (`public/js/auth.js`): Form submission, validation, loading states
- **Session Storage**: Uses sessionStorage for success message persistence across redirect
- **Type Safety**: Full TypeScript models for LoginRequest, RegisterRequest, AuthSuccessResponse

### Security Features
- HTTP-only session cookies
- Secure flag in production (HTTPS)
- XSS prevention with Nunjucks autoescape
- Input sanitization on both client and server
- Password visibility toggle for better UX
- CSRF protection ready (future implementation)

### User Experience
- Beautiful gradient UI with Kainos branding
- Responsive design for mobile and desktop
- Loading spinners during authentication
- Auto-dismissible success notifications (5 seconds)
- Password visibility toggle
- Clear navigation between login and registration
- "Back to Home" link on both pages

## 🎯 Job Roles Feature

The application includes a comprehensive job roles management system with separate admin and public interfaces:

### Public Routes
- **`/`**: Enhanced home page with premium animations, hero section, interactive stat cards, and login success toast notifications
- **`/login`**: User login page with email/password authentication
- **`/register`**: User registration page with form validation and password strength requirements
- **`/about`**: About us page with company mission, values, statistics, and services overview
- **`/contact`**: Contact page with contact information, form, social media links, and office locations
- **`/job-roles`**: Premium job listings with smooth card animations and enhanced visual effects
- **`/job-roles/{id}`**: Individual job role details accessible via "View Details" button with comprehensive role information

### Admin Routes
- **`/admin/job-roles/new`**: Admin form for creating new job roles with comprehensive validation
- **`POST /admin/job-roles`**: Backend endpoint for saving new job roles to the database

### Architecture
- **JobRoleService**: Handles API communication with axios, includes fallback to mock data
- **JobRoleController**: Express route handlers for read-only operations (list, details)
- **AdminController**: Separate controller for admin operations (create, update, delete)
- **JobRoleValidator**: Comprehensive validation for all job role fields
- **JobRoleResponse**: TypeScript models for type safety
- **Dependency Injection**: Clean separation of concerns with service layer
- **View-Based Titles**: Page titles are defined directly in templates for better maintainability

### Public Features
- Display job roles with role name, location, capability, band, closing date, and status badge
- **Status Badge**: Each job card displays an "Open" (green) or "Closed" (red) badge based on job status
- **Conditional Apply Button**: "Apply Now" button is only visible for jobs with status "Open"; closed jobs hide the button for clarity
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
- Error handling with user-friendly error pages styled to match Kainos branding
- Beautiful UI combining daisyUI components with Lucide icons and custom advanced CSS animations and effects

### Admin Features
- **Job Role Creation**: Full form with validation for creating new job roles
- **Job Role Editing**: Update existing roles with pre-filled forms, orange edit buttons with 📝 emoji
- **Status Management**: Admins can change job status between "Open" and "Closed"
- **CSV Export**: Generate comprehensive reports of all job roles in CSV format for stakeholder distribution
  - One-click "Generate Report" button on job roles list page
  - Downloads timestamped CSV file with all job role information
  - Proper CSV escaping for special characters (commas, quotes, newlines)
  - Comprehensive test coverage for CSV generation and export functionality
- **Smart Validation**: Date validation allows past dates for edits, requires future dates for creation
- **Input Validation**: Client-side and server-side validation with clear error messages
- **Form Persistence**: Field values retained on validation errors
- **Loading States**: Animated spinner during submission to prevent duplicates
- **Success Confirmation**: Visual feedback after create/update operations
- **URL Validation**: Job spec link must be valid HTTP/HTTPS URL
- **Security**: Nunjucks auto-escaping enabled for XSS prevention
- **Comprehensive Testing**: Full test coverage for CRUD operations

### Known Limitations & Future Work
- **Authentication/Authorization**: Admin routes (`/admin/*`) currently have no authentication. This is intentional for MVP and will be addressed in a future PR. See `FUTURE_AUTH_IMPLEMENTATION.md` for planned approach.
- **Rate Limiting**: No rate limiting on admin endpoints yet. Consider adding `express-rate-limit` middleware in production.
- **Audit Logging**: Admin actions are not currently logged. Future implementation should track who created/modified job roles.
- **Dynamic Dropdowns**: Bands and capabilities are currently loaded from constants. Future version will fetch from backend API.
- **Integration Tests**: Currently only unit tests exist. E2E tests with Playwright/Cypress planned for future.

### Data Management
- **Primary Data**: JSON file (`src/data/job-roles.json`) with 12 diverse job roles
- **API Integration**: Attempts to fetch from backend API first
- **Graceful Fallback**: Falls back to JSON data when API is unavailable
- **Fallback Safety**: Hardcoded fallback data if JSON file fails to load


### Recent Quality Improvements
- **Admin Controller Separation**: Separated admin operations from public JobRoleController for better security and maintainability
- **Validation Constants**: Centralized all dropdown options in `job-role-validation-constants.ts` for single source of truth

## 📋 Job Application & Applicant Management

The application features a complete job application system with applicant management capabilities:

### Job Application System
- **Application Form** (`/job-roles/{id}/apply`): Full application submission with personal information, cover letter, and CV upload
- **File Upload Support**: PDF, DOC, and DOCX files up to 5MB with comprehensive validation
- **Form Validation**: Client-side and server-side validation for all fields including international names (Unicode support)
- **Error Handling**: Detailed error messages for connection issues, timeouts, and backend failures
- **Success Confirmation**: Professional confirmation page with application details and next steps

### Applicant Management System
- **Applicant Viewing** (`/job-roles/{id}/applicants`): Comprehensive applicant management interface
- **Responsive Design**: Desktop table view and mobile card layout for optimal viewing on all devices
- **Pagination Support**: Efficient browsing with page controls for large applicant lists (default 10 per page, max 50)
- **Status Tracking**: Color-coded badges for application status (submitted, reviewed, shortlisted, etc.)
- **Cover Letter Modal**: In-browser viewing of applicant cover letters with responsive modal
- **Resume Download**: Direct download links for uploaded CV files
- **Contact Integration**: One-click email contact for applicants
- **Navigation Integration**: "View Applicants" button added to job role cards for easy access

### Technical Features
- **ApplicationService Interface**: Clean service layer for application submission and retrieval
- **AxiosApplicationService**: Full backend API integration with comprehensive error handling
- **ApplicantDisplay Models**: TypeScript interfaces for type-safe applicant data handling
- **Comprehensive Testing**: 18 test cases covering all controller methods with 100% pass rate
- **Unicode Support**: International character support in name validation (e.g., "José García")
- **Application Validator**: Dedicated validation utility for all application form fields
- **Empty State Handling**: Friendly empty states when no applicants exist for a job role

### User Experience
- **Three-Button Navigation**: Job role cards now feature Details, Applicants, and Apply Now buttons
- **Breadcrumb Navigation**: Clear navigation path with job role context
- **Filter-Friendly URLs**: Clean URLs with pagination parameters (?page=1&limit=10)
- **Loading States**: Professional loading indicators during API calls
- **Error Recovery**: Helpful error messages with specific guidance for different failure scenarios
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader compatibility
- **Comprehensive Testing**: 75 tests passing including 17 new tests for AdminController (100% pass rate)
- **Template Optimization**: Reduced job-role-create.njk from 402 to 247 lines (38.6% smaller) through code refactoring
- **UX Enhancements**: Added loading spinner, success confirmation banner, and auto-dismissible alerts
- **Form Submission Protection**: Disabled form during submission to prevent duplicate job role creation
- **Success Feedback Loop**: Clear visual confirmation with celebration emoji and navigation button
- **Consistent Logo Implementation**: Unified transparent background Kainos logo with responsive sizing (h-8 for header/footer, h-16 for hero sections)
- **File Structure Cleanup**: Fixed HTML structural issues and removed duplicate content
- **CSS Class Corrections**: Resolved Tailwind class naming issues (h-10 vs h10)
- **Button Visibility**: Enhanced contrast for better accessibility and user experience
- **Cross-Page Branding**: Consistent Kainos visual identity throughout the application
- **Code Quality**: All files pass Biome formatting and linting checks with TypeScript strict mode enabled


### Template Architecture
- **View-Driven Titles**: Page titles are defined directly in Nunjucks templates rather than passed from controllers
- **Separation of Concerns**: Controllers focus on data handling, views handle presentation

## 📄 Pagination System

The application includes a comprehensive pagination system for efficient browsing of job roles:

### Features
- **12 Items Per Page**: Fixed page size optimized for readability and performance
- **Smart Page Navigation**: Previous/Next buttons, first/last page shortcuts
- **Ellipsis Display**: Shows `1 ... 6 7 [8] 9 10 ... 20` for large page sets
- **URL-Based State**: Pagination state persists in URL (`/job-roles?page=2`)
- **Loading States**: Smooth transitions with loading spinners during page changes
- **Error Handling**: Graceful handling of invalid page numbers and empty results

### API Integration
- **Backend Endpoint**: `GET /api/job-roles?page=1&limit=12`
- **Paginated Response**: Returns job roles with pagination metadata
- **Parameter Validation**: Validates page/limit parameters on both frontend and backend
- **Edge Case Handling**: Handles pages beyond available data with proper error messages

### Technical Implementation
- **PaginationRequest/Response**: TypeScript interfaces for type safety
- **Validation Utilities**: Comprehensive parameter validation with error messages
- **Reusable Components**: Nunjucks macro for consistent pagination UI across pages
- **Service Layer**: Clean separation between controller logic and API calls
- **DaisyUI Integration**: Beautiful pagination controls using DaisyUI's join components

### Usage Examples
```typescript
// Controller usage
const paginatedResult = await this.jobRoleService.getJobRolesPaginated({
  page: 1,
  limit: 12,
});

// Template usage
{{ paginationControls(pagination, '/job-roles') }}
```

### Error Handling
- **Invalid Parameters**: Returns 400 with user-friendly error message
- **Page Not Found**: Returns 404 for pages beyond available data
- **Empty Results**: Displays appropriate empty state message
- **Service Errors**: Graceful fallback with 500 error page

### Testing
- **Comprehensive Test Suite**: 100% coverage for pagination logic
- **Validation Tests**: Tests for all edge cases and invalid inputs
- **Controller Tests**: Mock-based testing for all pagination scenarios
- **Integration Ready**: Prepared for E2E tests with Playwright/Cypress

## 📊 Testing Coverage

The application maintains high test coverage with comprehensive unit tests:

### Test Statistics
- **Total Tests**: 242 (238 passing, 4 skipped)
- **Test Files**: 17 files with full coverage
- **Controller Tests**: AuthController (8 tests), UserController (3 tests), ApplicationController (18 tests), AdminController (30 tests), JobRoleController (16 tests)
- **Service Tests**: AxiosAuthService (10 tests), AxiosJobRoleService (18 tests)
- **Utility Tests**: Validation, pagination, CSV export, URL builder utilities

### Key Test Areas
- **Authentication**: Login/register page rendering, session management, error handling
- **Authorization**: Redirect logic for authenticated users
- **Form Validation**: Email format, password strength, name validation
- **API Integration**: Axios error handling, network failures, timeout scenarios
- **Service Layer**: Mock-based testing with proper error propagation
- **Edge Cases**: Invalid inputs, missing data, boundary conditions

## 🏁 Development Checklist

### For New Features
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

#### ⚠️ Biome Lint Warnings for CSS Specificity

This project intentionally uses `!important` in several CSS rules for accessibility and dark mode overrides (see `src/styles/input.css`). These are required to ensure proper focus indicators and color contrast, especially when overriding Tailwind and DaisyUI defaults.

The `noImportantStyles` rule has been disabled in `biome.json` to allow these necessary overrides. However, you may see minor specificity warnings which are expected and safe to ignore.

## 🔒 Code Quality Standards

All code must pass the following checks before committing:

### Pre-Commit Checklist
- [ ] `npm run type-check` — No TypeScript errors
- [ ] `npm run check` — Biome format & lint passes
- [ ] `npm run test:run` — All tests pass (currently 75/75)
- [ ] Manual testing of changed functionality
- [ ] Documentation updated (README, comments, etc.)

### Architecture Guidelines
- **MVC Pattern**: Controllers handle HTTP, Services contain business logic, Models define types
- **Dependency Injection**: Use constructor injection for testability
- **ES Modules**: Always use `.js` extensions in TypeScript imports
- **Type Safety**: No `any` types, enable all strict checks
- **Named Exports**: Prefer named exports over default exports
- **Error Handling**: Always wrap async controller methods in try/catch
- **Testing**: Aim for 80%+ code coverage on new code

### File Naming Conventions
- Controllers: `*-controller.ts` with corresponding `*-controller.test.ts`
- Services: `*-service.ts` 
- Models: `*-response.ts`, `*-create.ts`, etc.
- Views: `*.njk` (Nunjucks templates)
- Tests: `*.test.ts` co-located with source files

## 📚 Additional Documentation

- `FUTURE_AUTH_IMPLEMENTATION.md` - Planned authentication/authorization approach
- `BACKEND_CONNECTION_GUIDE.md` - API integration documentation
- `SWITCHING_TO_BACKEND.md` - Guide for connecting to backend API
- Project-specific instructions in `.github/instructions/` directory