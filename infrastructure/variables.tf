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
