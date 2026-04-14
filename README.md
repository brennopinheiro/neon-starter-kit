# Neon Starter Kit

Boilerplate pessoal para projetos SaaS. Objetivo: `git clone` → primeiro deploy em menos de 1 dia.

Stack Cloudflare-first, multi-tenant desde o dia 1, custo zero no MVP.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Dashboard | Next.js 15 (App Router) via `@opennextjs/cloudflare` |
| Marketing | Astro 5 + adapter Cloudflare |
| Monorepo | Turborepo + pnpm workspaces |
| Deploy | Cloudflare Pages + Workers |
| Banco de dados | Neon (PostgreSQL serverless) + Drizzle ORM |
| Autenticação | Better Auth (plugins: organization, admin) |
| Billing | Stripe Checkout + Webhooks + Billing Portal |
| Email | Resend + React Email |
| Jobs | Trigger.dev v3 |
| Analytics | PostHog + Cloudflare Zaraz |
| Observabilidade | Sentry |
| Rate Limiting | Cloudflare (infra) + Upstash Redis (lógica de negócio) |
| IA | Vercel AI SDK + OpenRouter + pgvector |

---

## Estrutura

```
/
├── apps/
│   ├── web/          Astro 5 — marketing + landing page      (porta 3000)
│   ├── app/          Next.js 15 — dashboard autenticado       (porta 3001)
│   ├── api/          Cloudflare Worker — Stripe webhooks      (porta 3002)
│   └── docs/         Astro Starlight — documentação interna   (porta 3004)
│
├── packages/
│   ├── config/       tsconfig base, compartilhado entre apps
│   ├── database/     Drizzle schema + migrations + client Neon HTTP
│   ├── auth/         Better Auth config + plugins
│   ├── types/        Tipos TypeScript compartilhados
│   ├── ui/           shadcn/ui — componentes base
│   ├── payment/      Stripe helpers + pricing config
│   ├── email/        Resend + templates React Email
│   ├── analytics/    PostHog (server + client)
│   ├── observability/ Sentry config
│   ├── jobs/         Trigger.dev background jobs
│   └── ai/           Vercel AI SDK + OpenRouter + crypto (AES-256-GCM)
│
├── .env.example
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Pré-requisitos

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Conta [Neon](https://neon.tech) (free tier)
- Conta [Cloudflare](https://cloudflare.com) (free tier)

---

## Setup local

### 1. Clonar e instalar

```bash
git clone https://github.com/brennopinheiro/neon-starter-kit.git meu-saas
cd meu-saas
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Abrir `.env.local` e preencher as variáveis. O mínimo para rodar localmente:

| Variável | Como obter |
|---|---|
| `DATABASE_URL` | Neon Dashboard → Connection string |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` (já preenchido) |

O restante (Stripe, Resend, PostHog etc.) pode ficar em branco no início — o app vai subir mas essas features não vão funcionar.

### 3. Criar schema no banco

```bash
pnpm db:migrate
```

Isso roda as migrations do Drizzle no Neon e cria todas as tabelas (auth, organizations, billing, embeddings).

### 4. Rodar em desenvolvimento

```bash
pnpm dev         # todos os apps em paralelo
```

Ou por app específico:

```bash
pnpm --filter @workspace/app dev    # só o dashboard Next.js
pnpm --filter @workspace/web dev    # só o marketing Astro
```

---

## Configuração dos serviços

### Neon (banco de dados)

1. Criar projeto em [neon.tech](https://neon.tech)
2. Copiar a **Connection string** (formato `postgresql://...?sslmode=require`)
3. Colar em `DATABASE_URL`

### Better Auth (autenticação)

Gerar o secret:

```bash
openssl rand -base64 32
```

Colar em `BETTER_AUTH_SECRET`.

### Stripe (billing)

1. Criar conta em [stripe.com](https://stripe.com)
2. Criar dois Products com Prices recorrentes (mensal e anual)
3. Copiar os IDs:

```bash
STRIPE_SECRET_KEY="sk_test_..."           # Dashboard → Developers → API keys
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."   # Products → seu produto → Price ID
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
```

4. Para webhooks locais, usar o Stripe CLI:

```bash
stripe listen --forward-to localhost:3002/webhooks/stripe
# Copiar o webhook secret exibido → STRIPE_WEBHOOK_SECRET
```

### Resend (email)

1. Criar conta em [resend.com](https://resend.com)
2. Verificar um domínio (ou usar o sandbox `onboarding@resend.dev` para testes)
3. Criar API key:

```bash
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@seudominio.com"
```

### PostHog (analytics)

1. Criar projeto em [posthog.com](https://posthog.com) (US Cloud)
2. Copiar o Project API Key:

```bash
POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
# POSTHOG_HOST e NEXT_PUBLIC_POSTHOG_HOST já têm default
```

### Sentry (observabilidade)

Usar o wizard — ele cria todos os arquivos necessários automaticamente:

```bash
npx @sentry/wizard@latest -i nextjs --dir apps/app
```

Preencher as variáveis geradas no `.env.local`.

### Upstash Redis (rate limiting)

1. Criar database em [upstash.com](https://upstash.com) → Redis
2. Copiar REST URL e token:

```bash
UPSTASH_REDIS_REST_URL="https://...upstash.io"
UPSTASH_REDIS_REST_TOKEN="..."
```

### OpenRouter (IA)

1. Criar conta em [openrouter.ai](https://openrouter.ai)
2. Criar API key em [openrouter.ai/keys](https://openrouter.ai/keys)
3. Gerar chave de criptografia (para armazenar as chaves por org):

```bash
openssl rand -base64 32
```

```bash
OPENROUTER_API_KEY="sk-or-v1-..."   # chave global (fallback)
AI_ENCRYPTION_KEY="..."              # resultado do openssl acima
```

### Trigger.dev (jobs)

1. Criar projeto em [trigger.dev](https://trigger.dev)
2. Copiar o secret key da dashboard:

```bash
TRIGGER_SECRET_KEY="tr_dev_..."
```

---

## Comandos úteis

```bash
# Desenvolvimento
pnpm dev                                    # todos os apps
pnpm --filter @workspace/app dev            # só o dashboard (3001)
pnpm --filter @workspace/web dev            # só o marketing (3000)

# Banco de dados
pnpm db:generate                            # gerar nova migration após alterar schema
pnpm db:migrate                             # aplicar migrations
pnpm db:studio                              # abrir Drizzle Studio (GUI local)

# Testes
pnpm test                                   # Vitest (unitários)
pnpm test:e2e                               # Playwright (E2E)

# Build e deploy
pnpm --filter @workspace/app preview        # simular edge Cloudflare localmente
pnpm --filter @workspace/app pages:build    # build para Cloudflare Pages
pnpm --filter @workspace/web build          # build do marketing

# Typecheck
pnpm --filter @workspace/app typecheck
```

---

## Deploy na Cloudflare

### Pré-requisito: testar localmente no runtime do CF

Antes de qualquer deploy, sempre rodar:

```bash
pnpm --filter @workspace/app preview
```

Isso usa `wrangler pages dev` e simula o Cloudflare Workers runtime localmente — pega erros de compatibilidade antes de chegar na produção.

### Criar os projetos no Cloudflare Pages

Criar **dois projetos** no [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages:

**Projeto `app` (Next.js):**
| Campo | Valor |
|---|---|
| Build command | `pnpm install --frozen-lockfile && pnpm --filter @workspace/app pages:build` |
| Build output | `apps/app/.open-next` |
| Root directory | `/` |

**Projeto `web` (Astro):**
| Campo | Valor |
|---|---|
| Build command | `pnpm install --frozen-lockfile && pnpm --filter @workspace/web build` |
| Build output | `apps/web/dist` |
| Root directory | `/` |

### Variáveis de ambiente no Cloudflare Pages

No dashboard de cada projeto → Settings → Environment Variables, adicionar todas as variáveis do `.env.example`.

Variável obrigatória em ambos os projetos:

```
NODE_VERSION = 20
```

### Deploy do Worker (Stripe webhooks)

```bash
cd apps/api
pnpm wrangler deploy

# Configurar secrets no Worker
wrangler secret put DATABASE_URL
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
```

---

## Criar um novo projeto a partir deste boilerplate

1. Clonar com novo nome
2. Trocar referências de `neon-starter-kit` / `@workspace` pelo nome do projeto
3. Atualizar `package.json` raiz (`name`, `description`)
4. Atualizar `apps/web/src/pages/index.astro` com a landing page real
5. Editar `apps/app/src/styles/globals.css` para aplicar as cores do projeto (`--primary`, `--font-sans`, `--radius`)
6. Configurar Stripe com os Products e Prices reais
7. Atualizar `packages/payment/src/config.ts` com os planos e preços reais

---

## Links dos serviços

| Serviço | Dashboard | Docs |
|---|---|---|
| Neon | [console.neon.tech](https://console.neon.tech) | [neon.tech/docs](https://neon.tech/docs) |
| Cloudflare | [dash.cloudflare.com](https://dash.cloudflare.com) | [developers.cloudflare.com](https://developers.cloudflare.com) |
| Better Auth | — | [better-auth.com/docs](https://www.better-auth.com/docs) |
| Stripe | [dashboard.stripe.com](https://dashboard.stripe.com) | [stripe.com/docs](https://stripe.com/docs) |
| Resend | [resend.com/overview](https://resend.com/overview) | [resend.com/docs](https://resend.com/docs) |
| PostHog | [app.posthog.com](https://app.posthog.com) | [posthog.com/docs](https://posthog.com/docs) |
| Sentry | [sentry.io](https://sentry.io) | [docs.sentry.io](https://docs.sentry.io) |
| Upstash | [console.upstash.com](https://console.upstash.com) | [upstash.com/docs](https://upstash.com/docs) |
| OpenRouter | [openrouter.ai](https://openrouter.ai) | [openrouter.ai/docs](https://openrouter.ai/docs) |
| Trigger.dev | [cloud.trigger.dev](https://cloud.trigger.dev) | [trigger.dev/docs](https://trigger.dev/docs) |
