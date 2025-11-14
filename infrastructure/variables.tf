variable "environment" {
  type        = string
  default     = "dev"
  description = "Environment name (dev, test, or prod)"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "Environment must be dev, test, or prod."
  }
}

variable "location" {
  type        = string
  default     = "UK South"
  description = "Azure region for resource deployment"
}

variable "project_name" {
  type        = string
  default     = "team2-job-app"
  description = "Name of the project for resource naming"

  validation {
    condition     = length(var.project_name) > 0 && length(var.project_name) <= 20
    error_message = "Project name must be between 1 and 20 characters."
  }
}

variable "container_registry_sku" {
  type        = string
  default     = "Basic"
  description = "SKU for Azure Container Registry (Basic, Standard, or Premium)"
}

variable "app_service_sku" {
  type        = string
  default     = "B1"
  description = "SKU for App Service Plan (B1, B2, B3, etc.)"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Tags to apply to all resources"
}
