module "resource_group" {
  source   = "./modules/resource-group"
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Resource group for remote state (optional, can reuse main RG)
# ...existing code...

terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-mgmt"
    storage_account_name = "aistatemgmt"
    container_name       = "terraform-tfstate-ai"
    key                  = "team2-job-app-frontend.tfstate"
  }
}

