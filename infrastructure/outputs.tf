output "resource_group_id" {
  value       = azurerm_resource_group.main.id
  description = "Resource Group ID"
}

output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "Resource Group name"
}
