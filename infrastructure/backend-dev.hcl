# Backend configuration for dev environment
resource_group_name  = "rg-terraform-state-dev"
storage_account_name = "sttfstatedev001"
container_name       = "tfstate"
key                  = "team2-job-app-frontend-dev.tfstate"
use_msi              = false
