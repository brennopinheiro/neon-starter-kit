import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"

export default defineConfig({
  integrations: [
    starlight({
      title: "Neon Starter Kit",
      description: "Documentação interna do boilerplate SaaS",
      sidebar: [
        {
          label: "Início",
          items: [
            { label: "Visão geral", slug: "overview" },
            { label: "Setup rápido", slug: "quickstart" },
          ],
        },
        {
          label: "Stack",
          items: [
            { label: "Banco de dados", slug: "stack/database" },
            { label: "Autenticação", slug: "stack/auth" },
            { label: "Billing", slug: "stack/billing" },
            { label: "Email", slug: "stack/email" },
            { label: "IA", slug: "stack/ai" },
          ],
        },
        {
          label: "Deploy",
          items: [
            { label: "Cloudflare Pages", slug: "deploy/cloudflare" },
            { label: "Variáveis de ambiente", slug: "deploy/env-vars" },
          ],
        },
      ],
    }),
  ],
})
