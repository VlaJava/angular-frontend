output "default_hostname" {
  description = "The default hostname of the Static Web App."
  value       = azurerm_static_web_app.swa.default_host_name
}

output "id" {
  description = "The ID of the Static Web App."
  value       = azurerm_static_web_app.swa.id
}
