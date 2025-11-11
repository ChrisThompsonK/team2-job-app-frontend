#!/bin/bash

##############################################################################
# Docker Image Versioning Script
# Implements semantic versioning for Docker images pushed to ACR
#
# Usage:
#   ./scripts/docker-versioning.sh <version> [registry-url]
#
# Examples:
#   ./scripts/docker-versioning.sh 1.0.0
#   ./scripts/docker-versioning.sh 1.0.0 myregistry.azurecr.io
#
# Semantic Versioning Format: MAJOR.MINOR.PATCH
#   - MAJOR: Breaking changes (v2.0.0)
#   - MINOR: New features, backwards compatible (v1.3.0)
#   - PATCH: Bug fixes (v1.2.4)
##############################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="team2-job-app-frontend"
VERSION="${1:-1.0.0}"
REGISTRY="${2:-myregistry.azurecr.io}"

# Validate version format (MAJOR.MINOR.PATCH)
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Error: Invalid version format. Use MAJOR.MINOR.PATCH (e.g., 1.0.0)${NC}"
  exit 1
fi

# Parse version components
MAJOR=$(echo "$VERSION" | cut -d. -f1)
MINOR=$(echo "$VERSION" | cut -d. -f2)
PATCH=$(echo "$VERSION" | cut -d. -f3)

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Docker Image Semantic Versioning & Push to ACR          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Configuration:${NC}"
echo "  Image Name: $IMAGE_NAME"
echo "  Full Version: $VERSION"
echo "  Registry: $REGISTRY"
echo "  MAJOR: $MAJOR"
echo "  MINOR: $MINOR"
echo "  PATCH: $PATCH"
echo ""

# Step 1: Build the image
echo -e "${YELLOW}Step 1: Building Docker image...${NC}"
docker build -t "$IMAGE_NAME:$VERSION" .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build successful${NC}"
else
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
fi

echo ""

# Step 2: Tag with all semantic version variants
echo -e "${YELLOW}Step 2: Tagging image with semantic versions...${NC}"

# Tag with full version (v1.2.3)
docker tag "$IMAGE_NAME:$VERSION" "$REGISTRY/$IMAGE_NAME:v$VERSION"
echo -e "${GREEN}✓ Tagged: $REGISTRY/$IMAGE_NAME:v$VERSION${NC}"

# Tag with MAJOR.MINOR (v1.2)
docker tag "$IMAGE_NAME:$VERSION" "$REGISTRY/$IMAGE_NAME:v$MAJOR.$MINOR"
echo -e "${GREEN}✓ Tagged: $REGISTRY/$IMAGE_NAME:v$MAJOR.$MINOR${NC}"

# Tag with MAJOR (v1)
docker tag "$IMAGE_NAME:$VERSION" "$REGISTRY/$IMAGE_NAME:v$MAJOR"
echo -e "${GREEN}✓ Tagged: $REGISTRY/$IMAGE_NAME:v$MAJOR${NC}"

# Tag with latest
docker tag "$IMAGE_NAME:$VERSION" "$REGISTRY/$IMAGE_NAME:latest"
echo -e "${GREEN}✓ Tagged: $REGISTRY/$IMAGE_NAME:latest${NC}"

echo ""

# Step 3: Display all tags
echo -e "${YELLOW}Step 3: All image tags:${NC}"
docker images "$REGISTRY/$IMAGE_NAME" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo ""

# Step 4: Push to ACR
echo -e "${YELLOW}Step 4: Pushing tags to ACR...${NC}"
echo "Make sure you're authenticated with ACR using: az acr login --name <registry-name>"
echo ""

# Push all tags
for tag in "v$VERSION" "v$MAJOR.$MINOR" "v$MAJOR" "latest"; do
  echo -e "${BLUE}Pushing $REGISTRY/$IMAGE_NAME:$tag${NC}"
  docker push "$REGISTRY/$IMAGE_NAME:$tag"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Push successful: $REGISTRY/$IMAGE_NAME:$tag${NC}"
  else
    echo -e "${RED}✗ Push failed: $REGISTRY/$IMAGE_NAME:$tag${NC}"
    echo "Verify you're authenticated and have access to the registry."
  fi
  echo ""
done

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Image versioning and push complete!             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Pushed versions:${NC}"
echo "  • $REGISTRY/$IMAGE_NAME:v$VERSION  (Full version)"
echo "  • $REGISTRY/$IMAGE_NAME:v$MAJOR.$MINOR (Major.Minor)"
echo "  • $REGISTRY/$IMAGE_NAME:v$MAJOR       (Major)"
echo "  • $REGISTRY/$IMAGE_NAME:latest    (Latest)"
echo ""

echo -e "${YELLOW}To verify tags in ACR, run:${NC}"
echo -e "  ${BLUE}az acr repository show -n <registry-name> --repository $IMAGE_NAME${NC}"
echo ""

echo -e "${YELLOW}To pull and run a specific version:${NC}"
echo -e "  ${BLUE}docker pull $REGISTRY/$IMAGE_NAME:v$MAJOR.$MINOR${NC}"
echo -e "  ${BLUE}docker run -d -p 3000:3000 -e SESSION_SECRET=\"your-secret\" $REGISTRY/$IMAGE_NAME:v$MAJOR.$MINOR${NC}"
echo ""
