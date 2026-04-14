# Comparativo: Neon Starter Kit vs Supabase Starter Kit

> Escolher o boilerplate certo antes de começar o projeto.

---

## Stack — visão geral

| Camada | Neon Starter Kit | Supabase Starter Kit |
|---|---|---|
| **Framework (dashboard)** | Next.js 15 + `@opennextjs/cloudflare` | Next.js 15 + `@opennextjs/cloudflare` |
| **Framework (marketing)** | Astro 5 + Cloudflare adapter | Astro 5 + Cloudflare adapter |
| **Monorepo** | Turborepo + pnpm workspaces | Turborepo + pnpm workspaces |
| **Deploy** | Cloudflare Pages + Workers | Cloudflare Pages + Workers |
| **Banco de dados** | **Neon** (PostgreSQL serverless) | **Supabase** (PostgreSQL gerenciado) |
| **Driver de conexão** | `@neondatabase/serverless` (HTTP driver) | `postgres` + pooler (porta 6543, `prepare: false`) |
| **ORM** | Drizzle ORM (`drizzle-orm/neon-http`) | Drizzle ORM (`drizzle-orm/postgres-js`) |
| **Auth** | Better Auth (organization + admin) | Better Auth (organization + admin) |
| **Billing** | Stripe Checkout + Webhooks + Portal | Stripe Checkout + Webhooks + Portal |
| **Email** | Resend + React Email | Resend + React Email |
| **Background Jobs** | Trigger.dev v3 | Trigger.dev v3 |
| **Analytics** | PostHog + Cloudflare Zaraz | PostHog + Cloudflare Zaraz |
| **Observabilidade** | Sentry | Sentry |
| **Rate Limiting** | Cloudflare + Upstash Redis | Cloudflare + Upstash Redis |
| **File Storage** | ❌ Não incluso (adicionar R2 por projeto) | **✅ Supabase Storage** (1 GB, incluído) |
| **Realtime** | ❌ Não incluso | **✅ Supabase Realtime** (client-side only) |
| **DB Webhooks** | ❌ Não incluso | **✅ Supabase DB Webhooks** (via `pg_net`) |
| **Banco vetorial (pgvector)** | Extensão no Neon | Extensão no Supabase |
| **UI / Design System** | shadcn/ui + Tailwind CSS v4 | shadcn/ui + Tailwind CSS v4 |
| **Validação de env** | T3 Env + Zod | T3 Env + Zod |
| **Testes unitários** | Vitest | Vitest |
| **Testes E2E** | Playwright | Playwright |

---

## Banco de dados — diferenças técnicas

| Aspecto | Neon | Supabase |
|---|---|---|
| **Tipo de conexão** | HTTP puro (edge-nativo) | Pooler PgBouncer (HTTP/TCP) |
| **Driver** | `@neondatabase/serverless` | `postgres` (node-postgres) |
| **Configuração no edge** | Zero — HTTP driver funciona direto | `prepare: false` obrigatório |
| **Duas URLs necessárias** | Não — uma URL serve tudo | **Sim** — pooler (runtime) + direta (migrations) |
| **Branching por PR** | **✅ Nativo** — `neon branches create` | ❌ Não tem |
| **Scale-to-zero** | **✅ Nativo** | ❌ Não tem no free tier |
| **Limite de projetos (free)** | Ilimitado | **2 projetos** |
| **Storage incluído** | ❌ | **✅ 1 GB** |
| **Dashboard SQL** | Console Neon | **Dashboard Supabase (mais rico)** |
| **pgvector** | Ativar via `CREATE EXTENSION vector` | Ativar no Dashboard → Extensions |

---

## Features exclusivas por boilerplate

### Só no Neon Starter Kit

| Feature | Detalhes |
|---|---|
| **Branching por PR** | Cada PR pode ter seu próprio branch de banco — ideal para CI/CD |
| **HTTP driver nativo** | Conexão com o banco via HTTP puro — zero config de pooler |
| **Scale-to-zero** | Banco dorme quando inativo — custo zero sem requisições |

### Só no Supabase Starter Kit

| Feature | Detalhes |
|---|---|
| **Storage** | Upload/download de arquivos com CDN automático — sem R2 extra |
| **Realtime** | Subscriptions WebSocket em mudanças de tabela (client-side) |
| **Database Webhooks** | Disparo HTTP automático via trigger Postgres ao mudar linha |
| **Dashboard rico** | SQL Editor, Logs em tempo real, Auth management, Storage UI |

---

## Packages do monorepo

| Package | Neon Starter Kit | Supabase Starter Kit |
|---|---|---|
| `packages/config` | ✅ | ✅ |
| `packages/database` | ✅ Neon HTTP driver | ✅ postgres-js + pooler |
| `packages/auth` | ✅ Better Auth | ✅ Better Auth |
| `packages/types` | ✅ | ✅ |
| `packages/ui` | ✅ shadcn | ✅ shadcn |
| `packages/payment` | ✅ Stripe | ✅ Stripe |
| `packages/email` | ✅ Resend | ✅ Resend |
| `packages/analytics` | ✅ PostHog | ✅ PostHog |
| `packages/observability` | ✅ Sentry | ✅ Sentry |
| `packages/jobs` | ✅ Trigger.dev | ✅ Trigger.dev |
| `packages/ai` | ✅ Vercel AI SDK | ✅ Vercel AI SDK |
| **`packages/supabase`** | ❌ | **✅ Supabase JS Client** |

---

## Free tier comparativo

| Recurso | Neon | Supabase |
|---|---|---|
| **Database** | 0.5 GB | 0.5 GB |
| **Projetos** | Ilimitados | **2 ativos** |
| **File Storage** | ❌ | **1 GB + 2 GB egress/mês** |
| **Auth MAUs** | N/A (Better Auth — ilimitado) | N/A (Better Auth — ilimitado) |
| **Realtime** | ❌ | **200 conexões, 2M mensagens/mês** |
| **Edge Functions** | ❌ | **500K invocações/mês** |
| **Branching** | **✅ Nativo** | ❌ |
| **Scale-to-zero** | **✅** | ❌ |

---

## Quando escolher cada um

### Escolher Neon Starter Kit quando:

- Precisa de **branching por PR** (cada dev com seu banco isolado)
- Quer a **conexão mais simples no edge** (HTTP driver sem config de pooler)
- Tem **mais de 2 projetos simultâneos** no free tier
- O projeto **não precisa de Storage** (só banco e auth)
- Prefere a solução mais **minimalista** — menos serviços externos

### Escolher Supabase Starter Kit quando:

- O produto **precisa de upload de arquivos** (avatars, documentos, imagens)
- Quer **Realtime** (dashboard colaborativo, notificações ao vivo)
- Aprecia o **dashboard rico** do Supabase para gestão de dados
- Quer **DB Webhooks** para automações simples sem código extra
- Vai usar **Edge Functions** do Supabase para lógica simples
- A equipe prefere **ter tudo em um lugar** (banco + storage + realtime)

---

## Skills — comparativo

| Camada | Neon Starter Kit | Supabase Starter Kit |
|---|---|---|
| Banco | `neon-postgres`, `postgres-best-practices`, `drizzle-orm` | **`supabase`, `supabase-postgres-best-practices`**, `drizzle-orm` |
| Auth | `better-auth-best-practices`, `organization-best-practices` | `better-auth-best-practices`, `organization-best-practices` |
| Email | `resend`, `react-email`, `email-best-practices` | `resend`, `react-email`, `email-best-practices` |
| Jobs | `trigger-setup`, `trigger-tasks` | `trigger-setup`, `trigger-tasks` |
| Analytics | `posthog-instrumentation` | `posthog-instrumentation` |
| Observabilidade | `sentry-cli` | `sentry-cli` |
| Deploy | `cloudflare`, `cloudflare-opennext` | `cloudflare`, `cloudflare-opennext` |
| Billing | `stripe-sync`, `stripe-webhooks` | `stripe-sync`, `stripe-webhooks` |
| Monorepo | `turborepo-monorepo` | `turborepo-monorepo` |
| UI | `shadcn` | `shadcn` |
| IA | `vercel-ai-sdk` | `vercel-ai-sdk` |
| Testes | `vite`, `vitest`, `playwright-e2e-testing` | `vite`, `vitest`, `playwright-e2e-testing` |
| **Total skills** | **15** | **15** (troca 3 do Neon por 2 do Supabase) |
