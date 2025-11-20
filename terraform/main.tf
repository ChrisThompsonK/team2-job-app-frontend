resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Data source: Existing Azure Container Registry
data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group_name
}

# Data source: Existing Azure Key Vault
data "azurerm_key_vault" "kv" {
  name                = var.key_vault_name
  resource_group_name = var.key_vault_resource_group_name
}

# Data source: Existing Container App Environment
data "azurerm_container_app_environment" "platform_env" {
  name                = var.container_app_environment_name
  resource_group_name = var.container_app_environment_rg
}

# User-Assigned Managed Identity for Container App
resource "azurerm_user_assigned_identity" "frontend_identity" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Role Assignment: Grant AcrPull to Managed Identity
resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.frontend_identity.principal_id
}

# Role Assignment: Grant Key Vault Secrets User to Managed Identity
resource "azurerm_role_assignment" "kv_secrets_user" {
  scope                = data.azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.frontend_identity.principal_id
}

# Container App for Frontend
resource "azurerm_container_app" "frontend" {
  name                         = "${var.app_name}-app"
  container_app_environment_id = data.azurerm_container_app_environment.platform_env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.frontend_identity.id]
  }

  registry {
    server   = data.azurerm_container_registry.acr.login_server
    identity = azurerm_user_assigned_identity.frontend_identity.id
  }

  template {
    container {
      name   = var.app_name
      image  = "${data.azurerm_container_registry.acr.login_server}/${var.app_name}:${var.container_image_tag}"
      cpu    = var.container_cpu
      memory = var.container_memory

      env {
        name        = "NODE_ENV"
        secret_name = "node-env"
      }

      env {
        name        = "PORT"
        secret_name = "frontend-port"
      }

      env {
        name        = "BACKEND_API_URL"
        secret_name = "api-base-url"
      }
    }

    min_replicas = 1
    max_replicas = 3
  }

  secret {
    name                = "node-env"
    key_vault_secret_id = "${data.azurerm_key_vault.kv.vault_uri}secrets/NODE-ENV"
    identity            = azurerm_user_assigned_identity.frontend_identity.id
  }

  secret {
    name                = "frontend-port"
    key_vault_secret_id = "${data.azurerm_key_vault.kv.vault_uri}secrets/FRONTEND-PORT"
    identity            = azurerm_user_assigned_identity.frontend_identity.id
  }

  secret {
    name                = "api-base-url"
    key_vault_secret_id = "${data.azurerm_key_vault.kv.vault_uri}secrets/API-BASE-URL"
    identity            = azurerm_user_assigned_identity.frontend_identity.id
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = var.container_port
    transport                  = "http"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  tags = {
    Environment = var.environment
    Application = var.app_name
    ManagedBy   = "Terraform"
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.kv_secrets_user
  ]
}