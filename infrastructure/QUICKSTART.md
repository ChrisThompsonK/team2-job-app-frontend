# Terraform Quick Reference Guide

## Quick Commands

### Initialize (first time or after backend config changes)
```bash
terraform init -backend-config=backend-dev.hcl
```

### Plan (see what will change)
```bash
terraform plan -var-file="terraform.dev.tfvars"
```

### Apply (deploy changes)
```bash
terraform apply -var-file="terraform.dev.tfvars"
```

### Destroy (tear down infrastructure)
```bash
terraform destroy -var-file="terraform.dev.tfvars"
```

### Format code
```bash
terraform fmt -recursive
```

### Validate configuration
```bash
terraform validate
```

### View outputs
```bash
terraform output
terraform output web_app_url
```

## Environment-Specific Commands

### Dev Environment
```bash
# Set credentials
export ARM_CLIENT_ID="xxx"
export ARM_CLIENT_SECRET="xxx"
export ARM_SUBSCRIPTION_ID="xxx"
export ARM_TENANT_ID="xxx"
export TF_VAR_session_secret="xxx"

# Initialize and deploy
terraform init -backend-config=backend-dev.hcl
terraform plan -var-file="terraform.dev.tfvars"
terraform apply -var-file="terraform.dev.tfvars"
```

### Prod Environment
```bash
# Use same credentials as dev (or different service principal)
# Initialize and deploy
terraform init -backend-config=backend-prod.hcl
terraform plan -var-file="terraform.prod.tfvars"
terraform apply -var-file="terraform.prod.tfvars"
```

## Common Tasks

### Update Application Settings
1. Modify `terraform.dev.tfvars` or `terraform.prod.tfvars`
2. Run plan to review: `terraform plan -var-file="terraform.dev.tfvars"`
3. Apply changes: `terraform apply -var-file="terraform.dev.tfvars"`

### Change Docker Image Tag
```bash
terraform apply -var-file="terraform.dev.tfvars" -var="docker_image_tag=v1.2.3"
```

### Get ACR Credentials
```bash
terraform output -raw acr_admin_username
terraform output -raw acr_admin_password
```

### Get Web App URL
```bash
terraform output web_app_url
```

## Troubleshooting

### State is locked
```bash
terraform force-unlock <LOCK_ID>
```

### Re-initialize after moving state
```bash
terraform init -reconfigure -backend-config=backend-dev.hcl
```

### Import existing resource
```bash
terraform import azurerm_resource_group.main /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}
```

### Refresh state
```bash
terraform refresh -var-file="terraform.dev.tfvars"
```

## Pipeline Triggers

### Automatic Plan (on PR or branch push)
- Triggered on push to any branch
- Runs terraform plan only
- No resources created

### Automatic Apply (on main push)
- Triggered on push to main branch
- Runs terraform plan and apply
- Deploys to production

### Manual Trigger
- Go to Actions → Terraform Infrastructure → Run workflow
- Select environment: dev or prod
- Select action: plan, apply, or destroy
- Click "Run workflow"

## Safety Checklist

Before running `terraform apply`:
- [ ] Reviewed terraform plan output
- [ ] Confirmed correct environment (dev/prod)
- [ ] Verified sensitive variables are set
- [ ] Checked for resource deletions (marked with -)
- [ ] Notified team if prod changes
- [ ] Have rollback plan ready

## Required GitHub Secrets

For CI/CD pipeline:
- `AZURE_CREDENTIALS` - Service principal JSON
- `ARM_CLIENT_ID` - Service principal app ID
- `ARM_CLIENT_SECRET` - Service principal password  
- `ARM_SUBSCRIPTION_ID` - Azure subscription ID
- `ARM_TENANT_ID` - Azure tenant ID
- `SESSION_SECRET` - Application session secret

## Resource Naming Convention

Format: `{resource-type}-{project}-{environment}-{region}`

Examples:
- `rg-team2-jobapp-dev-uks` (Resource Group)
- `acrteam2jobappdevuks` (Container Registry - no hyphens)
- `asp-team2-jobapp-dev-uks` (App Service Plan)
- `app-team2-jobapp-frontend-dev-uks` (Web App)
