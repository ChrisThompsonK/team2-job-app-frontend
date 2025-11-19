import {
  to = azurerm_resource_group.rg
  id = "/subscriptions/ef1b41f6-e4b2-41d0-a52d-d279af4a77ab/resourceGroups/team2-fs-test-rg-dev-rg"
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}
