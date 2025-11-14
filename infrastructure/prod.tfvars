# Production Environment Variables
environment  = "prod"
location     = "UK South"
project_name = "team2-job-app"

container_registry_sku = "Standard"
app_service_sku        = "P1V2"

tags = {
  Environment = "prod"
  ManagedBy   = "Terraform"
  Tier        = "Production"
}
