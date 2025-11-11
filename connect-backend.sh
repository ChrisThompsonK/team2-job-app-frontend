#!/bin/bash

# Script to connect an existing backend Docker container to the app-network
# Usage: ./connect-backend.sh [backend-container-name]

set -e

BACKEND_CONTAINER="${1:-backend}"

echo "🔌 Connecting backend container to app-network"
echo ""

# Check if backend container exists and is running
if ! docker ps --format '{{.Names}}' | grep -q "^${BACKEND_CONTAINER}$"; then
    echo "❌ Error: Container '${BACKEND_CONTAINER}' is not running"
    echo ""
    echo "Available running containers:"
    docker ps --format "  - {{.Names}}"
    echo ""
    exit 1
fi

# Create network if it doesn't exist
echo "📡 Ensuring app-network exists..."
docker network create app-network 2>/dev/null && echo "✅ Created app-network" || echo "ℹ️  app-network already exists"

# Check if already connected
if docker network inspect app-network --format '{{range .Containers}}{{.Name}} {{end}}' | grep -q "${BACKEND_CONTAINER}"; then
    echo "ℹ️  Container '${BACKEND_CONTAINER}' is already connected to app-network"
else
    # Connect backend to network
    echo "🔗 Connecting '${BACKEND_CONTAINER}' to app-network..."
    docker network connect app-network "${BACKEND_CONTAINER}"
    echo "✅ Successfully connected!"
fi

echo ""
echo "📊 Network Status:"
echo ""
docker network inspect app-network --format '{{range .Containers}}  - {{.Name}} ({{.IPv4Address}}){{println}}{{end}}'

echo ""
echo "✅ Backend is ready!"
echo ""
echo "Next steps:"
echo "  1. Start frontend: ./start-frontend.sh docker"
echo "  2. Or manually: docker-compose up frontend"
echo ""
