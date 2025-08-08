output "default_hostname" {
  description = "The default hostname of the Static Web App."
  value       = module.static_web_app.default_hostname
}

output "id" {
  description = "The ID of the Static Web App."
  value       = module.static_web_app.id
}
