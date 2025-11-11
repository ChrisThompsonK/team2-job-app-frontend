#!/bin/bash

# Frontend Startup Script for Different Backend Scenarios
# Usage: ./start-frontend.sh [option]
# Options: host | docker | remote

set -e

OPTION="${1:-host}"

echo "🚀 Starting Frontend with Backend Option: $OPTION"
echo ""

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update SESSION_SECRET!"
    echo ""
fi

# Check for SESSION_SECRET
if ! grep -q "^SESSION_SECRET=" .env 2>/dev/null || grep -q "^SESSION_SECRET=your-secret" .env 2>/dev/null; then
    echo "⚠️  Generating SESSION_SECRET..."
    SECRET=$(openssl rand -hex 32)
    if grep -q "^SESSION_SECRET=" .env; then
        # Update existing SESSION_SECRET
        sed -i.bak "s/^SESSION_SECRET=.*/SESSION_SECRET=$SECRET/" .env && rm .env.bak
    else
        # Add SESSION_SECRET
        echo "SESSION_SECRET=$SECRET" >> .env
    fi
    echo "✅ SESSION_SECRET generated and added to .env"
    echo ""
fi

case $OPTION in
    host)
        echo "📡 Scenario: Backend running on host machine (localhost:8000)"
        echo ""
        echo "Environment variables:"
        echo "  API_BASE_URL=http://host.docker.internal:8000"
        echo "  AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth"
        echo ""
        
        # Update .env for Docker
        sed -i.bak 's|^API_BASE_URL=.*|API_BASE_URL=http://host.docker.internal:8000|' .env
        sed -i.bak 's|^AUTH_API_BASE_URL=.*|AUTH_API_BASE_URL=http://host.docker.internal:8000/api/auth|' .env
        rm -f .env.bak
        
        echo "✅ Starting frontend container..."
        docker-compose up --build frontend
        ;;
        
    docker)
        echo "🐳 Scenario: Backend in separate Docker container named 'team2-backend'"
        echo ""
        echo "Environment variables:"
        echo "  API_BASE_URL=http://team2-backend:8000"
        echo "  AUTH_API_BASE_URL=http://team2-backend:8000/api/auth"
        echo ""
        
        # Check if backend container exists
        if ! docker ps --format '{{.Names}}' | grep -q '^team2-job-app-backend$'; then
            echo "⚠️  Warning: No container named 'team2-job-app-backend' found running."
            echo "   Make sure your backend container is:"
            echo "   1. Running: docker ps | grep team2-job-app-backend"
            echo "   2. On network 'app-network': docker network connect app-network team2-job-app-backend"
            echo ""
        fi
        
        # Ensure network exists
        docker network create app-network 2>/dev/null || true
        
        # Update .env for Docker network
        sed -i.bak 's|^API_BASE_URL=.*|API_BASE_URL=http://team2-backend:8000|' .env
        sed -i.bak 's|^AUTH_API_BASE_URL=.*|AUTH_API_BASE_URL=http://team2-backend:8000/api/auth|' .env
        rm -f .env.bak
        
        echo "✅ Starting frontend container..."
        docker-compose up --build frontend
        ;;
        
    remote)
        echo "🌐 Scenario: Backend on remote server"
        echo ""
        read -p "Enter backend URL (e.g., http://your-server.com:8000): " BACKEND_URL
        
        if [ -z "$BACKEND_URL" ]; then
            echo "❌ Error: Backend URL cannot be empty"
            exit 1
        fi
        
        echo ""
        echo "Environment variables:"
        echo "  API_BASE_URL=$BACKEND_URL"
        echo "  AUTH_API_BASE_URL=$BACKEND_URL/api/auth"
        echo ""
        
        # Update .env for remote server
        sed -i.bak "s|^API_BASE_URL=.*|API_BASE_URL=$BACKEND_URL|" .env
        sed -i.bak "s|^AUTH_API_BASE_URL=.*|AUTH_API_BASE_URL=$BACKEND_URL/api/auth|" .env
        rm -f .env.bak
        
        echo "✅ Starting frontend container..."
        docker-compose up --build frontend
        ;;
        
    *)
        echo "❌ Invalid option: $OPTION"
        echo ""
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  host     - Backend running on host machine (default)"
        echo "  docker   - Backend in separate Docker container"
        echo "  remote   - Backend on remote server"
        echo ""
        exit 1
        ;;
esac
