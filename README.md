# Team 2 Job App Frontend

[![CI/CD Pipeline](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/ci-cd-pipeline.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

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

The project uses a multi-stage GitHub Actions pipeline for continuous integration and deployment. The pipeline runs on all pushes, pull requests, and can be triggered manually via `workflow_dispatch`.

[![CI/CD Pipeline](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/ci-cd-pipeline.yml)

#### Pipeline Stages

**Stage 1: Code Quality & Linting** (`code-quality`)
Runs on every push and pull request:
- ✅ Node.js 20 setup with npm caching
- ✅ Dependency installation (`npm ci`)
- ✅ Biome format and lint checks (`npm run check`)
- ✅ TypeScript type validation (`npm run type-check`)

**Stage 2: Unit & Integration Tests** (`test`)
Runs after code quality checks pass:
- 🧪 Unit test execution (`npm run test:run`)
- 📊 Coverage report generation (`npm run test:coverage`)
- ✅ Ensures all tests pass before proceeding

**Stage 3: Build Application** (`build-app`)
Runs after tests pass:
- 🏗️ Full production build (`npm run build`)
- 📦 Compiles TypeScript and processes CSS
- ✅ Verifies application can be built successfully

**Stage 4: Build Docker Image** (`build-docker`)
Runs after successful application build:
- 🐳 Multi-stage Docker image build
- 🏷️ Smart tagging strategy (SHA, branch, latest)
- 💾 GitHub Actions cache optimization
- 🧪 Container startup health test (30s timeout)
- 📊 Build metadata and timing information

**Stage 5: Deploy to Azure Container Registry** (`deploy-to-acr`)
**Only runs on main branch pushes:**
- 🔐 Azure authentication via service principal
- 📤 Push to Azure Container Registry
- 🏷️ Tags: version + latest
- 💾 Registry-based build cache
- ✅ Image verification in ACR

#### Image Tagging Strategy

**Local Build Tags** (all branches):
```bash
team2-job-app-frontend:<git-sha>     # e.g., team2-job-app-frontend:abc1234
team2-job-app-frontend:<branch>      # e.g., team2-job-app-frontend:main
team2-job-app-frontend:latest        # Only on main branch
```

**Azure Container Registry Tags** (main branch only):
```bash
<acr-server>/job-app-frontend:<version>    # e.g., 1.0.0, pr-42
<acr-server>/job-app-frontend:latest       # Always points to latest main
```

**Tag Strategy Details:**
- **Git SHA tags**: Unique identifier for each commit, enables precise rollbacks
- **Branch tags**: Easy reference for branch-specific testing
- **Version tags**: Semantic versioning from package.json
- **PR tags**: Special tags for pull request builds (pr-{number})
- **Latest tag**: Only created for main branch builds

#### Build Performance & Optimization

| Stage | Duration (Cached) | Duration (Clean) |
|-------|------------------|------------------|
| Code Quality | ~30s | ~1 min |
| Tests | ~15s | ~30s |
| Build App | ~20s | ~45s |
| Docker Build | ~1 min | ~3 min |
| ACR Deploy | ~45s | ~1 min |

**Optimization Features:**
- ✅ GitHub Actions cache for npm dependencies
- ✅ Docker layer caching (GitHub Actions cache backend)
- ✅ Registry-based cache for ACR builds (main branch)
- ✅ Parallel job execution where possible
- ✅ Conditional deployment (main branch only)


#### Pipeline Failure Handling

**If a stage fails:**

1. ❌ Pipeline stops at the failed stage
2. 📋 Detailed logs available in GitHub Actions UI
3. 🔔 GitHub sends failure notification to commit author
4. ♻️ Previous successful builds remain available
5. 🔄 Push fixes and pipeline re-runs automatically

**Common Failure Scenarios:**

| Stage | Common Issues | Solution |
|-------|--------------|----------|
| Code Quality | Format/lint errors, type errors | Run `npm run check` and `npm run type-check` locally |
| Tests | Failing tests, coverage drops | Run `npm run test:coverage` locally to debug |
| Build | TypeScript compilation errors | Run `npm run build` to see detailed errors |
| Docker Build | Dockerfile syntax, missing files | Test build locally: `docker build -t test .` |
| ACR Deploy | Auth failures, network issues | Verify Azure credentials and ACR access |

#### Required GitHub Secrets

Configure these secrets in repository settings (`Settings > Secrets and variables > Actions`):

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `AZURE_CREDENTIALS` | Service principal JSON | See setup below |
| `AZURE_ACR_LOGIN_SERVER` | ACR login server URL | e.g., `myregistry.azurecr.io` |

**Setting Up Azure Credentials:**

```bash
# Create a service principal with ACR push permissions
az ad sp create-for-rbac \
  --name "github-actions-job-app-frontend" \
  --role "AcrPush" \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerRegistry/registries/{acr-name} \
  --sdk-auth

# Output JSON - copy entire output to AZURE_CREDENTIALS secret
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  ...
}
```

**Get ACR Login Server:**

```bash
# Get your ACR login server
az acr show --name <acr-name> --query loginServer --output tsv
# Example output: myregistry.azurecr.io
```

**Security Best Practices:**
- ✅ Use service principal with minimal permissions (AcrPush role only)
- ✅ Separate credentials per environment/project
- ✅ Rotate credentials regularly
- ✅ Never commit credentials to code
- ✅ Use GitHub encrypted secrets for storage


#### Running Pipeline Checks Locally

Validate your changes before pushing to avoid pipeline failures:

```bash
# Complete pre-commit validation
npm run check              # Format + lint
npm run type-check         # TypeScript validation
npm run test:run           # Run all tests
npm run test:coverage      # Verify coverage
npm run build              # Test production build

# Docker build test (optional)
docker build -t team2-job-app-frontend:test .
docker run -p 3000:3000 \
  -e SESSION_SECRET=test-secret \
  -e API_BASE_URL=http://localhost:8000 \
  -e AUTH_API_BASE_URL=http://localhost:8000/api/auth \
  team2-job-app-frontend:test
```

**Quick Pre-Push Checklist:**
- ✅ `npm run check` passes
- ✅ `npm run type-check` passes
- ✅ `npm run test:run` passes
- ✅ All changes committed
- ✅ Meaningful commit message

#### Monitoring Pipeline Status

**View Pipeline:**
- Navigate to `Actions` tab in GitHub repository
- Select `CI/CD Pipeline` workflow
- View individual run details

**Status Badges:**
Add to your PR descriptions or documentation:
```markdown
![CI/CD](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/ci-cd-pipeline.yml/badge.svg?branch=your-branch)
```

**Notifications:**
- GitHub automatically notifies on failures
- Configure additional notifications in repository settings
- Integration with Slack/Teams available via GitHub Apps

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

#### Verifying ACR Push Success

After merging to main, verify the image was pushed to ACR:

```bash
# List images in ACR
az acr repository list --name myacr

# List tags for an image
az acr repository show-tags --name myacr --repository team2-job-app-frontend

# Pull image from ACR
docker pull myacr.azurecr.io/team2-job-app-frontend:main-latest

# Run container from ACR
docker run -p 3000:3000 myacr.azurecr.io/team2-job-app-frontend:main-latest
```

## ☁️ Infrastructure as Code

Terraform configuration in `infrastructure/` folder with dev/prod environments.

```bash
cd infrastructure
terraform plan -var-file="terraform.dev.tfvars"
terraform apply -var-file="terraform.dev.tfvars"
```

Workflow: Plan on PRs → Apply on main branch push (via GitHub Actions)

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