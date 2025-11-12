#!/bin/bash

# Script to fix backend Docker environment variables and database
# This ensures the backend container gets all necessary env vars

set -e

echo "🔧 Fixing Backend Docker Setup..."
echo ""

BACKEND_DIR="${BACKEND_DIR:-../team2-job-app-backend}"

cd "$BACKEND_DIR"

echo "📂 Working in: $BACKEND_DIR"
echo ""

# Step 1: Update docker-compose.yml to use env_file
echo "📝 Step 1: Updating docker-compose.yml to load .env.docker..."

cat > docker-compose.yml << 'EOF'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: team2-job-app-backend
    ports:
      - "8000:8000"
    env_file:
      - .env.docker
    environment:
      # Override specific values for Docker
      - NODE_ENV=production
      - DATABASE_URL=/app/data/database.sqlite
    volumes:
      # Persist database data
      - db-data:/app/data
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:8000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      start_period: 5s
      retries: 3

networks:
  app-network:
    external: true

volumes:
  db-data:
    driver: local
EOF

echo "✅ docker-compose.yml updated"
echo ""

# Step 2: Stop and remove existing container
echo "🛑 Step 2: Stopping and removing old container..."
docker-compose down -v
echo ""

# Step 3: Rebuild and start
echo "🏗️  Step 3: Rebuilding and starting backend..."
docker-compose up -d --build
echo ""

# Step 4: Wait for backend to be healthy
echo "⏳ Step 4: Waiting for backend to be healthy..."
sleep 5

# Step 5: Check if backend is running
if docker ps | grep -q team2-job-app-backend; then
    echo "✅ Backend container is running!"
    echo ""
    
    # Step 6: Initialize database inside container
    echo "🗄️  Step 5: Initializing database..."
    docker exec team2-job-app-backend npm run db:push || echo "⚠️  Database schema already exists"
    echo ""
    
    echo "🌱 Step 6: Seeding database..."
    docker exec team2-job-app-backend npm run db:seed || echo "⚠️  Database might already be seeded"
    echo ""
    
    echo "✅ Backend setup complete!"
    echo ""
    echo "📋 Backend is running at: http://localhost:8000"
    echo ""
    echo "🔗 Step 7: Connecting backend to app-network..."
    docker network create app-network 2>/dev/null || echo "ℹ️  Network already exists"
    docker network connect app-network team2-job-app-backend 2>/dev/null || echo "ℹ️  Already connected"
    echo ""
    
    echo "✅ All done!"
    echo ""
    echo "Next steps:"
    echo "  1. Check backend logs: docker logs team2-job-app-backend"
    echo "  2. Test backend: curl http://localhost:8000/"
    echo "  3. Start frontend: cd ../team2-job-app-frontend && ./start-frontend.sh docker"
    echo ""
else
    echo "❌ Backend container failed to start!"
    echo "   Check logs: docker logs team2-job-app-backend"
    exit 1
fi
