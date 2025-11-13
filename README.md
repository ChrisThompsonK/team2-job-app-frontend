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

#### Quick Start with Docker Compose (Recommended)

For full-stack setup (frontend + backend):
```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

This will:
- ✅ Start backend on http://localhost:8000
- ✅ Start frontend on http://localhost:3000
- ✅ Automatically configure backend API URLs
- ✅ Create a shared Docker network for communication

#### Build and Run Manually

```bash
# Build the image
docker build -t team2-job-app-frontend:latest .

# Run with backend on Docker network
docker network create app-network
docker run -p 3000:3000 \
  --network app-network \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secret-key \
  -e API_BASE_URL=http://team2-backend:8000 \
  -e AUTH_API_BASE_URL=http://team2-backend:8000/api/auth \
  team2-job-app-frontend:latest

# Run with backend on host machine
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secret-key \
  -e API_BASE_URL=http://host.docker.internal:8000 \
  -e AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth \
  team2-job-app-frontend:latest
```

#### Docker Features

- ✅ **Multi-stage build** - Optimized for production (~231MB)
- ✅ **Minimal base image** - Node.js 18 Alpine
- ✅ **Security** - Runs as non-root user (appuser:1001)
- ✅ **Health checks** - Built-in health monitoring
- ✅ **Production ready** - Only production dependencies included

#### Required Environment Variables

| Variable | Description | Docker Compose | Manual Run |
|----------|-------------|----------------|------------|
| `NODE_ENV` | Environment mode | `production` | `production` |
| `SESSION_SECRET` | Secret key for sessions | Set in compose | `your-secret-key` |
| `API_BASE_URL` | Backend API URL | `http://team2-backend:8000` | See examples above |
| `AUTH_API_BASE_URL` | Auth API URL | `http://team2-backend:8000/api/auth` | See examples above |

#### API URL Configuration

**Inside Docker Network** (backend also in Docker):
```bash
API_BASE_URL=http://team2-backend:8000
AUTH_API_BASE_URL=http://team2-backend:8000/api/auth
```

**Host Machine** (Docker Desktop on Mac/Windows):
```bash
API_BASE_URL=http://host.docker.internal:8000
AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth
```

#### Troubleshooting

```bash
# View logs
docker logs team2-frontend

# Check health status
docker inspect --format='{{json .State.Health}}' team2-frontend

# Access container shell
docker exec -it team2-frontend sh

# Test backend connectivity from container
docker exec -it team2-frontend curl http://team2-backend:8000/health

# Rebuild without cache
docker build --no-cache -t team2-job-app-frontend:latest .
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The project uses GitHub Actions for continuous integration and deployment on all branches:

#### Jobs Overview

**1. Code Quality Checks** (`code-quality`)
Runs on every push and pull request:
- ✅ TypeScript type checking
- ✅ Biome format validation
- ✅ Biome linting checks
- ✅ Unit tests with coverage
- ✅ Production build verification
- ✅ Uploads coverage reports (7-day retention)
- ✅ Uploads build artifacts (7-day retention)

**2. Docker Build** (`docker-build`)
Runs after quality checks pass:
- 🐳 Builds Docker container image
- 🏷️ Multi-tag strategy (SHA, branch, latest)
- 💾 Layer caching for faster builds
- ✅ Container startup validation
- 📊 Build information display

#### Image Tagging Strategy

Every build creates multiple tags for flexibility:

```bash
team2-job-app-frontend:abc1234        # Git SHA (always created)
team2-job-app-frontend:main           # Branch name (always created)
team2-job-app-frontend:latest         # Latest stable (main branch only)
team2-job-app-frontend:uptGitignore   # Feature branches (sanitized name)
```

**Tag Purposes:**
- **Git SHA** (`abc1234`): Unique identifier for each commit, enables rollback
- **Branch name** (`main`, `feature-login`): Easy reference for branch-specific builds
- **`latest`**: Only on main branch, represents the most recent stable version

#### Build Performance

| Metric | Cold Build | Cached Build |
|--------|-----------|--------------|
| **Duration** | ~2-3 minutes | ~30-60 seconds |
| **Cache Strategy** | GitHub Actions cache | Layer reuse |
| **Timeout** | 10 minutes | 10 minutes |

**Optimization Features:**
- GitHub Actions cache for Docker layers (`cache-from: type=gha`)
- Multi-stage Dockerfile reduces final image size
- Parallel job execution when possible

#### Failure Handling

If the Docker build fails:

1. ❌ The workflow stops and marks the check as **failed**
2. 📋 Build logs are available in the GitHub Actions UI
3. 🧪 Container startup test provides immediate feedback
4. ♻️ Previous successful images remain available
5. 🔔 GitHub sends notification to commit author

**Common Failure Scenarios:**
- Dockerfile syntax errors
- Missing dependencies in build stage
- Container startup failures
- Health check timeouts

#### Running CI Checks Locally

Before pushing, run the same checks locally to catch issues early:

```bash
# Code quality checks
npm run type-check        # TypeScript validation
npm run check             # Biome format + lint
npm run test:run          # All unit tests
npm run build             # Production build

# Docker build (replicates CI)
docker build -t team2-job-app-frontend:local .
docker run -p 3000:3000 team2-job-app-frontend:local

# Test image startup
docker ps | grep team2-job-app-frontend
```

#### Workflow File Location

`.github/workflows/code-quality.yml`

#### Future Enhancements

- 🔐 Image vulnerability scanning (Trivy/Snyk)
- 📦 Push to Azure Container Registry
- 🔏 Image signing for security
- 🚀 Automated deployment to staging/production
- 📊 Performance metrics collection

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
Kainos 2025 !!