# Azure Authentication Setup for GitHub Actions

## Required Secrets

Add these 4 secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### 1. AZURE_CLIENT_ID
- **What**: Service Principal Application ID
- **How to get**:
  ```bash
  az ad sp create-for-rbac --name "github-terraform" --role Contributor
  ```
- **From output**: Copy the `appId`

### 2. AZURE_TENANT_ID
- **What**: Azure Directory (Tenant) ID
- **From above output**: Copy the `tenant`
- **Or**: `f2ec3ef9-cca6-46ec-be61-845d74fcae94`

### 3. AZURE_CLIENT_SECRET
- **What**: Service Principal Password
- **From above output**: Copy the `password`
- **⚠️ Important**: Save this immediately - it won't be shown again

### 4. AZURE_SUBSCRIPTION_ID
- **What**: Azure Subscription ID
- **How to get**: 
  ```bash
  az account list --query "[].id" -o tsv
  ```
- **Or**: `ef1b41f6-e4b2-41d0-a52d-d279af4a77ab`

## Setup Steps

### Option A: Create New Service Principal (Recommended)

```bash
# Create service principal with contributor role
az ad sp create-for-rbac \
  --name "github-terraform" \
  --role Contributor \
  --scopes "/subscriptions/ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
```

Save the output which includes:
- `appId` → AZURE_CLIENT_ID
- `password` → AZURE_CLIENT_SECRET  
- `tenant` → AZURE_TENANT_ID

### Option B: Use Existing Service Principal

If you already have a service principal:

```bash
# Reset credentials
az ad sp credential reset \
  --id <appId> \
  --append

# This will output a new password - save it for AZURE_CLIENT_SECRET
```

## Adding Secrets to GitHub

1. Go to: **Repository Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add each secret:
   - Name: `AZURE_CLIENT_ID` → Value: `<appId>`
   - Name: `AZURE_CLIENT_SECRET` → Value: `<password>`
   - Name: `AZURE_TENANT_ID` → Value: `<tenant>`
   - Name: `AZURE_SUBSCRIPTION_ID` → Value: `ef1b41f6-e4b2-41d0-a52d-d279af4a77ab`

## Verify Setup

Create a test PR to trigger the workflow:

```bash
git checkout -b test/verify-azure
git commit --allow-empty -m "test: verify Azure authentication"
git push origin test/verify-azure
```

Check the workflow run - the "Azure CLI login" step should now succeed.

## Troubleshooting

| Error | Solution |
|-------|----------|
| `Not all values are present` | One or more secrets not set in GitHub |
| `Insufficient privileges` | Service Principal doesn't have Contributor role on subscription |
| `Invalid client ID` | AZURE_CLIENT_ID value is incorrect |
| `Unauthorized_client` | Service Principal password (secret) is wrong |

## References

- [Azure Service Principal](https://learn.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
