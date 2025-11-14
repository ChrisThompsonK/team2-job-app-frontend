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

variable "tags" {
  type        = map(string)
  description = "Common tags for all resources"
  default = {
    ManagedBy = "Terraform"
  }
}
