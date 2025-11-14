/**
 * Resource Group Module
 * 
 * Creates an Azure Resource Group with consistent naming and tagging.
 * This module is reusable across different environments and projects.
 */

resource "azurerm_resource_group" "this" {
  name     = var.name
  location = var.location
  tags     = var.tags
}
