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

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run type-check` | TypeScript validation |
| `npm run check` | Format + lint (run before commits) |

## 🔧 Quick Start
```bash
npm install
npm run dev           # Start local server
npm run test          # Run tests
npm run check         # Pre-commit checks
```

## 🐳 Docker Deployment

### Build and Run with Docker

**Build the Docker image:**
```bash
docker build -t team2-job-app-frontend:1.0.0 -t team2-job-app-frontend:latest .
```

**Run the container:**
```bash
docker run -d -p 3000:3000 \
  -e SESSION_SECRET="your-secret-key" \
  --name team2-job-app \
  team2-job-app-frontend:latest
```

**Verify it's working:**
```bash
# Check container status
docker ps | grep team2-job-app

# View logs
docker logs team2-job-app

# Test endpoint
curl http://localhost:3000
```

### Docker Image Optimization

The Docker image has been optimized using industry best practices to reduce size and improve deployment efficiency:

**Image Size Comparison**:
- Original (node:22-alpine): **334MB**
- Optimized: **320MB** (4.2% reduction)

**Optimization Techniques Applied**:
1. **Multi-stage build** - Separates build dependencies from runtime
2. **Aggressive node_modules cleanup** - Removes:
   - Documentation files (README, CHANGELOG, LICENSE, AUTHORS)
   - TypeScript source files (.ts, .tsx)
   - Test files (.test.js, .spec.js)
   - Example files and fixtures
   - Development directories (.github, docs, examples, tests, coverage)
   - Configuration files (.eslintrc, .prettierrc, jest.config)
3. **Optimized npm install flags**:
   - `--only=production` - Install only production dependencies
   - `--ignore-scripts` - Skip build scripts
   - `--omit=optional` - Skip optional dependencies
   - `--prefer-offline` - Use cached packages
4. **Environment-aware features** - Nunjucks watch mode only enabled in development
5. **Security** - Non-root user (nodejs UID 1001), read-only layers where possible

**Why Size Matters**:
- ✅ 4-5% faster deployments
- ✅ Reduced storage costs
- ✅ Quicker container pulls
- ✅ Smaller attack surface
- ✅ Faster CI/CD pipelines

### Docker Features
- **Multi-stage build**: Reduces final image size by excluding build dependencies
- **Alpine Linux**: Lightweight base image (~320MB optimized)
- **Non-root user**: Runs as `nodejs` user (UID 1001) for security
- **Health checks**: Built-in HTTP health monitoring every 30 seconds
- **Production-ready**: Optimized for production deployments
- **Environment variable**: Requires `SESSION_SECRET` in production mode

### Docker Image Versioning

We use **semantic versioning** to version Docker images pushed to ACR. This ensures production stability, enables rollbacks, and provides deployment consistency.

#### Semantic Versioning Format: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features, backwards compatible (v1.1.0)
- **PATCH**: Bug fixes, internal changes (v1.0.1)

#### Multi-Tag Strategy

Each image is pushed with **4 tags** for deployment flexibility:

```bash
# Build and push version 1.0.0
./scripts/docker-versioning.sh 1.0.0 myregistry.azurecr.io

# This creates and pushes:
# - v1.0.0    (Exact version for reproducibility)
# - v1.0      (Minor version for patch updates)
# - v1        (Major version for feature updates)
# - latest    (Latest for development/testing)
```

#### Why Multiple Tags?

| Tag | Use Case |
|-----|----------|
| `v1.0.0` | Production rollback, exact version reproducibility |
| `v1.0` | Stability with patch-level updates (auto-update fixes) |
| `v1` | Stability with minor version features |
| `latest` | Development, testing, quick deployments |

#### Quick Commands

```bash
# Release new version to ACR
./scripts/docker-versioning.sh 1.0.1 myregistry.azurecr.io

# Verify tags in ACR
az acr repository show-tags -n <registry-name> --repository team2-job-app-frontend

# Deploy specific version
docker pull myregistry.azurecr.io/team2-job-app-frontend:v1.0.0
docker run -d -p 3000:3000 -e SESSION_SECRET="secret" myregistry.azurecr.io/team2-job-app-frontend:v1.0.0

# Emergency rollback to previous version
docker pull myregistry.azurecr.io/team2-job-app-frontend:v1.0.0
```

#### Complete Guide

For detailed versioning strategies, best practices, and troubleshooting, see [`docs/docker-image-versioning.md`](./docs/docker-image-versioning.md).

## 🏗️ Tech Stack

**Runtime & Language**: Node.js 18+, TypeScript 5.9+ (strict mode)
**Framework**: Express 5.1+, Nunjucks templates
**Frontend**: Tailwind CSS 4, DaisyUI 5.1, Lucide icons
**API**: Axios 1.12, Express Session
**Testing**: Vitest (242 tests, 80%+ coverage)
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
