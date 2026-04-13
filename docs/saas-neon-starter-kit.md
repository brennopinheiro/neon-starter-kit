# SaaS Starter Kit — Especificação Pessoal

> Stack de referência para novos projetos SaaS. Objetivo: ir do `git clone` ao primeiro deploy em menos de 1 dia.

---

## Ponto de Partida

**Base:** `pnpm create turbo` — scaffold limpo, zero legado. Cada package adicionado manualmente com a stack exata planejada.

**Por que não usar o Orion Kit como base:**
O kit entregaria valor em ~20% da stack (Turborepo + Drizzle + Neon base). Mas auth, observabilidade e deploy seriam reescritos do zero de qualquer forma — gerando conflitos de merge e configs legadas. Mais simples e mais limpo começar com o monorepo vazio do Turborepo e construir cada package com as decisões certas desde o início.

**Stack construída do zero sobre `pnpm create turbo`:**

| Decisão | Tecnologia | Motivo |
|---|---|---|
| Auth | **Better Auth** (organization + admin plugins) | Multi-tenant nativo, self-hosted, sem custo por usuário |
| Observabilidade | **Sentry** | Error tracking com stack traces e session replay |
| Deploy | **Cloudflare Pages** + `@opennextjs/cloudflare` | Edge global, Workers integrados, Zaraz nativo, sem cold starts |
| Marketing site | **Astro 5** | SSG/SSR estático com performance máxima no edge |
| Tag manager | **Cloudflare Zaraz** | Scripts de terceiros server-side, sem impacto no LCP |
| IA | **Vercel AI SDK + OpenRouter + pgvector** | Camada de agentes pronta, sem serviço extra de vetores |

---

## Stack Completa

### Core

| Camada | Tecnologia |
|---|---|
| Framework (dashboard) | Next.js 15 (App Router) via `@opennextjs/cloudflare` |
| Framework (marketing) | Astro 5 — SSG/SSR no Cloudflare Pages |
| Linguagem | TypeScript (strict) |
| Monorepo | Turborepo + pnpm workspaces |
| Deploy | Cloudflare Pages (apps) + Cloudflare Workers (API/jobs) |

### Banco de Dados

| Ferramenta | Uso |
|---|---|
| **Neon** | PostgreSQL serverless (branching por PR, scale-to-zero) |
| **Drizzle ORM** | Type-safe queries, migrations versionadas |
| **Drizzle Studio** | GUI local para inspecionar a DB em dev |

### Autenticação & Multi-tenancy

| Ferramenta | Uso |
|---|---|
| **Better Auth** | Auth principal: email/senha, OAuth, sessões server-side |
| **Plugin: organization** | Multi-tenancy com roles (owner, admin, member) |
| **Plugin: admin** | Impersonation de usuário, painel interno |

### Billing

| Ferramenta | Uso |
|---|---|
| **Stripe Checkout** | Assinaturas e pagamentos únicos |
| **Stripe Webhooks** | Lifecycle: trial, cobrança falha, cancelamento |
| **Stripe Billing Portal** | Self-service de plano pelo cliente |

### Observabilidade

| Ferramenta | Uso |
|---|---|
| **Sentry** | Error tracking, stack traces, alertas (substitui Axiom) |
| **PostHog** | Product analytics, session replay, feature flags, funis |
| **Cloudflare Zaraz** | Tag manager no edge — carrega PostHog, pixels e scripts de terceiros server-side, sem impacto no bundle do cliente |

### Email

| Ferramenta | Uso |
|---|---|
| **Resend** | Transactional email (verificação, reset, convites, billing) |
| **React Email** | Templates versionados em código |

### Background Jobs

| Ferramenta | Uso |
|---|---|
| **Trigger.dev** | Jobs assíncronos: envio de emails, webhooks, relatórios, sync, pipelines de IA |

### IA & Agentes

| Ferramenta | Uso |
|---|---|
| **Vercel AI SDK** | Unified SDK para LLMs: `generateText`, `streamText`, tool calling, agentes, RAG |
| **OpenRouter** | Gateway para 300+ modelos (Claude, GPT-4o, Gemini, Llama) — uma chave, todos os modelos |
| **Neon pgvector** | Banco vetorial via extensão PostgreSQL — sem serviço extra, queries junto com dados de negócio |

**Decisões de design:**
- OpenRouter como provider padrão via `@openrouter/ai-sdk-provider` (compatível com Vercel AI SDK)
- Chave de API armazenada por organização no banco (criptografada) — cada org usa a própria chave
- pgvector no Neon: suficiente para RAG e busca semântica até escala significativa
- Fal.ai (geração de imagens) e Cloudflare Workers AI ficam fora do boilerplate base — adicionar por projeto

### UI / Design System

| Ferramenta | Uso |
|---|---|
| **shadcn/ui** | Componentes base — copy-paste, sem runtime CSS-in-JS, edge-safe |
| **Tailwind CSS v4** | Utilitários + design tokens via `@theme` |
| **CSS Variables (OKLCH)** | Ponto único de customização: cor, fonte, radius — editar só `globals.css` |
| **next-themes** | Dark mode sem flash, persiste em cookie |

**Como customizar o design (trocar cor, fonte, radius):**
Editar um único arquivo: `apps/app/src/styles/globals.css`

```css
/* globals.css — alterar apenas estas variáveis para rebrandar o SaaS inteiro */
@layer base {
  :root {
    --background:     0 0% 100%;
    --foreground:     240 10% 3.9%;
    --primary:        240 5.9% 10%;       /* ← cor principal */
    --primary-foreground: 0 0% 98%;
    --radius:         0.5rem;             /* ← arredondamento geral */
    --font-sans:      "Inter", sans-serif; /* ← fonte principal */
    --font-heading:   "Cal Sans", sans-serif;
  }
  .dark {
    --background:     240 10% 3.9%;
    --foreground:     0 0% 98%;
    --primary:        0 0% 98%;
  }
}
```

> **Por que não Chakra UI ou SaaS UI?**
> Chakra e SaaS UI usam CSS-in-JS (emotion/styled-system) que tem problemas no Cloudflare edge runtime — aumenta bundle e pode causar erros de hidratação com RSC. shadcn/ui é zero-runtime: são apenas componentes React + Tailwind classes, sem nada que precise rodar no servidor ou edge para gerar estilos.

### Qualidade & Testes

| Ferramenta | Uso |
|---|---|
| **Vitest** | Testes unitários |
| **Playwright** | Testes E2E (fluxo de auth, billing) |
| **T3 Env + Zod** | Validação de variáveis de ambiente em build time |

### Rate Limiting

Duas camadas com papéis distintos — o Cloudflare bloqueia na borda antes de chegar na app; o Upstash entra só quando o limite depende de contexto autenticado.

| Camada | Ferramenta | Quando usar |
|---|---|---|
| **Infraestrutura (padrão)** | Cloudflare Rate Limiting (dashboard ou `wrangler.toml`) | Força bruta por IP no sign-in, webhooks públicos, rotas abertas — zero código, zero custo extra |
| **Lógica de negócio** | Upstash Redis + @upstash/ratelimit | Limite por usuário autenticado (ex: cota de IA por plano), limite por email no reset de senha |

**Regra prática:** Cloudflare cobre 90% dos casos desde o deploy 1. Upstash entra quando você precisa de uma chave customizada que o Cloudflare não tem acesso (userId, email, orgId).

---

## Estrutura de Pastas

```
my-saas/
├── apps/
│   ├── web/          # Marketing site + landing page (Astro 5 → Cloudflare Pages, porta 3000)
│   ├── app/          # Dashboard autenticado, multi-tenant (Next.js 15 → Cloudflare Pages, porta 3001)
│   ├── api/          # Stripe webhooks APENAS (Cloudflare Worker, porta 3002)
│   └── docs/         # Documentação interna (Astro Starlight → Cloudflare Pages, porta 3004)
│
├── packages/
│   ├── config/       # Configs compartilhadas: tsconfig base, ESLint, Tailwind preset
│   ├── auth/         # Better Auth config + plugins (organization, admin)
│   ├── database/     # Drizzle schema, migrations, client Neon + pgvector
│   ├── types/        # Tipos TypeScript compartilhados
│   ├── ui/           # Shadcn/ui component library
│   ├── payment/      # Stripe helpers, pricing config, webhook handlers
│   ├── email/        # Resend + React Email templates
│   ├── analytics/    # PostHog helpers (server + client) + Zaraz web API
│   ├── observability/ # Sentry config (server, client, edge)
│   ├── jobs/         # Trigger.dev background jobs
│   └── ai/           # Vercel AI SDK + OpenRouter provider + pgvector helpers
│
├── turbo.json
├── pnpm-workspace.yaml
├── .env.example
└── tsconfig.json     # estende packages/config/tsconfig/base.json
```

---

## Deploy: Cloudflare Pages + Turborepo

Cada app é um projeto separado no Cloudflare Pages, apontando para a mesma monorepo com `build watch paths` diferentes.

```bash
# apps/app (Next.js 15 → @opennextjs/cloudflare)
Build command:   pnpm install --frozen-lockfile && pnpm --filter @workspace/app pages:build
Build output:    apps/app/.open-next/assets        # ← output correto do @opennextjs/cloudflare
Root directory:  /                                  # raiz da monorepo para o Turborepo funcionar

# apps/web (Astro — marketing site)
Build command:   pnpm install --frozen-lockfile && pnpm --filter @workspace/web build
Build output:    apps/web/dist
Root directory:  /

# apps/docs (Astro Starlight)
Build command:   pnpm install --frozen-lockfile && pnpm --filter @workspace/docs build
Build output:    apps/docs/dist
Root directory:  /
```

```json
// apps/app/package.json
{
  "scripts": {
    "pages:build": "opennextjs-cloudflare build",
    "preview":     "opennextjs-cloudflare preview",
    "build":       "next build",
    "dev":         "next dev --port 3001"
  }
}
```

```toml
# apps/app/wrangler.toml
name = "my-saas-app"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".open-next/assets"

[vars]
NEXT_PUBLIC_APP_URL = "https://app.yourdomain.com"
```

**Variável de ambiente obrigatória no CF Pages dashboard:**
```bash
NODE_VERSION=20
```

---

## Astro: Marketing Site

O `apps/web` usa **Astro 5** com o adapter Cloudflare para deploy no edge.

```bash
# dentro de apps/web
bun add @astrojs/cloudflare @astrojs/tailwind @astrojs/sitemap
```

```typescript
// apps/web/astro.config.mjs
import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  output: "hybrid",           // estático por padrão, SSR quando necessário
  adapter: cloudflare(),
  integrations: [tailwind(), sitemap()],
  site: "https://yourdomain.com",
})
```

**Páginas essenciais do marketing site:**
- `/` — Landing page (hero, features, social proof, pricing, FAQ)
- `/pricing` — Planos com dados do Stripe
- `/blog/[slug]` — MDX para SEO e conteúdo
- `/changelog` — Histórico de releases

---

## Cloudflare Zaraz

**Zaraz** roda no edge da Cloudflare e carrega scripts de terceiros (PostHog, pixels, GA4) fora do navegador — sem impacto no LCP, sem cookies de terceiros injetados diretamente no cliente.

**Configuração:**
1. Ativar Zaraz no Dashboard Cloudflare → zona do domínio → Zaraz
2. Adicionar PostHog como ferramenta: `Add Tool → Custom HTML → posthog.init()`
3. Usar a **Zaraz Web API** para disparar eventos customizados no código:

```typescript
// packages/analytics/src/zaraz.ts

// Identifica o usuário após login (server component ou client)
export function zarazIdentify(userId: string, orgId: string) {
  if (typeof window !== "undefined" && window.zaraz) {
    window.zaraz.set("userId", userId)
    window.zaraz.set("orgId", orgId)
  }
}

// Dispara evento customizado (ex: upgrade de plano)
export function zarazTrack(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.zaraz) {
    window.zaraz.track(event, properties)
  }
}
```

**Vantagens sobre GTM:**
- Scripts rodam no Worker da Cloudflare, não no browser — score de performance mantido
- Controle de privacidade centralizado (LGPD/GDPR): bloqueia ou filtra dados por regra
- Sem dependência de `gtm.js` carregando no cliente

---

## Better Auth Config

```typescript
// packages/auth/src/index.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization, admin } from "better-auth/plugins"
import { neon } from "@neondatabase/serverless"          // ← HTTP driver, edge-safe
import { drizzle } from "drizzle-orm/neon-http"          // ← neon-http adapter, nunca neon-serverless
import * as schema from "./schema"

// Cliente DB criado aqui com o driver correto para o edge
const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      membershipRoles: ["owner", "admin", "member"],
    }),
    admin(),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // cache de 5 min no edge
  },
})

export type Session = typeof auth.$Infer.Session
export type User    = typeof auth.$Infer.Session.user
```

**Middleware multi-tenant — `apps/app/src/middleware.ts`**

```typescript
// Valida orgSlug e acesso antes de qualquer página renderizar
import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@workspace/auth/edge"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas — sem verificação
  if (pathname.startsWith("/sign-") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const session = await getSessionFromRequest(request)

  // Redirecionar para login se não autenticado
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // Validar acesso ao orgSlug na URL
  const orgSlug = pathname.split("/")[1]
  if (orgSlug && orgSlug !== "admin") {
    const hasAccess = session.user.organizations?.some(
      (org) => org.slug === orgSlug
    )
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

---

## Schema Multi-tenant (Drizzle)

```typescript
// packages/database/src/schema.ts

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripePriceId: text("stripe_price_id"),
  plan: text("plan", { enum: ["free", "pro", "enterprise"] }).default("free"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Toda tabela de dados de negócio inclui orgId como FK
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})
```

---

## Camada de IA

### Vercel AI SDK + OpenRouter

```typescript
// packages/ai/src/client.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

// Provider padrão: OpenRouter (acesso a 300+ modelos com uma chave)
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Modelos disponíveis — trocar apenas o string, sem mudar código
export const models = {
  default:  openrouter("anthropic/claude-3-5-sonnet"),
  fast:     openrouter("google/gemini-flash-1.5"),
  powerful: openrouter("anthropic/claude-opus-4"),
  cheap:    openrouter("meta-llama/llama-3.1-8b-instruct:free"),
} as const

export type ModelKey = keyof typeof models
```

```typescript
// packages/ai/src/vector.ts
import { embed } from "ai"
import { openrouter } from "./client"
import { db } from "@workspace/database"
import { embeddings } from "@workspace/database/schema"
import { cosineDistance, desc, gt, sql } from "drizzle-orm"

const embeddingModel = openrouter.embedding("openai/text-embedding-3-small")

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({ model: embeddingModel, value: text })
  return embedding
}

export async function searchSimilar(orgId: string, query: string, limit = 5) {
  const queryEmbedding = await generateEmbedding(query)
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, queryEmbedding)})`

  return db
    .select({ content: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(desc(similarity))
    .limit(limit)
}
```

### Schema AI (Drizzle)

```typescript
// packages/database/src/schema.ts — adicionar às tabelas existentes

import { vector } from "drizzle-orm/pg-core"

// Configurações de IA por organização
// Criptografia: AES-256-GCM via packages/ai/src/crypto.ts usando AI_ENCRYPTION_KEY
// Usar: encryptApiKey(key) ao salvar, decryptApiKey(key) ao ler
export const aiSettings = pgTable("ai_settings", {
  orgId:            text("org_id").references(() => organizations.id, { onDelete: "cascade" }).primaryKey(),
  openrouterApiKey: text("openrouter_api_key"),  // valor: iv:authTag:ciphertext (base64)
  defaultModel:     text("default_model").default("anthropic/claude-3-5-sonnet"),
  updatedAt:        timestamp("updated_at").defaultNow(),
})

// Tabela de embeddings (pgvector) — base para RAG
export const embeddings = pgTable("embeddings", {
  id:         text("id").primaryKey(),
  orgId:      text("org_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  content:    text("content").notNull(),
  embedding:  vector("embedding", { dimensions: 1536 }).notNull(),  // text-embedding-3-small
  metadata:   jsonb("metadata"),                                      // dados livres por projeto
  createdAt:  timestamp("created_at").defaultNow(),
})

// Migration necessária no Neon: CREATE EXTENSION vector;
```

### Rota de Settings AI

```
/[orgSlug]/settings/ai    — Formulário: chave OpenRouter + modelo padrão
```

---

## Variáveis de Ambiente

```env
# Neon
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="https://app.yourdomain.com"

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# Resend
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# Sentry
SENTRY_DSN="https://..."
SENTRY_ORG="..."
SENTRY_PROJECT="..."

# PostHog (também configurado via Zaraz no marketing site)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Upstash (Rate Limiting — opcional, só para limites por usuário autenticado)
# UPSTASH_REDIS_REST_URL="..."
# UPSTASH_REDIS_REST_TOKEN="..."

# Trigger.dev
TRIGGER_API_KEY="tr_..."
TRIGGER_API_URL="https://api.trigger.dev"

# IA — OpenRouter (gateway para 300+ modelos)
OPENROUTER_API_KEY="sk-or-..."       # chave padrão do sistema (fallback)
AI_ENCRYPTION_KEY="..."              # 32 bytes hex — para AES-256-GCM das chaves por org
# Gerar: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Páginas & Rotas Essenciais

### Marketing (`apps/web` — Astro)

- `/` — Landing page com hero, features, pricing dinâmico, FAQ
- `/pricing` — Página dedicada de planos
- `/blog/[slug]` — MDX para SEO
- `/changelog` — Histórico de releases

### Dashboard (`apps/app` — Next.js)

- `/[orgSlug]` — Home do tenant (métricas, atividade recente)
- `/[orgSlug]/settings` — Configurações da org (nome, slug, membros)
- `/[orgSlug]/settings/billing` — Portal Stripe embutido
- `/[orgSlug]/settings/members` — Convites e gestão de roles
- `/[orgSlug]/settings/ai` — Chave OpenRouter da org + modelo padrão
- `/admin` — Painel interno (lista de orgs, impersonation, override de plano)

### Auth

- `/sign-in`, `/sign-up`, `/verify-email`, `/reset-password`

### Onboarding

- Wizard 3 passos pós-signup: nome da org → convite de membros → redirecionamento

---

## Adicionar Conforme o Produto Cresce

| Feature | Lib | Quando adicionar |
|---|---|---|
| File upload | Cloudflare R2 + Workers | Quando o produto precisar de assets do usuário |
| API pública | Hono em Cloudflare Workers | Quando clientes precisarem de integração headless |
| I18n | next-intl (app) + Astro i18n (web) | Antes de escalar para outros mercados |
| Audit log | Tabela `events` no Drizzle | Clientes enterprise ou compliance LGPD |
| Real-time | Cloudflare Durable Objects | Features colaborativas, notificações ao vivo |
| Short links / redirects | Cloudflare Workers KV | Links de campanha, referral tracking |
| Geração de imagens | Fal.ai (`@fal-ai/client`) | SaaS com geração de imagem/vídeo (Flux, SDXL) |
| Agentes complexos com estado | Trigger.dev + AI SDK | Workflows de IA de longa duração com retry e checkpointing |
| Escala de vetores (>10M) | Cloudflare Vectorize | Quando pgvector não for suficiente |
| Modelos no edge sem custo por token | Cloudflare Workers AI | IA leve rodando no próprio Worker (classificação, embeddings baratos) |
| CI/CD | GitHub Actions + Turborepo remote cache | `--affected` para rodar só o que mudou; cache de build compartilhado |
| Neon branch por PR | Neon CLI + GitHub Actions | `neon branches create --parent main` no PR open, deletar no close |
| DB pooling em produção | Cloudflare Hyperdrive | Reduz latência e gerencia connection pooling automaticamente no edge |
| Outbound webhooks para usuários | Hookdeck Outpost (self-hosted) | Quando o produto precisar fornecer webhooks de saída para clientes |

---

## Serviços Externos (Free Tiers Suficientes para MVP)

| Serviço | Free Tier |
|---|---|
| Neon | 0.5 GB storage, 1 projeto |
| Cloudflare Pages | Deploys ilimitados, 500 builds/mês |
| Cloudflare Workers | 100K requests/dia |
| Cloudflare Zaraz | Incluído em qualquer plano Cloudflare |
| Stripe | Sem custo até cobrar |
| Resend | 3.000 emails/mês |
| PostHog | 1M eventos/mês |
| Sentry | 5K erros/mês |
| Trigger.dev | 50K execuções/mês |
| Cloudflare Rate Limiting | Incluído no plano free (1M requests/mês) |
| Upstash (opcional) | 10K requests/dia — só se precisar de limite por usuário |
| OpenRouter | Pay-per-use, sem free tier fixo — mas acesso a modelos gratuitos (Llama, Gemini Flash free) |

---

## Compatibilidade — Gaps Conhecidos

> Leitura obrigatória antes de começar: **`docs/compatibility-guide.md`**

Resumo dos 8 pontos críticos pesquisados (abril/2026):

| Risco | Severidade | Fix |
|---|---|---|
| Bundle Next.js > 10MB no CF Worker | 🟡 Médio | `serverExternalPackages` + tree-shaking |
| Neon driver errado no edge | 🔴 Crítico | Sempre `@neondatabase/serverless`, nunca `pg` |
| Pool de DB global no edge | 🔴 Crítico | Criar Pool dentro do request handler |
| Better Auth com `node-postgres` | 🔴 Crítico | Usar `drizzle-orm/neon-http` adapter |
| AI SDK streaming via RSC | 🟡 Médio | Mover para Route Handler com `runtime = "edge"` |
| PostHog em Server Components | 🟡 Médio | `posthog-js` client + `posthog-node` server — separados |
| pgvector similarity no edge | 🟡 Médio | Route Handler sem `runtime = "edge"` (Node serverless) |
| ISR sem KV wiring | 🟡 Médio | `export const dynamic = "force-dynamic"` |

---

## Checklist de Setup (novo projeto)

- [ ] `pnpm create turbo@latest my-saas` → selecionar "Empty workspace"
- [ ] Configurar `pnpm-workspace.yaml` e `turbo.json` base
- [ ] Criar `packages/config` (tsconfig base, ESLint, Tailwind preset)
- [ ] Criar `apps/app` (Next.js 15 + `@opennextjs/cloudflare`)
- [ ] Criar `apps/web` (Astro 5 + adapter Cloudflare)
- [ ] Criar `apps/api` (Cloudflare Worker — Stripe webhooks)
- [ ] Criar `packages/database` (Drizzle + Neon HTTP driver)
- [ ] Criar `packages/auth` (Better Auth + organization + admin)
- [ ] Criar `packages/ui` (shadcn/ui init)
- [ ] Criar `packages/payment`, `packages/email`, `packages/analytics`, `packages/observability`, `packages/jobs`, `packages/ai`
- [ ] Adicionar `apps/app/src/middleware.ts` (validação multi-tenant)
- [ ] Configurar `wrangler.toml` em `apps/app` e `apps/api`
- [ ] Configurar Rate Limiting no Cloudflare Dashboard (sign-in, signup, webhooks)
- [ ] Configurar `.env.example` com todas as variáveis
- [ ] `pnpm db:generate && pnpm db:migrate`
- [ ] Configurar Stripe: Products, Prices, Webhook endpoint
- [ ] Configurar domínio no Resend + template de boas-vindas
- [ ] Ativar Zaraz no Cloudflare Dashboard → adicionar PostHog como ferramenta
- [ ] Integrar Zaraz Web API no `packages/analytics`
- [ ] Ativar Sentry: `sentry.server.config.ts`, `sentry.client.config.ts`
- [ ] Habilitar extensão pgvector no Neon: `CREATE EXTENSION vector;`
- [ ] Configurar `packages/ai`: Vercel AI SDK + OpenRouter provider
- [ ] Criar tabelas `ai_settings` e `embeddings` no schema
- [ ] Criar rota `/[orgSlug]/settings/ai` (formulário de chave OpenRouter)
- [ ] Testar fluxo completo: signup → onboarding → billing → cancelamento
- [ ] Deploy Cloudflare Pages: setar envs de produção + Stripe live keys

