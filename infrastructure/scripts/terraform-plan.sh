#!/bin/bash
# terraform-plan.sh - Terraform Plan Script for CI/CD Pipeline
# 
# Usage: ./scripts/terraform-plan.sh <environment>
# Example: ./scripts/terraform-plan.sh dev
#
# This script:
# - Validates Terraform configuration
# - Formats code
# - Creates a plan for review
# - Saves the plan for apply stage

set -euo pipefail

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Terraform Plan - $ENVIRONMENT Environment ==="
echo ""

# Validate environment variable
if [[ ! "$ENVIRONMENT" =~ ^(dev|test|prod)$ ]]; then
    echo "❌ Error: Environment must be dev, test, or prod"
    exit 1
fi

# Check if tfvars file exists
if [[ ! -f "$INFRA_DIR/$ENVIRONMENT.tfvars" ]]; then
    echo "❌ Error: $ENVIRONMENT.tfvars file not found"
    exit 1
fi

cd "$INFRA_DIR"

echo "📋 Step 1: Initializing Terraform..."
terraform init -backend-config="backend.$ENVIRONMENT.tfvars" -upgrade

echo ""
echo "🔍 Step 2: Validating Terraform configuration..."
terraform validate

echo ""
echo "📝 Step 3: Formatting Terraform code..."
terraform fmt -recursive

echo ""
echo "📊 Step 4: Creating Terraform plan..."
terraform plan \
    -var-file="$ENVIRONMENT.tfvars" \
    -out="tfplan-$ENVIRONMENT" \
    -lock=true

echo ""
echo "✅ Plan created: tfplan-$ENVIRONMENT"
echo "📂 Location: $INFRA_DIR/tfplan-$ENVIRONMENT"
echo ""
echo "Next step: Review the plan, then run:"
echo "  terraform apply tfplan-$ENVIRONMENT"
