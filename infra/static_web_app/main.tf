resource "azurerm_static_web_app" "swa" {
  name                = var.app_name
  resource_group_name = var.resource_group_name
  location            = var.location

  repository_url = var.frontend_repository_url
  repository_branch = "staging"
  repository_token = var.frontend_repository_token
}
