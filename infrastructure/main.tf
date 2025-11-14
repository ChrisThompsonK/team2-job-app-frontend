locals {
  resource_prefix = "${var.project_name}-${var.environment}"
  common_tags = merge(var.tags, {
    Project       = var.project_name
    Environment   = var.environment
    ManagedBy     = "Terraform"
    CreatedAt     = "2025-11-14"
    TerraformRepo = "team2-job-app-frontend"
  })
}

# Create resource group
resource "azurerm_resource_group" "main" {
  name     = "${local.resource_prefix}-rg"
  location = var.location
  tags     = local.common_tags
}

