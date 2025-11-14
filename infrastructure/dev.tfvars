# Development Environment Variables
# Used for: terraform plan -var-file="dev.tfvars"
# Used for: terraform apply -var-file="dev.tfvars"

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
