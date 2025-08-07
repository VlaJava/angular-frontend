terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
  subscription_id = var.azure_subscription_id
}

module "static_web_app" {
  source              = "./static_web_app"
  app_name            = "swa-viajavafrontend"
  resource_group_name = var.resource_group.name
  location            = var.resource_group.location
  frontend_repository_url = var.frontend_repository_url
  frontend_repository_token = var.frontend_repository_token
}

output "static_web_app_default_hostname" {
  description = "The default hostname of the Static Web App. Use this to configure your CNAME record."
  value       = module.static_web_app.default_hostname
}


