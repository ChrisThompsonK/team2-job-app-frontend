# Terraform Infrastructure Documentation

## Overview

This directory contains Terraform configuration for deploying the Team 2 Job Application Frontend to Azure. The infrastructure is designed to support multiple environments (dev, prod) with environment-specific configurations.

## Architecture

The Terraform configuration creates the following Azure resources:

- **Resource Group**: Container for all resources
- **Azure Container Registry (ACR)**: Stores Docker images
- **App Service Plan**: Hosts the web application
- **Linux Web App**: Runs the containerized Node.js frontend
- **Application Insights** (optional): Monitoring and analytics
- **Log Analytics Workspace** (optional): Log aggregation and analysis

## File Structure

```
infrastructure/
├── backend.tf                 # Backend and provider configuration
├── backend-dev.hcl           # Dev environment backend config
├── backend-prod.hcl          # Prod environment backend config
├── main.tf                   # Main resource definitions
├── variables.tf              # Variable definitions
├── outputs.tf                # Output definitions
├── terraform.dev.tfvars      # Dev environment values
├── terraform.prod.tfvars     # Prod environment values
└── README.md                 # This file
```

## Prerequisites

### 1. Azure Subscription and Service Principal

You need an Azure subscription and a service principal for Terraform to authenticate with Azure.

#### Create a Service Principal

```bash
# Login to Azure
az login

# Set your subscription
az account set --subscription="<SUBSCRIPTION_ID>"

# Create service principal
az ad sp create-for-rbac \
  --name "terraform-sp-team2-jobapp" \
  --role="Contributor" \
  --scopes="/subscriptions/<SUBSCRIPTION_ID>"
```

This will output:
```json
{
  "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "displayName": "terraform-sp-team2-jobapp",
  "password": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

Save these values as they're needed for:
- `ARM_CLIENT_ID` = appId
- `ARM_CLIENT_SECRET` = password
- `ARM_TENANT_ID` = tenant
- `ARM_SUBSCRIPTION_ID` = your subscription ID

### 2. Create Remote State Storage

Before running Terraform, create storage for the remote state:

```bash
# Variables
RESOURCE_GROUP_NAME="rg-terraform-state-dev"
STORAGE_ACCOUNT_NAME="sttfstatedev001"
CONTAINER_NAME="tfstate"
LOCATION="uksouth"

# Create resource group
az group create \
  --name $RESOURCE_GROUP_NAME \
  --location $LOCATION

# Create storage account
az storage account create \
  --name $STORAGE_ACCOUNT_NAME \
  --resource-group $RESOURCE_GROUP_NAME \
  --location $LOCATION \
  --sku Standard_LRS \
  --encryption-services blob

# Create blob container
az storage container create \
  --name $CONTAINER_NAME \
  --account-name $STORAGE_ACCOUNT_NAME
```

Repeat for production:
```bash
RESOURCE_GROUP_NAME="rg-terraform-state-prod"
STORAGE_ACCOUNT_NAME="sttfstateprod001"
# ... repeat commands above
```

### 3. Install Terraform

Install Terraform CLI (version 1.0 or higher):

```bash
# macOS
brew install terraform

# Windows (with Chocolatey)
choco install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

## Local Development

### Initialize Terraform

```bash
cd infrastructure

# For dev environment
terraform init -backend-config=backend-dev.hcl

# For prod environment
terraform init -backend-config=backend-prod.hcl
```

### Set Environment Variables

```bash
# Export Azure credentials
export ARM_CLIENT_ID="<service-principal-app-id>"
export ARM_CLIENT_SECRET="<service-principal-password>"
export ARM_SUBSCRIPTION_ID="<subscription-id>"
export ARM_TENANT_ID="<tenant-id>"

# Export sensitive variables
export TF_VAR_session_secret="your-secure-session-secret"
```

### Plan Changes

```bash
# Dev environment
terraform plan -var-file="terraform.dev.tfvars"

# Prod environment
terraform plan -var-file="terraform.prod.tfvars"
```

### Apply Changes

```bash
# Dev environment
terraform apply -var-file="terraform.dev.tfvars"

# Prod environment
terraform apply -var-file="terraform.prod.tfvars"
```

### Destroy Resources

```bash
# Dev environment
terraform destroy -var-file="terraform.dev.tfvars"

# Prod environment
terraform destroy -var-file="terraform.prod.tfvars"
```

## CI/CD Pipeline

### GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. **AZURE_CREDENTIALS**: JSON output from service principal creation
   ```json
   {
     "clientId": "<ARM_CLIENT_ID>",
     "clientSecret": "<ARM_CLIENT_SECRET>",
     "subscriptionId": "<ARM_SUBSCRIPTION_ID>",
     "tenantId": "<ARM_TENANT_ID>"
   }
   ```

2. **ARM_CLIENT_ID**: Service principal app ID
3. **ARM_CLIENT_SECRET**: Service principal password
4. **ARM_SUBSCRIPTION_ID**: Azure subscription ID
5. **ARM_TENANT_ID**: Azure tenant ID
6. **SESSION_SECRET**: Secure session secret for the application

### Pipeline Behavior

- **Pull Requests**: Runs `terraform plan` only
- **Push to branches**: Runs `terraform plan` only
- **Push to main**: Runs `terraform plan` and `terraform apply` (auto-deploys to prod)
- **Manual trigger**: Allows selection of environment and action (plan/apply/destroy)

### Running the Pipeline

#### Automatic (Push to main)
```bash
git checkout main
git merge develop
git push origin main
# Pipeline automatically runs plan and apply for prod
```

#### Manual Trigger
1. Go to GitHub Actions
2. Select "Terraform Infrastructure" workflow
3. Click "Run workflow"
4. Choose environment (dev/prod)
5. Choose action (plan/apply/destroy)
6. Click "Run workflow"

## Environment Configuration

### Development (dev)
- **Purpose**: Testing and development
- **App Service Plan**: B1 (Basic)
- **ACR SKU**: Basic
- **Always On**: Disabled
- **Monitoring**: Enabled (30-day retention)

### Production (prod)
- **Purpose**: Production workloads
- **App Service Plan**: P1v2 (Premium)
- **ACR SKU**: Standard
- **Always On**: Enabled
- **Monitoring**: Enabled (90-day retention)

## Variables

Key variables that can be customized:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `environment` | Environment name (dev/prod) | - | Yes |
| `project_name` | Project name for resource naming | team2-jobapp | No |
| `location` | Azure region | UK South | No |
| `app_service_plan_sku` | App Service Plan tier | B1 (dev), P1v2 (prod) | No |
| `api_base_url` | Backend API URL | - | Yes |
| `session_secret` | Express session secret | - | Yes |

## Outputs

After deployment, Terraform outputs important information:

```bash
# View all outputs
terraform output

# View specific output
terraform output web_app_url

# Get sensitive outputs
terraform output -raw acr_admin_password
```

Key outputs:
- `web_app_url`: URL of the deployed application
- `acr_login_server`: Docker registry URL
- `acr_admin_username/password`: ACR credentials

## Troubleshooting

### Backend Initialization Failed
```bash
# Check if storage account exists
az storage account show --name sttfstatedev001

# Re-create if needed
az storage account create --name sttfstatedev001 --resource-group rg-terraform-state-dev --location uksouth --sku Standard_LRS
```

### Authentication Errors
```bash
# Verify service principal
az login --service-principal \
  -u $ARM_CLIENT_ID \
  -p $ARM_CLIENT_SECRET \
  --tenant $ARM_TENANT_ID

# Check permissions
az role assignment list --assignee $ARM_CLIENT_ID
```

### State Lock Issues
```bash
# Force unlock (use with caution)
terraform force-unlock <LOCK_ID>
```

## Best Practices

1. **Never commit secrets**: Use environment variables or Azure Key Vault
2. **Always run plan first**: Review changes before applying
3. **Use workspaces or separate state files**: For environment isolation
4. **Tag resources**: For cost tracking and organization
5. **Enable state locking**: Prevent concurrent modifications
6. **Regular backups**: Back up Terraform state files
7. **Version control**: Keep infrastructure code in Git

## Security Considerations

1. **Service Principal**: Use least privilege principle
2. **State File**: Contains sensitive data - secure the storage account
3. **Secrets**: Use Azure Key Vault for production secrets
4. **Network Security**: Consider adding VNet integration and private endpoints
5. **Managed Identity**: Web App uses system-assigned managed identity

## Adding New Environments

To add a new environment (e.g., staging):

1. Create `backend-staging.hcl`:
   ```hcl
   resource_group_name  = "rg-terraform-state-staging"
   storage_account_name = "sttfstatestaging001"
   container_name       = "tfstate"
   key                  = "team2-job-app-frontend-staging.tfstate"
   ```

2. Create `terraform.staging.tfvars` with environment-specific values

3. Update `variables.tf` validation if needed:
   ```hcl
   validation {
     condition     = contains(["dev", "staging", "prod"], var.environment)
     error_message = "Environment must be dev, staging, or prod."
   }
   ```

4. Update GitHub Actions workflow to include staging

## Support

For issues or questions:
- Check Azure Portal for resource status
- Review Terraform logs: `terraform plan -detailed-exitcode`
- Check GitHub Actions logs for pipeline failures
- Contact the DevOps team for service principal issues
