# Backend configuration for prod environment (future use)
resource_group_name  = "rg-terraform-state-prod"
storage_account_name = "sttfstateprod001"
container_name       = "tfstate"
key                  = "team2-job-app-frontend-prod.tfstate"
use_oidc             = false
use_cli              = false
