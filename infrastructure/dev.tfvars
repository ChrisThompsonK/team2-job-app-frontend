# Development Environment Variables
environment  = "dev"
location     = "UK South"
project_name = "team2-job-app"

container_registry_sku = "Basic"
app_service_sku        = "B1"

tags = {
  Environment = "dev"
  ManagedBy   = "Terraform"
  Tier        = "Development"
}
