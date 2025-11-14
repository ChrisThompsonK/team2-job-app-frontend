#!/bin/bash
# terraform-init.sh - Terraform Init Script for CI/CD Pipeline
#
# Usage: ./scripts/terraform-init.sh <environment>
# Example: ./scripts/terraform-init.sh dev
#
# This script:
# - Initializes Terraform with proper backend configuration
# - Sets up remote state
# - Ready for CI/CD pipelines

set -euo pipefail

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Terraform Init - $ENVIRONMENT Environment ==="
echo ""

# Validate environment variable
if [[ ! "$ENVIRONMENT" =~ ^(dev|test|prod)$ ]]; then
    echo "❌ Error: Environment must be dev, test, or prod"
    exit 1
fi

# Check if backend config exists
if [[ ! -f "$INFRA_DIR/backend.$ENVIRONMENT.tfvars" ]]; then
    echo "❌ Error: backend.$ENVIRONMENT.tfvars file not found"
    exit 1
fi

cd "$INFRA_DIR"

echo "🔧 Initializing Terraform with $ENVIRONMENT backend configuration..."
terraform init \
    -backend-config="backend.$ENVIRONMENT.tfvars" \
    -upgrade \
    -no-color

echo ""
echo "✅ Terraform initialized successfully!"
echo ""
echo "Backend configuration:"
terraform providers
