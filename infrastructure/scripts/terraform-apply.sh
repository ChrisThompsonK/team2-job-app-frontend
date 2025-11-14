#!/bin/bash
# terraform-apply.sh - Terraform Apply Script for CI/CD Pipeline
#
# Usage: ./scripts/terraform-apply.sh <environment> [plan_file]
# Example: ./scripts/terraform-apply.sh dev tfplan-dev
#
# This script:
# - Applies a previously created Terraform plan
# - Requires the plan file to exist
# - Outputs results for logging

set -euo pipefail

ENVIRONMENT=${1:-dev}
PLAN_FILE=${2:-"tfplan-$ENVIRONMENT"}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Terraform Apply - $ENVIRONMENT Environment ==="
echo ""

# Validate environment variable
if [[ ! "$ENVIRONMENT" =~ ^(dev|test|prod)$ ]]; then
    echo "❌ Error: Environment must be dev, test, or prod"
    exit 1
fi

# Check if plan file exists
if [[ ! -f "$INFRA_DIR/$PLAN_FILE" ]]; then
    echo "❌ Error: Plan file not found: $PLAN_FILE"
    exit 1
fi

cd "$INFRA_DIR"

echo "🚀 Applying Terraform plan: $PLAN_FILE"
terraform apply \
    -lock=true \
    -lock-timeout=5m \
    "$PLAN_FILE"

echo ""
echo "✅ Apply completed successfully!"
echo ""
echo "Outputs:"
terraform output
