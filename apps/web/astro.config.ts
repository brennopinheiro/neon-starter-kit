import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
  output: "static",
  adapter: cloudflare(),
  integrations: [
    sitemap(),
    tailwind({ applyBaseStyles: false }),
  ],
  site: process.env.PUBLIC_SITE_URL ?? "https://yourdomain.com",
})
