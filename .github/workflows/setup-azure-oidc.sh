#!/bin/bash
set -e

# Azure OIDC Setup Script for GitHub Actions
# This script automates the setup of Azure Service Principal with OIDC for Terraform deployments

echo "🚀 Azure OIDC Setup for GitHub Actions"
echo "======================================="
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
GITHUB_ORG="ChrisThompsonK"
GITHUB_REPO="team2-job-app-frontend"

echo "📝 Configuration:"
echo "   Service Principal: $APP_NAME"
echo "   GitHub Repo: $GITHUB_ORG/$GITHUB_REPO"
echo ""

read -p "Continue with this configuration? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Step 1: Create Service Principal
echo ""
echo "Step 1: Creating Service Principal..."
SP_OUTPUT=$(az ad sp create-for-rbac \
    --name "$APP_NAME" \
    --role Contributor \
    --scopes /subscriptions/$SUBSCRIPTION_ID \
    --sdk-auth 2>&1)

if [ $? -ne 0 ]; then
    echo "⚠️  Service Principal may already exist, attempting to get existing..."
    APP_ID=$(az ad sp list --display-name "$APP_NAME" --query "[0].appId" -o tsv)
else
    APP_ID=$(echo $SP_OUTPUT | jq -r '.clientId')
fi

TENANT_ID=$(az account show --query tenantId -o tsv)

echo "✅ Service Principal ready"
echo "   Client ID: $APP_ID"
echo "   Tenant ID: $TENANT_ID"
echo ""

# Step 2: Create Federated Credentials
echo "Step 2: Creating Federated Credentials..."

# For main branch
echo "   Creating credential for main branch..."
az ad app federated-credential create \
    --id $APP_ID \
    --parameters "{
        \"name\": \"github-actions-main\",
        \"issuer\": \"https://token.actions.githubusercontent.com\",
        \"subject\": \"repo:$GITHUB_ORG/$GITHUB_REPO:ref:refs/heads/main\",
        \"audiences\": [\"api://AzureADTokenExchange\"]
    }" 2>/dev/null || echo "   (main credential may already exist)"

# For pull requests
echo "   Creating credential for pull requests..."
az ad app federated-credential create \
    --id $APP_ID \
    --parameters "{
        \"name\": \"github-actions-pr\",
        \"issuer\": \"https://token.actions.githubusercontent.com\",
        \"subject\": \"repo:$GITHUB_ORG/$GITHUB_REPO:pull_request\",
        \"audiences\": [\"api://AzureADTokenExchange\"]
    }" 2>/dev/null || echo "   (PR credential may already exist)"

# For all branches
echo "   Creating credential for all branches..."
az ad app federated-credential create \
    --id $APP_ID \
    --parameters "{
        \"name\": \"github-actions-branches\",
        \"issuer\": \"https://token.actions.githubusercontent.com\",
        \"subject\": \"repo:$GITHUB_ORG/$GITHUB_REPO:ref:refs/heads/*\",
        \"audiences\": [\"api://AzureADTokenExchange\"]
    }" 2>/dev/null || echo "   (branch credential may already exist)"

echo "✅ Federated credentials configured"
echo ""

# Step 3: Grant Storage Access
echo "Step 3: Granting Storage Access for Terraform State..."
STORAGE_ACCOUNT_ID=$(az storage account show \
    --name aistatemgmt \
    --resource-group terraform-state-mgmt \
    --query id -o tsv 2>/dev/null)

if [ -n "$STORAGE_ACCOUNT_ID" ]; then
    az role assignment create \
        --assignee $APP_ID \
        --role "Storage Blob Data Contributor" \
        --scope $STORAGE_ACCOUNT_ID 2>/dev/null || echo "   (role assignment may already exist)"
    echo "✅ Storage access granted"
else
    echo "⚠️  Storage account 'aistatemgmt' not found. You may need to create it or grant access manually."
fi
echo ""

# Step 4: Display GitHub Secrets
echo "=========================================="
echo "✅ Azure OIDC Setup Complete!"
echo "=========================================="
echo ""
echo "🔐 Add these secrets to your GitHub repository:"
echo "   https://github.com/$GITHUB_ORG/$GITHUB_REPO/settings/secrets/actions"
echo ""
echo "Secret Name             | Value"
echo "------------------------|--------------------------------------"
echo "AZURE_CLIENT_ID         | $APP_ID"
echo "AZURE_TENANT_ID         | $TENANT_ID"
echo "AZURE_SUBSCRIPTION_ID   | $SUBSCRIPTION_ID"
echo ""
echo "📋 Copy and paste commands:"
echo ""
echo "gh secret set AZURE_CLIENT_ID -b \"$APP_ID\""
echo "gh secret set AZURE_TENANT_ID -b \"$TENANT_ID\""
echo "gh secret set AZURE_SUBSCRIPTION_ID -b \"$SUBSCRIPTION_ID\""
echo ""
echo "Or add manually via GitHub UI."
echo ""
echo "🎉 Once secrets are added, push a commit to trigger the pipeline!"
