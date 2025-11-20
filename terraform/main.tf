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

# Key Vault Secret: Session Secret for Frontend
resource "azurerm_key_vault_secret" "session_secret" {
  name         = "session-secret"
  value        = var.session_secret_value
  key_vault_id = data.azurerm_key_vault.kv.id

  depends_on = [
    azurerm_role_assignment.kv_secrets_user
  ]
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
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = tostring(var.container_port)
      }

      env {
        name  = "BACKEND_API_URL"
        value = var.backend_api_url
      }

      env {
        name        = "SESSION_SECRET"
        secret_name = "session-secret"
      }
    }

    min_replicas = 1
    max_replicas = 3
  }

  secret {
    name                = "session-secret"
    key_vault_secret_id = "${data.azurerm_key_vault.kv.vault_uri}secrets/session-secret"
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
    azurerm_role_assignment.kv_secrets_user,
    azurerm_key_vault_secret.session_secret
  ]
}