# Testing the Terraform Pipeline

## Prerequisites
Before testing, you MUST complete Azure OIDC setup (see `AZURE_OIDC_SETUP.md`):
- [ ] Service Principal created
- [ ] Federated credentials configured
- [ ] GitHub secrets added: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`

## Quick Syntax Check (Local)

```bash
# Validate YAML syntax
cat .github/workflows/code-quality.yml | grep -E "^[a-zA-Z]" | head -20

# Check Terraform locally
cd infrastructure
terraform fmt -check
terraform init
terraform validate
terraform plan -var-file=dev.tfvars
```

## Test 1: Terraform Plan on Feature Branch (Read-Only)

**What this tests**: Plan runs without applying changes.

```bash
# Create test branch
git checkout -b test/terraform-plan-only

# Make a trivial change to trigger workflow
echo "# Testing Terraform plan" >> README.md

# Commit and push
git add .
git commit -m "test: verify terraform plan works"
git push origin test/terraform-plan-only
```

**Expected Result**:
- ✅ `code-quality` job passes
- ✅ `docker-build` job passes
- ✅ `terraform-plan` job runs and shows plan
- ❌ `terraform-apply` job **SKIPPED** (not main branch)

**Where to check**:
1. Go to: https://github.com/ChrisThompsonK/team2-job-app-frontend/actions
2. Click on your commit
3. Verify terraform-plan shows "Create resource group"
4. Verify terraform-apply shows as "Skipped"

---

## Test 2: Terraform Plan on Pull Request

**What this tests**: Same as Test 1 but via PR.

```bash
# Using the branch from Test 1, create PR via GitHub UI or:
gh pr create --title "Test Terraform Pipeline" --body "Testing plan-only execution"
```

**Expected Result**:
- ✅ All jobs run except terraform-apply
- ✅ Plan output visible in PR checks
- ✅ Can review infrastructure changes before merge

---

## Test 3: Full Deployment on Main Branch

**What this tests**: Complete plan + apply workflow.

**⚠️ WARNING**: This will **CREATE REAL AZURE RESOURCES** (resource group).

```bash
# Merge your test branch to main
git checkout main
git pull origin main
git merge test/terraform-plan-only
git push origin main
```

**Expected Result**:
- ✅ `code-quality` passes
- ✅ `docker-build` passes  
- ✅ `terraform-plan` creates plan
- ✅ `terraform-apply` **RUNS** and deploys resource group

**Verify deployment**:
```bash
# Check in Azure Portal or CLI
az group show --name team2-job-app-frontend-dev-rg
```

Should see your resource group with tags:
- Project: team2-job-app-frontend
- Environment: dev
- ManagedBy: Terraform

---

## Test 4: Verify State Management

**What this tests**: Terraform state is properly stored in Azure.

```bash
# Check state file exists
az storage blob list \
  --account-name aistatemgmt \
  --container-name terraform-tfstate-ai \
  --output table | grep team2-job-app-frontend
```

**Expected**: Should see `team2-job-app-frontend.tfstate` file.

---

## Test 5: Idempotency Check

**What this tests**: Re-running doesn't create duplicates.

```bash
# Push another commit to main
git checkout main
echo "# Testing idempotency" >> README.md
git add .
git commit -m "test: verify terraform idempotency"
git push origin main
```

**Expected Result**:
- ✅ terraform-plan shows "No changes"
- ✅ terraform-apply succeeds with no modifications

---

## Troubleshooting Failed Tests

### ❌ Terraform Plan Fails: "Error: Invalid client secret"
**Fix**: Federated credentials not set up correctly.
```bash
# Re-run OIDC setup from AZURE_OIDC_SETUP.md
# Verify subject matches: repo:ChrisThompsonK/team2-job-app-frontend:*
```

### ❌ Terraform Init Fails: "Failed to get storage account"
**Fix**: Service principal needs storage access.
```bash
az role assignment create \
  --assignee <AZURE_CLIENT_ID> \
  --role "Storage Blob Data Contributor" \
  --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/terraform-state-mgmt/providers/Microsoft.Storage/storageAccounts/aistatemgmt
```

### ❌ Terraform Apply Skipped on Main
**Fix**: Check the conditional logic.
```bash
# Verify you're actually on main branch
git branch --show-current

# Check GitHub Actions logs for condition evaluation
```

### ❌ Format Check Fails
**Fix**: Run terraform fmt locally first.
```bash
cd infrastructure
terraform fmt -recursive
git add .
git commit -m "fix: terraform formatting"
git push
```

---

## Cleanup After Testing

```bash
# Destroy test infrastructure (if you want)
cd infrastructure
terraform destroy -var-file=dev.tfvars -auto-approve

# Delete test branch
git branch -d test/terraform-plan-only
git push origin --delete test/terraform-plan-only
```

---

## Success Checklist

After running all tests, you should have:
- ✅ Plan runs on feature branches (no apply)
- ✅ Plan runs on pull requests (no apply)
- ✅ Plan + Apply runs on main branch
- ✅ Resource group created in Azure
- ✅ State file stored in Azure Storage
- ✅ GitHub Actions shows clear summaries
- ✅ No duplicate resources on re-run

**If all checked**: 🎉 Your pipeline works perfectly!
