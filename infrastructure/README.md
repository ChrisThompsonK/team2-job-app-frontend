# Terraform Infrastructure - team2-job-app-frontend

This directory contains Infrastructure as Code (IaC) for deploying and managing Azure resources for the team2-job-app-frontend project.

## 📋 Prerequisites

- Terraform >= 1.0
- Azure CLI installed and authenticated
- Access to Azure subscription: `AI-Platform-Academy-2025`
- Service Principal credentials for CI/CD pipelines

## 🏗️ Directory Structure

```
infrastructure/
├── main.tf                 # Main resource definitions
├── versions.tf            # Provider versions and backend configuration
├── variables.tf           # Input variables with validation
├── outputs.tf             # Output values
├── dev.tfvars            # Development environment variables
├── prod.tfvars           # Production environment variables
├── backend.dev.tfvars    # Dev backend configuration
├── backend.prod.tfvars   # Prod backend configuration
├── .gitignore            # Git ignore patterns for Terraform files
├── modules/              # Reusable Terraform modules
│   └── resource-group/   # Resource Group module
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── scripts/              # Automation scripts for CI/CD
    ├── terraform-init.sh
    ├── terraform-plan.sh
    └── terraform-apply.sh
```

## 🚀 Quick Start

### Local Development

Initialize Terraform for the dev environment:

```bash
cd infrastructure
terraform init -backend-config="backend.dev.tfvars"
```

Plan infrastructure changes:

```bash
terraform plan -var-file="dev.tfvars"
```

Apply the infrastructure:

```bash
terraform apply -var-file="dev.tfvars"
```

### Using Scripts

Make scripts executable:

```bash
chmod +x infrastructure/scripts/*.sh
```

Initialize:

```bash
./infrastructure/scripts/terraform-init.sh dev
```

Plan changes:

```bash
./infrastructure/scripts/terraform-plan.sh dev
```

Apply changes:

```bash
./infrastructure/scripts/terraform-apply.sh dev tfplan-dev
```

## 🔐 Remote State

Terraform state is stored remotely in Azure Storage Account `tfstateteam2`:

- **Storage Account**: `tfstateteam2`
- **Container**: `terraform-state`
- **Dev State**: `dev.tfstate`
- **Prod State**: `prod.tfstate`
- **State Locking**: Enabled for concurrent operation safety

### State File Access

View current state:

```bash
terraform state list
terraform state show <resource>
```

### Backend Configuration

Backend credentials are configured via `backend.{environment}.tfvars`:

```hcl
resource_group_name  = "terraform-state-rg"
storage_account_name = "tfstateteam2"
container_name       = "terraform-state"
key                  = "dev.tfstate"
```

## 📦 Modules

### resource-group

A reusable module for creating Azure Resource Groups with consistent naming and tagging.

**Inputs:**
- `name`: Resource group name (required)
- `location`: Azure region (required)
- `tags`: Resource tags (optional)

**Outputs:**
- `id`: Resource group ID
- `name`: Resource group name
- `location`: Resource location

**Usage:**

```hcl
module "resource_group" {
  source = "./modules/resource-group"

  name     = "my-rg"
  location = "UK South"
  tags = {
    Environment = "dev"
  }
}
```

## 🔄 Workflow

### Development (Feature Branch)

1. Create a feature branch
2. Modify Terraform files in `infrastructure/`
3. Push to GitHub
4. Automated workflow:
   - `terraform fmt` check
   - `terraform validate`
   - `terraform plan` with PR comment

### Production (Main Branch)

1. Create Pull Request to `main`
2. Review plan from automated workflow
3. Merge to `main` when approved
4. Automated workflow:
   - `terraform plan`
   - `terraform apply -auto-approve`
   - Deployment to production

## 📊 Environments

### Development (dev)

- **State File**: `dev.tfstate`
- **Variables File**: `dev.tfvars`
- **Container Registry SKU**: Basic
- **App Service SKU**: B1
- **Tags**: `Environment=dev, Tier=Development`

### Production (prod)

- **State File**: `prod.tfstate`
- **Variables File**: `prod.tfvars`
- **Container Registry SKU**: Premium
- **App Service SKU**: P1V2
- **Tags**: `Environment=prod, Tier=Production`

## 🛠️ Common Commands

### Planning

```bash
# Plan with dev environment
terraform plan -var-file="dev.tfvars"

# Plan with specific target
terraform plan -target="module.resource_group" -var-file="dev.tfvars"

# Save plan for review
terraform plan -var-file="dev.tfvars" -out="tfplan-dev"
```

### Applying

```bash
# Apply with auto-approval (use cautiously!)
terraform apply -auto-approve -var-file="dev.tfvars"

# Apply saved plan
terraform apply "tfplan-dev"

# Apply specific target
terraform apply -target="module.resource_group" -var-file="dev.tfvars"
```

### State Management

```bash
# List resources in state
terraform state list

# Show specific resource
terraform state show module.resource_group

# Force unlock (use only if necessary!)
terraform force-unlock <lock-id>
```

### Code Quality

```bash
# Format all Terraform files
terraform fmt -recursive

# Validate configuration
terraform validate

# Format check (fail if needs formatting)
terraform fmt -check -recursive
```

## 🔐 Authentication

### Local Development

Authenticate with Azure CLI:

```bash
az login
az account set --subscription "AI-Platform-Academy-2025"
```

### CI/CD Pipelines

Pipelines use Service Principal authentication via GitHub Secrets:

- `AZURE_CLIENT_ID`: Service Principal client ID
- `AZURE_TENANT_ID`: Azure tenant ID
- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID
- `AZURE_CLIENT_SECRET`: Service Principal secret (optional, using workload identity)

## 📝 Variable Conventions

### Environment-Specific Variables

Use environment tfvars files for values that change per environment:

```bash
# dev.tfvars
environment         = "dev"
container_registry_sku = "Basic"
app_service_sku     = "B1"
```

### Global Variables

Define in `variables.tf` with sensible defaults:

```hcl
variable "project_name" {
  default = "team2-job-app"
}

variable "location" {
  default = "UK South"
}
```

## 🏷️ Tagging Strategy

All resources include standard tags:

- **Project**: Project name
- **Environment**: dev/test/prod
- **ManagedBy**: "Terraform"
- **CreatedAt**: Creation date
- **TerraformRepo**: Repository name

## 🔍 Validation & Linting

Automated checks:

1. **Format Check**: `terraform fmt -check`
2. **Syntax Validation**: `terraform validate`
3. **Module Validation**: All module variables validated
4. **State Locking**: Prevents concurrent modifications

## 📚 Learning Resources

- [Terraform Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest)
- [Terraform Modules Documentation](https://www.terraform.io/language/modules)
- [Azure Resource Group Documentation](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)

## ❓ Troubleshooting

### State Lock Issues

```bash
# View locks
terraform force-unlock <lock-id>
```

### Authentication Errors

```bash
# Re-authenticate with Azure
az logout
az login --tenant "f2ec3ef9-cca6-46ec-be61-845d74fcae94"
```

### Provider Issues

```bash
# Upgrade providers
terraform init -upgrade

# Check provider versions
terraform providers
```

## 📞 Support

For infrastructure changes or issues, contact the platform team or create a GitHub issue.

---

**Last Updated**: 2025-11-14  
**Terraform Version**: >= 1.0  
**Provider**: HashiCorp Azure (azurerm) >= 3.0
