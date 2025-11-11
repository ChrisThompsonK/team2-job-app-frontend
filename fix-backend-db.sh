#!/bin/bash

# Script to fix backend database issues
# Usage: ./fix-backend-db.sh

set -e

echo "🔧 Fixing Backend Database..."
echo ""

BACKEND_DIR="/Users/ryan.magee/github/Job_Application/team2-job-app-backend"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found at: $BACKEND_DIR"
    echo "   Please update the BACKEND_DIR variable in this script"
    exit 1
fi

cd "$BACKEND_DIR"

echo "📂 Working in: $BACKEND_DIR"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🗄️  Step 1: Pushing database schema..."
npm run db:push
echo ""

echo "🌱 Step 2: Seeding database with sample data..."
npm run db:seed
echo ""

echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your backend: npm run dev"
echo "   2. Start frontend: cd ../team2-job-app-frontend && ./start-frontend.sh host"
echo "   3. Check seed script output above for login credentials"
echo ""
echo "💡 Default credentials (check seed script output to confirm):"
echo "   Admin: admin@kainos.com"
echo "   User:  user@kainos.com"
echo ""
