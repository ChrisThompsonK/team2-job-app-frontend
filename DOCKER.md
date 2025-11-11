# Docker Setup Guide

This guide provides instructions for building and running the Team 2 Job App Frontend using Docker.

## 📦 Docker Image Overview

The Docker image is built using a multi-stage build process for optimization:
- **Base Image**: Node.js 18 Alpine (minimal and secure)
- **Image Size**: ~231MB
- **Security**: Runs as non-root user (`appuser`)
- **Health Check**: Built-in health monitoring
- **Production Ready**: Optimized for production deployments

## 🏗️ Building the Docker Image

### Basic Build
```bash
docker build -t team2-job-app-frontend:latest .
```

### Build with Version Tag (Recommended)
```bash
docker build -t team2-job-app-frontend:v1.0.0 .
docker tag team2-job-app-frontend:v1.0.0 team2-job-app-frontend:latest
```

### Build for Different Platforms (M1/M2 Macs)
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t team2-job-app-frontend:v1.0.0 .
```

## 🚀 Running the Container

### With Docker Compose (RECOMMENDED - Communicates with Backend)

#### Full Stack Setup (Frontend + Backend)

Place the `docker-compose.yml` file in your project root:
```bash
docker-compose up
```

This will:
- ✅ Start the backend on http://localhost:8000
- ✅ Start the frontend on http://localhost:3000
- ✅ Automatically configure backend API URLs
- ✅ Create a shared Docker network for communication
- ✅ Ensure backend is healthy before starting frontend

#### Frontend Only (Backend running separately)

```bash
cd team2-job-app-frontend
docker-compose up
```

### Basic Run (Development)

**With Backend on Docker Network**:
```bash
# Step 1: Create a Docker network
docker network create app-network

# Step 2: Start backend (if not already running)
docker run -d --name backend --network app-network -p 8000:8000 team2-job-app-backend:v1.0.0

# Step 3: Start frontend using service name
docker run -p 3000:3000 \
  --network app-network \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secret-key-here \
  -e API_BASE_URL=http://team2-backend:8000 \
  -e AUTH_API_BASE_URL=http://team2-backend:8000/api/auth \
  team2-job-app-frontend:v1.0.0
```

**With Backend on Host Machine**:
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secret-key-here \
  -e API_BASE_URL=http://host.docker.internal:8000 \
  -e AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth \
  team2-job-app-frontend:v1.0.0
```

### Run in Detached Mode (Background)
```bash
docker run -d -p 3000:3000 \
  --name team2-frontend \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secret-key-here \
  -e API_BASE_URL=http://host.docker.internal:8000 \
  -e AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth \
  team2-job-app-frontend:v1.0.0
```

### Run with Environment File
Create a `.env.docker` file:
```bash
NODE_ENV=production
SESSION_SECRET=your-secret-key-here
API_BASE_URL=http://team2-backend:8000
AUTH_API_BASE_URL=http://team2-backend:8000/api/auth
PORT=3000
```

Then run:
```bash
docker run -d -p 3000:3000 --env-file .env.docker team2-job-app-frontend:v1.0.0
```

## 🐳 Docker Compose Setup

### Using docker-compose.yml (in frontend directory)

```bash
cd team2-job-app-frontend
docker-compose up
```

### Using docker-compose.yml (in project root for full stack)

```bash
cd Job_Application
docker-compose up
```

**Full-stack docker-compose includes**:
- ✅ Frontend service
- ✅ Backend service
- ✅ Shared network (app-network)
- ✅ Database persistence
- ✅ Health checks
- ✅ Auto-restart policies
- ✅ Environment variable management

See [DOCKER_NETWORKING.md](../DOCKER_NETWORKING.md) for detailed networking setup.

## 🔧 Required Environment Variables

| Variable | Description | Docker Compose | Manual Run |
|----------|-------------|-----------------|------------|
| `NODE_ENV` | Environment mode | `production` | `production` |
| `SESSION_SECRET` | Secret key for sessions | `${SESSION_SECRET}` or hardcoded | `your-secret-key-here` |
| `API_BASE_URL` | Backend API URL | `http://team2-backend:8000` | `http://team2-backend:8000` (if networked) or `http://host.docker.internal:8000` |
| `AUTH_API_BASE_URL` | Auth API URL | `http://team2-backend:8000/api/auth` | `http://team2-backend:8000/api/auth` (if networked) |
| `PORT` | Application port (optional) | `3000` | `3000` |

### API URL Configuration Guide

**Inside Docker Network** (When backend is also in Docker):
```bash
API_BASE_URL=http://team2-backend:8000
AUTH_API_BASE_URL=http://team2-backend:8000/api/auth
```

**Host Machine** (Using Docker Desktop on Mac/Windows):
```bash
API_BASE_URL=http://host.docker.internal:8000
AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth
```

**Linux/Direct Container IP**:
```bash
# Get backend container IP first
BACKEND_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' backend)

API_BASE_URL=http://$BACKEND_IP:8000
AUTH_API_BASE_URL=http://$BACKEND_IP:8000/api/auth
```

## 🛠️ Common Docker Commands

### View Running Containers
```bash
docker ps
```

### View Container Logs
```bash
docker logs team2-frontend
docker logs -f team2-frontend  # Follow logs in real-time
```

### Stop Container
```bash
docker stop team2-frontend
```

### Remove Container
```bash
docker rm team2-frontend
```

### View Images
```bash
docker images team2-job-app-frontend
```

### Remove Image
```bash
docker rmi team2-job-app-frontend:v1.0.0
```

### Access Container Shell
```bash
docker exec -it team2-frontend sh
```

### Check Container Health
```bash
docker inspect --format='{{json .State.Health}}' team2-frontend
```

## 📊 Image Optimization Features

### Multi-Stage Build
The Dockerfile uses a multi-stage build to minimize image size:
1. **deps**: Installs production dependencies only
2. **builder**: Builds the application (TypeScript compilation, CSS processing)
3. **runner**: Final lightweight image with only necessary files

### Security Features
- ✅ Runs as non-root user (`appuser` with UID 1001)
- ✅ Minimal Alpine Linux base image
- ✅ Only production dependencies included
- ✅ No development files or tests in final image

### .dockerignore
The `.dockerignore` file excludes unnecessary files from the build context:
- `node_modules` (rebuilt in container)
- Test files and reports
- Documentation and markdown files
- Git history and IDE files
- Log files and temporary data

## 🐳 Docker Compose (Optional)

Create a `docker-compose.yml` for easier orchestration:

```yaml
version: '3.8'

services:
  frontend:
    image: team2-job-app-frontend:v1.0.0
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=your-secret-key-here
      - API_BASE_URL=http://team2-backend:8000
      - AUTH_API_BASE_URL=http://team2-backend:8000/api/auth
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: team2-job-app-backend:v1.0.0
    ports:
      - "8000:8000"
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## 📝 Best Practices

### Version Tagging
Always use semantic versioning for production images:
```bash
docker tag team2-job-app-frontend:latest team2-job-app-frontend:v1.0.0
```

**Never use `:latest` in production!**

### Image Registry
Push to a registry for deployment:
```bash
# GitHub Container Registry
docker tag team2-job-app-frontend:v1.0.0 ghcr.io/username/team2-job-app-frontend:v1.0.0
docker push ghcr.io/username/team2-job-app-frontend:v1.0.0

# Docker Hub
docker tag team2-job-app-frontend:v1.0.0 username/team2-job-app-frontend:v1.0.0
docker push username/team2-job-app-frontend:v1.0.0
```

### Security Scanning
Scan images for vulnerabilities:
```bash
docker scan team2-job-app-frontend:v1.0.0
```

## 🔍 Troubleshooting

### Container Won't Start
Check logs:
```bash
docker logs team2-frontend-test
```

### Cannot Connect to Backend
**Symptom**: API requests fail, connection refused

**Solution**:
1. Verify backend is running:
   ```bash
   docker ps | grep backend
   ```

2. Check if they're on the same network:
   ```bash
   docker inspect team2-job-app-frontend | grep -A 5 "Networks"
   docker inspect team2-job-app-backend | grep -A 5 "Networks"
   ```

3. Test connectivity from frontend container:
   ```bash
   docker exec -it team2-job-app-frontend curl http://team2-backend:8000/health
   ```

4. Verify environment variables:
   ```bash
   docker exec team2-job-app-frontend env | grep API_BASE_URL
   ```

### Port Already in Use
Change the host port:
```bash
docker run -p 3001:3000 team2-job-app-frontend:v1.0.0
```

### Build Fails
Clear Docker cache and rebuild:
```bash
docker builder prune
docker build --no-cache -t team2-job-app-frontend:v1.0.0 .
```

### Docker Desktop (Mac/Windows) Network Issues
If using `host.docker.internal`:
```bash
# Verify the backend is accessible
docker run -it --rm team2-job-app-frontend:v1.0.0 \
  sh -c "curl http://host.docker.internal:8000/health"
```

### Compose File Issues
Validate docker-compose syntax:
```bash
docker-compose config
docker-compose up --no-start  # Check for errors without starting
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Security](https://docs.docker.com/engine/security/)
