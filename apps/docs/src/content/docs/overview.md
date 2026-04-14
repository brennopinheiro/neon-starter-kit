---
title: Visão geral
description: O que é o Neon Starter Kit e como ele funciona
---

# Neon Starter Kit

Boilerplate pessoal para novos projetos SaaS. Objetivo: `git clone` → primeiro deploy em menos de 1 dia.

## Stack

| Camada | Tecnologia |
|---|---|
| Dashboard | Next.js 15 (App Router) via `@opennextjs/cloudflare` |
| Marketing | Astro 5 + adapter Cloudflare |
| Monorepo | Turborepo + pnpm workspaces |
| Deploy | Cloudflare Pages + Workers |
| DB | Neon (PostgreSQL) + Drizzle ORM |
| Auth | Better Auth (organization + admin) |
| Billing | Stripe Checkout + Webhooks + Portal |
| Email | Resend + React Email |
| Jobs | Trigger.dev v3 |
| Analytics | PostHog + Cloudflare Zaraz |
| Observabilidade | Sentry |
| Rate Limiting | Cloudflare (infra) + Upstash Redis (negócio) |
| IA | Vercel AI SDK + OpenRouter + pgvector |

## Princípios

1. **Custo zero no MVP** — todos os serviços têm free tier suficiente
2. **Edge-first** — sem cold starts, latência mínima globalmente
3. **Multi-tenant desde o dia 1** — não refatorar auth depois
4. **Self-hosted onde possível** — sem lock-in em SaaS de terceiros
