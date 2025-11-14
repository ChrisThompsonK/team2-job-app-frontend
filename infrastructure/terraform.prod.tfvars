# Production Environment Configuration
# terraform plan -var-file="terraform.prod.tfvars"
# terraform apply -var-file="terraform.prod.tfvars"

environment    = "prod"
project_name   = "team2-jobapp"
location       = "UK South"
location_short = "uks"

# Container Registry
acr_sku           = "Standard"
acr_admin_enabled = true

# App Service
app_service_plan_sku = "P1v2"
app_always_on        = true
app_port             = "3000"

# Docker Configuration
docker_image_name = "team2-job-app-frontend"
docker_image_tag  = "latest"

# Application Settings
node_env = "production"

# Backend API URLs (update these with your actual backend URLs)
api_base_url      = "https://backend-prod.azurewebsites.net"
auth_api_base_url = "https://backend-prod.azurewebsites.net/api/auth"

# Session secret - MUST be provided via environment variable TF_VAR_session_secret
# NEVER commit secrets to version control
# Example: export TF_VAR_session_secret="your-secure-secret-here"
# session_secret is marked as required - you must set it via environment variable

# CORS Configuration
allowed_origins = [
  "https://yourdomain.com",
  "https://www.yourdomain.com"
]

# Monitoring
enable_application_insights = true
enable_log_analytics        = true
log_retention_days          = 90
