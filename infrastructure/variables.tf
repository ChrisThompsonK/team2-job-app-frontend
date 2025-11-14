# Variable definitions for Team 2 Job Application Frontend Infrastructure
# These variables support multiple environments (dev, prod, etc.)

# Environment Configuration
variable "environment" {
  description = "Environment name (dev, prod, staging, etc.)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name used in resource naming"
  type        = string
  default     = "team2-jobapp"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "UK South"
}

variable "location_short" {
  description = "Short name for location (used in resource names)"
  type        = string
  default     = "uks"
}

# Container Registry Configuration
variable "acr_sku" {
  description = "SKU for Azure Container Registry"
  type        = string
  default     = "Basic"
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.acr_sku)
    error_message = "ACR SKU must be Basic, Standard, or Premium."
  }
}

variable "acr_admin_enabled" {
  description = "Enable admin user for ACR"
  type        = bool
  default     = true
}

# App Service Configuration
variable "app_service_plan_sku" {
  description = "SKU for App Service Plan"
  type        = string
  default     = "B1"
}

variable "app_always_on" {
  description = "Keep the app always on"
  type        = bool
  default     = false
}

variable "app_port" {
  description = "Port the application runs on"
  type        = string
  default     = "3000"
}

# Docker Configuration
variable "docker_image_name" {
  description = "Docker image name"
  type        = string
  default     = "team2-job-app-frontend"
}

variable "docker_image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

# Application Configuration
variable "node_env" {
  description = "NODE_ENV setting for the application"
  type        = string
  default     = "production"
}

variable "api_base_url" {
  description = "Backend API base URL"
  type        = string
}

variable "auth_api_base_url" {
  description = "Auth API base URL"
  type        = string
}

variable "session_secret" {
  description = "Session secret for Express session"
  type        = string
  sensitive   = true
}

variable "allowed_origins" {
  description = "List of allowed CORS origins"
  type        = list(string)
  default     = []
}

# Monitoring Configuration
variable "enable_application_insights" {
  description = "Enable Application Insights for monitoring"
  type        = bool
  default     = true
}

variable "enable_log_analytics" {
  description = "Enable Log Analytics Workspace"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Log retention period in days"
  type        = number
  default     = 30
  validation {
    condition     = var.log_retention_days >= 30 && var.log_retention_days <= 730
    error_message = "Log retention must be between 30 and 730 days."
  }
}
