# Production Environment Variables
# Used for: terraform plan -var-file="prod.tfvars"
# Used for: terraform apply -var-file="prod.tfvars"

environment  = "prod"
location     = "UK South"
project_name = "team2-job-app"

container_registry_sku = "Premium"
app_service_sku        = "P1V2"

tags = {
  Environment = "prod"
  ManagedBy   = "Terraform"
  Tier        = "Production"
}
