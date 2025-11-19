variable "resource_group_name" {
  type        = string
  description = "Name of the resource group to create"
  default     = "team2-fs-test-rg-dev-rg"
}

variable "location" {
  type        = string
  description = "Azure location for resources"
  default     = "UK South"
}
