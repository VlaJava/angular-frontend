variable "azure_resource_group" {
  type = string
}

variable "azure_subscription_id" {
  type = string
}

variable "frontend_repository_token" {
  description = "Token to access frontend repository"
  type        = string
}

variable "frontend_repository_url" {
  description = "Url of frontend repository"
  type        = string
}
