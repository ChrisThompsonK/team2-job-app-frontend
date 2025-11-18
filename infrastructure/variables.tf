variable "environment" {
  type        = string
  description = "Environment name (dev, prod, etc)"
}

variable "location" {
  type        = string
  description = "Azure region"
}

variable "project_name" {
  type        = string
  description = "Project name for resource naming"
}
variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "aiacademy25"
}

variable "acr_repository" {
  description = "Name of the ACR repository for the Docker image"
  type        = string
  default     = "team2-job-app-frontend"
}

variable "storage_account_name" {
  description = "Name of the Azure Storage Account for state or blobs"
  type        = string
  default     = "aistatemgmt"
}

# Variables for Terraform remote state storage
