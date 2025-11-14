# Development Environment Configuration
# terraform plan -var-file="terraform.dev.tfvars"
# terraform apply -var-file="terraform.dev.tfvars"

environment    = "dev"
project_name   = "team2-jobapp"
location       = "UK South"
location_short = "uks"

# Container Registry
acr_sku           = "Basic"
acr_admin_enabled = true

# App Service
app_service_plan_sku = "B1"
app_always_on        = false
app_port             = "3000"

# Docker Configuration
docker_image_name = "team2-job-app-frontend"
docker_image_tag  = "latest"

# Application Settings
node_env = "development"

# Backend API URLs (update these with your actual backend URLs)
api_base_url      = "http://backend-dev:8000"
auth_api_base_url = "http://backend-dev:8000/api/auth"

# Session secret - MUST be provided via environment variable TF_VAR_session_secret
# NEVER commit secrets to version control
# Example: export TF_VAR_session_secret="your-secure-secret-here"
# session_secret is marked as required - you must set it via environment variable

# CORS Configuration
allowed_origins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
]

# Monitoring
enable_application_insights = true
enable_log_analytics        = true
log_retention_days          = 30
