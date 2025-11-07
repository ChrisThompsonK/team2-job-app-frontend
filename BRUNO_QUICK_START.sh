#!/bin/bash

# Bruno Integration Tests - Quick Start
# This script helps you run Bruno integration tests quickly

echo "🧪 Bruno Integration Tests - Quick Start"
echo "========================================"
echo ""

# Check if Bruno CLI is installed
if ! command -v bru &> /dev/null
then
    echo "⚠️  Bruno CLI not found. Installing @usebruno/cli..."
    npm install
fi

echo "📋 Available Commands:"
echo ""
echo "  1. Run all integration tests:"
echo "     npm run test:integration"
echo ""
echo "  2. Run health check only:"
echo "     npm run test:integration:health"
echo ""
echo "  3. Run login tests only:"
echo "     npm run test:integration:login"
echo ""
echo "  4. Run with verbose output:"
echo "     npm run test:integration:verbose"
echo ""
echo "  5. Run specific test file:"
echo "     npx bru run bruno/health-check.bru"
echo ""
echo "========================================"
echo ""
echo "🚀 Prerequisites:"
echo "  - Frontend server running: npm run dev"
echo "  - Backend API running (optional)"
echo ""

# Ask user what they want to run
read -p "Would you like to run the tests now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "🔍 Running integration tests..."
    echo ""
    npm run test:integration
fi
