---
title: Setup rápido
description: Do clone ao dev em 5 minutos
---

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Conta Neon (free tier)
- Conta Cloudflare (free tier)

## Passos

```bash
# 1. Clonar e entrar no diretório
git clone https://github.com/brennopinheiro/neon-starter-kit.git meu-saas
cd meu-saas

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher DATABASE_URL, BETTER_AUTH_SECRET, etc.

# 4. Criar schema no Neon
pnpm db:migrate

# 5. Rodar em dev
pnpm dev
```

## URLs locais

| App | URL |
|---|---|
| Marketing (Astro) | http://localhost:3000 |
| Dashboard (Next.js) | http://localhost:3001 |
| Stripe Webhooks (Worker) | http://localhost:3002 |
| Docs (Starlight) | http://localhost:3004 |

## Antes do primeiro deploy

```bash
# Testar no runtime do Cloudflare localmente (obrigatório)
pnpm --filter @workspace/app preview

# Build para Cloudflare Pages
pnpm --filter @workspace/app pages:build
```
