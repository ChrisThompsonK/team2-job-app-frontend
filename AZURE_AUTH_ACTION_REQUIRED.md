# Azure Authentication - Action Required ⚠️

## Current Status
The GitHub Actions workflows are ready but **failing because GitHub secrets are not configured**.

## ❌ Error
```
Error: Login failed with Error: Using auth-type: SERVICE_PRINCIPAL. 
Not all values are present. Ensure 'client-id' and 'tenant-id' are supplied.
```

## ✅ Solution - Add GitHub Secrets

You must add **4 secrets** to the repository:

### Step 1: Create Service Principal (if you don't have one)

Run this command locally:
```bash
az ad sp create-for-rbac \
  --name "github-terraform" \
  --role Contributor \
  --scopes "/subscriptions/ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
```

**Save the output** - it contains:
- `appId` - your CLIENT_ID
- `password` - your CLIENT_SECRET (won't be shown again!)
- `tenant` - your TENANT_ID

### Step 2: Add Secrets to GitHub

Go to: **Repository Settings → Secrets and variables → Actions**

Click **New repository secret** and add:

| Secret Name | Value |
|------------|-------|
| `AZURE_CLIENT_ID` | appId from above |
| `AZURE_CLIENT_SECRET` | password from above |
| `AZURE_TENANT_ID` | tenant from above |
| `AZURE_SUBSCRIPTION_ID` | `ef1b41f6-e4b2-41d0-a52d-d279af4a77ab` |

**⚠️ IMPORTANT**: Copy the password immediately - Azure won't show it again!

### Step 3: Verify (Optional)

To verify the Service Principal has the right permissions:
```bash
az role assignment list \
  --assignee <appId> \
  --query "[].roleDefinitionName" -o tsv
```

Should output: `Contributor`

## What Happens After Secrets Are Set

Once the 4 secrets are configured in GitHub:

1. **Next PR** will trigger the workflow
2. **Azure CLI login** step will succeed
3. **Terraform plan** will run
4. **Plan output** will appear in PR comments

## Current Workflow Changes

✅ Workflows updated to use service principal auth  
✅ Using `az login` command instead of action  
✅ Terraform configured to work with Azure credentials  
⏳ Waiting for secrets to be added to GitHub  

## Files Changed

- `.github/workflows/terraform-plan-dev.yml` - Updated Azure CLI login
- `.github/workflows/terraform-apply-dev.yml` - Updated Azure CLI login
- `AZURE_SETUP.md` - Complete setup instructions

---

**Next Step**: Add the 4 secrets to GitHub Actions secrets

Once done, the workflows will work automatically! 🚀
