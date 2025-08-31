
variable "netlify_auth_token" {
  description = "Your personal Netlify access token."
  type        = string
  sensitive   = true
}

variable "site_name" {
  description = "The name of your site on Netlify."
  type        = string
  default     = "terraamrv-starter"
}
