variable "environment" {
  type        = string
  description = "Environment name (dev, prod, etc)"
}

variable "location" {
  type        = string
  description = "Azure region"
  default     = "UK South"
}

variable "project_name" {
  type        = string
  description = "Project name for resource naming"
  default     = "team2-job-app"
}

variable "container_registry_sku" {
  type        = string
  description = "Azure Container Registry SKU"
  default     = "Basic"
}

variable "app_service_sku" {
  type        = string
  description = "App Service SKU"
  default     = "B1"
}

variable "tags" {
  type        = map(string)
  description = "Common tags for all resources"
  default = {
    ManagedBy = "Terraform"
  }
}
