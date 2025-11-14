# Main Terraform configuration for Team 2 Job Application Frontend
# This configuration creates Azure resources for the frontend application

locals {
  # Common tags for all resources
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Application = "job-app-frontend"
    Team        = "Team2"
  }

  # Resource naming convention: {resource-type}-{project}-{environment}-{region}
  resource_prefix = "${var.project_name}-${var.environment}"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_prefix}-${var.location_short}"
  location = var.location
  tags     = local.common_tags
}

# Container Registry (ACR) for Docker images
resource "azurerm_container_registry" "acr" {
  name                = replace("acr${local.resource_prefix}${var.location_short}", "-", "")
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.acr_sku
  admin_enabled       = var.acr_admin_enabled

  tags = merge(
    local.common_tags,
    {
      Name = "Container Registry for ${var.environment} environment"
    }
  )
}

# App Service Plan for Container Apps
resource "azurerm_service_plan" "main" {
  name                = "asp-${local.resource_prefix}-${var.location_short}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku

  tags = merge(
    local.common_tags,
    {
      Name = "App Service Plan for ${var.environment} environment"
    }
  )
}

# Linux Web App for the frontend application
resource "azurerm_linux_web_app" "frontend" {
  name                = "app-${local.resource_prefix}-frontend-${var.location_short}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = var.app_always_on

    application_stack {
      docker_image_name   = "${azurerm_container_registry.acr.login_server}/${var.docker_image_name}:${var.docker_image_tag}"
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
    }

    # CORS settings if needed
    cors {
      allowed_origins = var.allowed_origins
    }
  }

  app_settings = {
    DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.acr.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.acr.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.acr.admin_password
    WEBSITES_PORT                   = var.app_port
    NODE_ENV                        = var.node_env
    API_BASE_URL                    = var.api_base_url
    AUTH_API_BASE_URL               = var.auth_api_base_url
    SESSION_SECRET                  = var.session_secret
    PORT                            = var.app_port
  }

  # Prevent sensitive app settings from appearing in logs
  logs {
    detailed_error_messages = false
    failed_request_tracing  = false
  }

  https_only = true

  identity {
    type = "SystemAssigned"
  }

  tags = merge(
    local.common_tags,
    {
      Name = "Frontend Web App for ${var.environment} environment"
    }
  )

  lifecycle {
    ignore_changes = [
      # Ignore changes to docker image tag in state as it will be updated by CI/CD
      site_config[0].application_stack[0].docker_image_name
    ]
  }
}

# Optional: Application Insights for monitoring
resource "azurerm_application_insights" "main" {
  count               = var.enable_application_insights ? 1 : 0
  name                = "appi-${local.resource_prefix}-${var.location_short}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  application_type    = "Node.JS"

  tags = merge(
    local.common_tags,
    {
      Name = "Application Insights for ${var.environment} environment"
    }
  )
}

# Optional: Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  count               = var.enable_log_analytics ? 1 : 0
  name                = "log-${local.resource_prefix}-${var.location_short}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_days

  tags = merge(
    local.common_tags,
    {
      Name = "Log Analytics Workspace for ${var.environment} environment"
    }
  )
}
