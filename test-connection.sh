#!/bin/bash

# Test script to verify frontend-backend connectivity
# Usage: ./test-connection.sh

set -e

echo "🧪 Testing Frontend-Backend Connectivity"
echo ""

# Check if frontend container is running
if ! docker ps --format '{{.Names}}' | grep -q 'team2-job-app-frontend'; then
    echo "❌ Frontend container is not running"
    echo "   Start it with: ./start-frontend.sh"
    exit 1
fi

echo "✅ Frontend container is running"
echo ""

# Check environment variables
echo "📋 Environment Configuration:"
API_URL=$(docker exec team2-job-app-frontend sh -c 'echo $API_BASE_URL')
AUTH_URL=$(docker exec team2-job-app-frontend sh -c 'echo $AUTH_API_BASE_URL')

echo "  API_BASE_URL:      $API_URL"
echo "  AUTH_API_BASE_URL: $AUTH_URL"
echo ""

# Extract hostname from API_URL
BACKEND_HOST=$(echo "$API_URL" | sed -e 's|http[s]*://||' -e 's|:.*||')

echo "🔍 Testing connectivity to backend ($BACKEND_HOST)..."
echo ""

# Test 1: DNS Resolution
echo "Test 1: DNS Resolution"
if docker exec team2-job-app-frontend sh -c "getent hosts $BACKEND_HOST" > /dev/null 2>&1; then
    echo "  ✅ DNS resolution successful"
else
    echo "  ❌ DNS resolution failed"
    echo "     Backend host '$BACKEND_HOST' cannot be resolved"
    exit 1
fi

# Test 2: Network Connectivity (ping)
echo "Test 2: Network Connectivity"
if docker exec team2-job-app-frontend sh -c "ping -c 1 $BACKEND_HOST" > /dev/null 2>&1; then
    echo "  ✅ Network connectivity successful"
else
    echo "  ⚠️  Ping failed (may be disabled, not critical)"
fi

# Test 3: HTTP Connection
echo "Test 3: HTTP Connection"
if docker exec team2-job-app-frontend sh -c "wget -q -O- --timeout=5 $API_URL/health" > /dev/null 2>&1; then
    echo "  ✅ HTTP connection successful"
    echo "     Backend is responding at $API_URL/health"
elif docker exec team2-job-app-frontend sh -c "wget -q -O- --timeout=5 $API_URL" > /dev/null 2>&1; then
    echo "  ⚠️  Backend is reachable but /health endpoint may not exist"
else
    echo "  ❌ HTTP connection failed"
    echo "     Cannot reach backend at $API_URL"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if backend is running: docker ps | grep backend"
    echo "  2. Check network: docker network inspect app-network"
    echo "  3. Check backend logs: docker logs <backend-container>"
    exit 1
fi

# Test 4: API Endpoint Test (if backend has /api/job-roles)
echo "Test 4: API Endpoint Test"
if docker exec team2-job-app-frontend sh -c "wget -q -O- --timeout=5 $API_URL/api/job-roles" > /dev/null 2>&1; then
    echo "  ✅ API endpoint responding"
else
    echo "  ⚠️  API endpoint test skipped or failed (may require auth)"
fi

echo ""
echo "✅ Connection tests complete!"
echo ""
echo "📊 Summary:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   $API_URL"
echo ""
echo "Next steps:"
echo "  1. Open frontend: http://localhost:3000"
echo "  2. Check logs: docker-compose logs -f frontend"
echo "  3. Test login/features in browser"
echo ""
