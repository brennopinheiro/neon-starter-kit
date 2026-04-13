import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Deps que não rodam no CF edge — ficam em Node
  serverExternalPackages: ["@sentry/node"],

  experimental: {
    // Necessário para @opennextjs/cloudflare
    reactCompiler: false,
  },
}

export default nextConfig
