variable "app_name" {
  description = "Name of the Static Web App."
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group."
  type        = string
}

variable "location" {
  description = "The Azure region for the Static Web App."
  type        = string
}

variable "frontend_repository_url" {
type = string
}

variable "frontend_repository_token" {
type = string
}
