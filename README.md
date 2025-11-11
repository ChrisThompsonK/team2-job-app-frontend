# Team 2 Job App Frontend

[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

A modern, accessible job application portal built with Node.js, TypeScript, Express, Nunjucks, Tailwind CSS, and DaisyUI.

## 🚀 Features
- **Authentication & Authorization** - Login, registration, session management, admin role controls
- **Job Management** - Browse, create, edit, delete job roles with status badges
- **Applications** - Submit with file uploads, track applicants, CSV export
- **Responsive UI** - Mobile-optimized design with accessibility features
- **Modern Stack** - TypeScript strict mode, Express, Nunjucks, Tailwind CSS, Axios
- **Quality** - 242 passing tests, Biome formatting/linting, 80%+ coverage

## 📦 Project Structure
```
src/
├── controllers/        # HTTP handlers (job roles, auth, applications)
├── services/          # Business logic & API calls (Axios)
├── middleware/        # Auth middleware & role checking
├── models/            # TypeScript interfaces & types
├── utils/             # Validators, CSV export, URL builders
├── views/             # Nunjucks templates
└── styles/            # Tailwind CSS input

public/css/           # Compiled CSS output
dist/                 # Compiled TypeScript
```

## 🛠️ Available Scripts

### Development & Build
| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |

### Testing
| Command | Purpose |
|---------|---------|
| `npm run test` | Unit tests in watch mode (Vitest) |
| `npm run test:run` | Run all unit tests once |
| `npm run test:coverage` | Generate coverage report |
| `npm run e2e` | Run E2E tests (Playwright) |
| `npm run e2e:run` | Run E2E tests with HTML report |
| `npm run e2e:ui` | Run E2E tests in UI mode |
| `npm run e2e:debug` | Run E2E tests in debug mode |
| `npm run e2e:report` | View last E2E test report |

### Code Quality
| Command | Purpose |
|---------|---------|
| `npm run type-check` | TypeScript validation |
| `npm run check` | Format + lint (run before commits) |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |

## 🔧 Quick Start

### Local Development
```bash
npm install
npm run dev           # Start local server
npm run test          # Run tests
npm run check         # Pre-commit checks
```

### Docker
```bash
docker build -t team2-job-app-frontend:v1.0.0 .
docker run -p 3000:3000 \
  -e SESSION_SECRET=your-secret-key \
  -e API_BASE_URL=http://host.docker.internal:8000 \
  team2-job-app-frontend:v1.0.0
```

See [DOCKER.md](DOCKER.md) for complete Docker documentation.

## 🏗️ Tech Stack

**Runtime & Language**: Node.js 18+, TypeScript 5.9+ (strict mode)
**Framework**: Express 5.1+, Nunjucks templates
**Frontend**: Tailwind CSS 4, DaisyUI 5.1, Lucide icons
**API**: Axios 1.12, Express Session
**Testing**: 
  - Unit/Integration: Vitest (242 tests, 80%+ coverage)
  - E2E: Playwright (cross-browser testing)
**Quality**: Biome (formatter/linter), ES Modules

## 📋 Key Features by Section

### Authentication
- Email/password login and registration
- Session-based role management (Admin/Applicant)
- Personalized success messages
- Password strength validation
- Secure HTTP-only cookies

### Job Roles (Public)
- Browse job listings with status badges
- View role details with requirements
- Apply for open positions
- Responsive card layout with animations

### Job Roles (Admin)
- Create, edit, delete job roles
- Manage role status (Open/Closed)
- CSV export for reports
- Form validation with clear errors

### Applications & Applicants
- Submit applications with file uploads (PDF, DOC, DOCX)
- View applicant list with pagination
- Download resumes and read cover letters
- Status tracking with color-coded badges

## 🧪 Testing

### Unit & Integration Tests (Vitest)
```bash
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # Coverage report
```

### End-to-End Tests (Playwright)
Playwright provides cross-browser E2E testing with:
- **Multi-browser testing**: Chromium, Firefox, WebKit
- **Mobile testing**: Pixel 5, iPhone 12 emulation
- **Screenshots & videos**: Captured on test failures
- **Trace recording**: Full trace for debugging

```bash
npm run e2e               # Run in headless mode
npm run e2e:ui            # Interactive UI mode
npm run e2e:debug         # Debug mode with inspector
npm run e2e:report        # View HTML test report
```

**E2E Test Location**: `tests/e2e/**/*.spec.ts`

## ✅ Code Quality

### Pre-Commit Checklist
- `npm run type-check` → No TypeScript errors
- `npm run check` → Biome formatting & linting passes
- `npm run test:run` → All tests pass

### Guidelines
- MVC architecture (Controllers → Services → Models)
- Dependency injection for testability
- Named exports (ES modules)
- No `any` types (TypeScript strict mode)
- Try/catch error handling in controllers
- 80%+ coverage target for new code

## 📚 Documentation
- `.github/instructions/` - Project standards & guidelines
- `docs/axios-usage-example.md` - API integration examples
- `spec/` - Feature specification documents

## 🔐 Environment Setup

Backend API runs on `http://localhost:8000/api`
Frontend dev server runs on `http://localhost:3000`

Add `.env` if needed for custom API endpoints:
```
API_BASE_URL=http://localhost:8000
```

## 📝 License
Kainos 2025
