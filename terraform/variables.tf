variable "resource_group_name" {
  type        = string
  description = "Name of the resource group to create"
  default     = "team2-job-app-shared-rg"
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

variable "acr_name" {
  type        = string
  description = "Name of the existing Azure Container Registry"
  default     = "aiacademy25"
}

variable "acr_resource_group_name" {
  type        = string
  description = "Resource group name of the existing Azure Container Registry"
  default     = "container-registry"
}

variable "key_vault_name" {
  type        = string
  description = "Name of the existing Azure Key Vault"
  default     = "team2-job-app-keyvault"
}

variable "key_vault_resource_group_name" {
  type        = string
  description = "Resource group name of the existing Azure Key Vault"
  default     = "team2-job-app-shared-rg"
}

variable "container_app_environment_name" {
  type        = string
  description = "Name of the existing Container App Environment"
  default     = "aiacademy-cae"
}

variable "container_app_environment_rg" {
  type        = string
  description = "Resource group name of the existing Container App Environment"
  default     = "container-apps-env"
}

variable "container_image_tag" {
  type        = string
  description = "Container image tag to deploy"
  default     = "latest"
}

variable "container_cpu" {
  type        = number
  description = "CPU allocation for the container"
  default     = 0.5
}

variable "container_memory" {
  type        = string
  description = "Memory allocation for the container"
  default     = "1Gi"
}

variable "container_port" {
  type        = number
  description = "Port the container listens on"
  default     = 3000
}

variable "backend_api_url" {
  type        = string
  description = "Backend API URL for the frontend to connect to"
  default     = ""
}
