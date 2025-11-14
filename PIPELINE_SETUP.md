# 🚀 QUICK START - Setup Terraform Pipeline

## ✅ Pipeline is READY - Just needs Azure auth!

Your Terraform deployment pipeline is configured and pushed to GitHub. You just need one Azure secret.

## 🎯 Setup in 2 Steps

### Step 1: Run Setup Script

```bash
./.github/workflows/setup-azure-oidc.sh
```

This creates an Azure Service Principal and shows you the JSON to add to GitHub.

### Step 2: Add GitHub Secret

1. Go to: https://github.com/ChrisThompsonK/team2-job-app-frontend/settings/secrets/actions
2. Click "New repository secret"
3. Name: `AZURE_CREDENTIALS`
4. Value: Paste the JSON from the script output

**OR** use GitHub CLI:
```bash
# The script will show you the exact command to run
gh secret set AZURE_CREDENTIALS --body '<json-from-script>'
```

## ✅ That's It!

Once the secret is added, the pipeline works automatically:

- **Any branch push** → Terraform plan (preview)
- **Main branch push** → Terraform plan + apply (deploys!)

## 🧪 Test It

```bash
# Test on feature branch
git checkout -b test/pipeline
echo "# Test" >> README.md
git add . && git commit -m "test: pipeline"
git push origin test/pipeline

# Check GitHub Actions
open https://github.com/ChrisThompsonK/team2-job-app-frontend/actions
```

## 📊 What Happens

**Feature branches:**
- ✅ Terraform plan shows preview
- ⏭️ Terraform apply skipped

**Main branch:**
- ✅ Terraform plan creates deployment plan
- ✅ Terraform apply deploys infrastructure!

## 🎯 What Gets Deployed

Simple resource group to start:
- Name: `team2-job-app-dev-rg`
- Location: UK South  
- Tags: Project, Environment, ManagedBy

## ⚡ Quick Commands

```bash
# Setup
./.github/workflows/setup-azure-oidc.sh

# Test locally
cd infrastructure
terraform init
terraform plan -var-file=dev.tfvars

# View GitHub Actions
open https://github.com/ChrisThompsonK/team2-job-app-frontend/actions
```

## 🆘 Troubleshooting

**"Failed to get storage account"**
→ Service principal needs storage access (script handles this)

**Pipeline not running**
→ Check AZURE_CREDENTIALS secret is set

**Terraform fails**
→ Check the JSON secret is complete and valid

---

**KISS**: One script, one secret, done! 🎉
