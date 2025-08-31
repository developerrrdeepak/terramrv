
terraform {
  required_providers {
    netlify = {
      source  = "netlify/netlify"
      version = "~> 2.3.0"
    }
  }
}

provider "netlify" {
  auth = var.netlify_auth_token
}

resource "netlify_site" "terraamrv_starter" {
  name = var.site_name
  build_settings {
    command = "pnpm build"
    dir = "dist/spa"
    functions_dir = "netlify/functions"
  }
}
