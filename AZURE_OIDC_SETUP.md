# Azure CLI Login Fix - GitHub OIDC Setup

## Issue Fixed
The Azure CLI login was failing because the GitHub secrets (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`) weren't configured in the repository.

## Solution Implemented
Updated workflows to use **OIDC (OpenID Connect) federated credentials** instead of storing secrets. This is:
- ✅ More secure (no secrets stored in GitHub)
- ✅ Better for automation
- ✅ Follows Microsoft best practices

## What Changed

Added to both workflows:
```yaml
permissions:
  id-token: write

env:
  ARM_USE_OIDC: true
```

This enables the Azure Terraform provider and Azure CLI to authenticate using GitHub's OIDC token.

## Setup Steps

### Step 1: Create Service Principal with OIDC

```bash
# Create Service Principal
az ad sp create-for-rbac \
  --name "github-terraform-sp" \
  --role Contributor \
  --scopes "/subscriptions/ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
```

Save the output - you'll need the `appId` and `tenantId`.

### Step 2: Configure Federated Credential

```bash
# Get the Service Principal object ID
SP_OBJECT_ID=$(az ad sp show \
  --id <appId-from-step-1> \
  --query id -o tsv)

# Create federated credential for GitHub
az identity federated-credential create \
  --name "github-terraform" \
  --identity-name $SP_OBJECT_ID \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:ChrisThompsonK/team2-job-app-frontend:ref:refs/heads/TerraformAutoPrep" \
  --resource-group "terraform-state-rg"
```

### Step 3: Add GitHub Secrets

Set these in **Repository Settings → Secrets and variables → Actions**:

1. **AZURE_CLIENT_ID**
   - Value: `<appId>` from Step 1

2. **AZURE_TENANT_ID**
   - Value: `<tenantId>` from Step 1

3. **AZURE_SUBSCRIPTION_ID**
   - Value: `ef1b41f6-e4b2-41d0-a52d-d279af4a77ab`

> Note: Even with OIDC, you still need to set these three secrets. The OIDC token will be used instead of storing credentials.

### Step 4: Test

Create a test PR to trigger the workflow:
```bash
git checkout -b test/terraform-login
git commit --allow-empty -m "test: verify terraform login"
git push origin test/terraform-login
```

Create a PR and check if the "Azure CLI login" step passes.

## Troubleshooting

### Still seeing login errors?
1. Verify the secrets are set correctly in GitHub
2. Check that `AZURE_SUBSCRIPTION_ID` is correct
3. Ensure the Service Principal has Contributor role on the subscription
4. Verify federated credential is created for the correct GitHub repository/branch

### Secrets not visible in Actions?
1. Go to: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret one by one

## Alternative: Using Secrets (Less Secure)

If OIDC setup is too complex, you can use basic authentication:

```bash
# Create Service Principal with password
az ad sp create-for-rbac \
  --name "github-terraform-sp" \
  --role Contributor \
  --scopes "/subscriptions/ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
```

Then set in GitHub Secrets:
- `AZURE_CLIENT_ID` = appId
- `AZURE_TENANT_ID` = tenantId
- `AZURE_CLIENT_SECRET` = password
- `AZURE_SUBSCRIPTION_ID` = subscription ID

Remove `ARM_USE_OIDC: true` from workflows if using this method.

## References

- [Azure OIDC with GitHub Actions](https://learn.microsoft.com/en-us/azure/developers/github/connect-from-azure)
- [GitHub OIDC Token](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Azure CLI Authentication](https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli)

## Current Status

✅ Workflows updated for OIDC support  
⏳ Waiting for GitHub secrets to be configured  
⏳ Test run pending

Once secrets are set, the Azure CLI login will work automatically in CI/CD pipelines.
