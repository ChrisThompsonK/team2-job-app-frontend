#!/bin/bash
set -e

# Azure Service Principal Setup Script for GitHub Actions
# This script creates a service principal for Terraform deployments

echo "🚀 Azure Service Principal Setup for GitHub Actions"
echo "====================================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   brew install azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo "❌ Not logged into Azure. Please run: az login"
    exit 1
fi

# Get current subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)

echo "✅ Logged into Azure"
echo "   Subscription: $SUBSCRIPTION_NAME"
echo "   ID: $SUBSCRIPTION_ID"
echo ""

# Configuration
APP_NAME="github-actions-terraform-sp"

echo "📝 Configuration:"
echo "   Service Principal: $APP_NAME"
echo "   Scope: Subscription"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Create Service Principal
echo ""
echo "Creating Service Principal..."
SP_OUTPUT=$(az ad sp create-for-rbac \
    --name "$APP_NAME" \
    --role Contributor \
    --scopes /subscriptions/$SUBSCRIPTION_ID \
    --sdk-auth)

echo "✅ Service Principal created"
echo ""

# Grant Storage Access
echo "Granting Storage Access for Terraform State..."
APP_ID=$(echo $SP_OUTPUT | jq -r '.clientId')
STORAGE_ACCOUNT_ID=$(az storage account show \
    --name aistatemgmt \
    --resource-group terraform-state-mgmt \
    --query id -o tsv 2>/dev/null)

if [ -n "$STORAGE_ACCOUNT_ID" ]; then
    az role assignment create \
        --assignee $APP_ID \
        --role "Storage Blob Data Contributor" \
        --scope $STORAGE_ACCOUNT_ID 2>/dev/null || echo "   (role may already exist)"
    echo "✅ Storage access granted"
else
    echo "⚠️  Storage account 'aistatemgmt' not found"
fi
echo ""

# Display GitHub Secret
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "🔐 Add this secret to your GitHub repository:"
echo "   https://github.com/ChrisThompsonK/team2-job-app-frontend/settings/secrets/actions"
echo ""
echo "Secret Name: AZURE_CREDENTIALS"
echo ""
echo "Secret Value (copy everything below):"
echo "-----------------------------------"
echo "$SP_OUTPUT"
echo "-----------------------------------"
echo ""
echo "Or use GitHub CLI:"
echo ""
echo "gh secret set AZURE_CREDENTIALS --body '$SP_OUTPUT'"
echo ""
echo "🎉 Once secret is added, push a commit to trigger the pipeline!"
