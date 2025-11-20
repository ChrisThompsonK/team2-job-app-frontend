variable "resource_group_name" {
  type        = string
  description = "Name of the resource group to create"
  default     = "team2-fs-test-rg-dev-rg"
}

variable "location" {
  type        = string
  description = "Azure location for resources"
  default     = "UK South"
}

variable "app_name" {
  type        = string
  description = "Name of the application"
  default     = "team2-job-app"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g., dev, staging, prod)"
  default     = "dev"
}
