# Development Environment Variables
environment  = "dev"
location     = "UK South"
project_name = "team2-job-app"

tags = {
  Environment = "dev"
  ManagedBy   = "Terraform"
  Tier        = "Development"
}

# Backend Configuration
resource_group_name  = "terraform-state-rg"
storage_account_name = "tfstateteam2"
container_name       = "aistatemgmt"
key                  = "dev.tfstate"
use_azuread_auth     = false
use_msi              = false
