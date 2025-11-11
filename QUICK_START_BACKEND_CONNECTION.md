# Quick Start: Connecting Frontend to Backend

This guide helps you quickly connect the frontend Docker container to your backend.

## 🚀 Three Easy Ways to Connect

### Option 1: Backend on Host Machine (Most Common)
**Scenario**: Backend running locally with `npm run dev` or `npm start` on port 8000

```bash
./start-frontend.sh host
```

**What it does**:
- Sets `API_BASE_URL=http://host.docker.internal:8000`
- Connects frontend container to host machine's localhost

**Verify backend is running**:
```bash
curl http://localhost:8000/health
```

---

### Option 2: Backend in Docker Container
**Scenario**: Backend running in another Docker container named "team2-job-app-backend"

```bash
# First, connect backend to network (if not already)
./connect-backend.sh team2-job-app-backend

# Then start frontend
./start-frontend.sh docker
```

**What it does**:
- Creates `app-network` if needed
- Connects backend container to network
- Sets `API_BASE_URL=http://team2-backend:8000`
- Starts frontend on same network

**Verify backend container**:
```bash
docker ps | grep team2-job-app-backend
```

---

### Option 3: Backend on Remote Server
**Scenario**: Backend deployed on a remote server

```bash
./start-frontend.sh remote
# Enter URL when prompted: http://your-server.com:8000
```

---

## 🧪 Test the Connection

After starting the frontend, verify everything is connected:

```bash
./test-connection.sh
```

This script checks:
- ✅ Frontend container is running
- ✅ Environment variables are set
- ✅ DNS resolution works
- ✅ HTTP connection to backend
- ✅ API endpoints respond

---

## 📋 Manual Setup (Alternative)

If you prefer manual control:

### 1. Create/Update .env file
```bash
# Copy example
cp .env.example .env

# Generate session secret
echo "SESSION_SECRET=$(openssl rand -hex 32)" >> .env

# Edit .env and set backend URL:
# For host machine:
API_BASE_URL=http://host.docker.internal:8000
AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth

# For Docker container:
API_BASE_URL=http://team2-backend:8000
AUTH_API_BASE_URL=http://team2-backend:8000/api/auth
```

### 2. Start Frontend
```bash
docker-compose up --build frontend
```

---

## 🔍 Troubleshooting

### Frontend can't connect to backend

**Check 1: Is backend running?**
```bash
# For host machine
curl http://localhost:8000/health

# For Docker container
docker ps | grep backend
docker logs backend
```

**Check 2: Network setup (Docker backend only)**
```bash
# Verify both on same network
docker network inspect app-network

# Expected: See both frontend and backend containers listed
```

**Check 3: Environment variables**
```bash
docker exec team2-job-app-frontend env | grep API_BASE_URL
```

**Check 4: View logs**
```bash
docker-compose logs -f frontend
```

### Connection refused errors

**Problem**: Backend URL is incorrect

**Solution**:
- **Host machine**: Use `http://host.docker.internal:8000`
- **Docker container**: Use `http://team2-backend:8000` (container name)
- **Remote**: Use full URL with http:// prefix

### DNS resolution failed

**Problem**: Backend container not on same network (Docker only)

**Solution**:
```bash
./connect-backend.sh backend
```

### CORS errors

**Problem**: Backend CORS not configured for frontend origin

**Solution**: Configure backend to allow `http://localhost:3000`

---

## 📊 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `./start-frontend.sh host` | Backend on host machine |
| `./start-frontend.sh docker` | Backend in Docker |
| `./start-frontend.sh remote` | Backend on remote server |
| `./connect-backend.sh` | Connect backend container to network |
| `./test-connection.sh` | Verify connectivity |
| `docker-compose up frontend` | Manual start |
| `docker-compose logs -f frontend` | View logs |
| `docker-compose down` | Stop containers |

---

## 🎯 What's Next?

1. ✅ Start frontend with chosen method
2. ✅ Run connection test: `./test-connection.sh`
3. ✅ Open browser: http://localhost:3000
4. ✅ Test login and features

---

## 📝 Environment Variables

The frontend uses these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `http://host.docker.internal:8000` | Backend API base URL |
| `AUTH_API_BASE_URL` | `http://host.docker.internal:8000/api/auth` | Auth API URL |
| `SESSION_SECRET` | *(required)* | Session encryption key (32+ chars) |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Frontend port |

---

**Need Help?** Check the full documentation in `DOCKER.md`
