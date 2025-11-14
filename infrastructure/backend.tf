# Backend configuration for remote state storage in Azure
# This should be initialized with: terraform init -backend-config=backend-dev.hcl

terraform {
  required_version = ">= 1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  backend "azurerm" {
    # Backend configuration will be provided via backend config files
    # or environment variables in the pipeline
    # 
    # Example backend-dev.hcl:
    # resource_group_name  = "rg-terraform-state-dev"
    # storage_account_name = "sttfstatedev001"
    # container_name       = "tfstate"
    # key                  = "team2-job-app-frontend.tfstate"
  }
}

provider "azurerm" {
  features {}

  # When running in a pipeline with a service principal, these will be set via environment variables:
  # ARM_CLIENT_ID
  # ARM_CLIENT_SECRET
  # ARM_SUBSCRIPTION_ID
  # ARM_TENANT_ID

  # For local development, you can use Azure CLI authentication
  # az login
}
