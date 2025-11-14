# 🚀 QUICK START - Setup Terraform Pipeline

## ✅ Pipeline is READY - Just needs Azure auth!

Your Terraform deployment pipeline is configured and pushed to GitHub. You just need to set up Azure authentication.

## 🎯 Two Options to Set Up

### Option 1: Automated Script (EASIEST)

```bash
# Run the setup script
./.github/workflows/setup-azure-oidc.sh
```

This script will:
1. Create Azure Service Principal
2. Configure OIDC federated credentials
3. Grant storage access for Terraform state
4. Show you the GitHub secrets to add

### Option 2: Manual Setup (DETAILED)

Follow the complete guide: `.github/workflows/AZURE_OIDC_SETUP.md`

## 🔐 Required GitHub Secrets

After running the script, add these 3 secrets to your GitHub repo:

1. Go to: https://github.com/ChrisThompsonK/team2-job-app-frontend/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret:

| Secret Name | Description |
|-------------|-------------|
| `AZURE_CLIENT_ID` | Service Principal Application ID |
| `AZURE_TENANT_ID` | Azure Active Directory Tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Your Azure Subscription ID |

**OR** use GitHub CLI:
```bash
gh secret set AZURE_CLIENT_ID -b "your-client-id"
gh secret set AZURE_TENANT_ID -b "your-tenant-id"
gh secret set AZURE_SUBSCRIPTION_ID -b "your-subscription-id"
```

## 🧪 Test the Pipeline

Once secrets are added:

```bash
# Test on feature branch (plan only, no apply)
git checkout -b test/pipeline
echo "# Testing" >> README.md
git add .
git commit -m "test: pipeline"
git push origin test/pipeline

# Check: https://github.com/ChrisThompsonK/team2-job-app-frontend/actions
# You should see terraform-plan run successfully
```

## 📊 What Happens

### On any branch:
- ✅ Code quality checks
- ✅ Docker image build
- ✅ **Terraform plan** (preview)
- ⏭️ Terraform apply (skipped)

### On main branch:
- ✅ Code quality checks
- ✅ Docker image build
- ✅ **Terraform plan** (creates artifact)
- ✅ **Terraform apply** (deploys!)

## 🎯 What Gets Deployed

Currently just a simple resource group:
- **Name**: `team2-job-app-dev-rg`
- **Location**: UK South
- **Tags**: Project, Environment, ManagedBy

## ⚡ Quick Commands Reference

```bash
# Run setup script
./.github/workflows/setup-azure-oidc.sh

# Test Terraform locally
cd infrastructure
terraform fmt
terraform init
terraform plan -var-file=dev.tfvars

# Check GitHub Actions
open https://github.com/ChrisThompsonK/team2-job-app-frontend/actions

# View deployed resources
az group show --name team2-job-app-dev-rg
```

## 🆘 Troubleshooting

**Pipeline fails with "Invalid client secret"**
- Federated credentials not set up → Run setup script again

**"Failed to get storage account"**
- Service principal needs storage access → Run setup script

**Pipeline not running**
- Check GitHub secrets are set correctly
- Verify branch name matches conditional logic

## 📚 Full Documentation

- **Testing Guide**: `.github/workflows/TESTING_GUIDE.md`
- **Setup Guide**: `.github/workflows/AZURE_OIDC_SETUP.md`
- **Pipeline Reference**: `.github/workflows/TERRAFORM_PIPELINE.md`

---

**TL;DR**: Run `./.github/workflows/setup-azure-oidc.sh`, add the 3 secrets to GitHub, push a commit. Done! 🎉
