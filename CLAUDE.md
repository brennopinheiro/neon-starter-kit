# Neon Starter Kit — CLAUDE.md

> Boilerplate pessoal para novos projetos SaaS. Objetivo: `git clone` → primeiro deploy em < 1 dia.

---

## O que é este projeto

Template de monorepo opinionado com stack Cloudflare-first, multi-tenant desde o dia 1. Não é um scaffold genérico — cada decisão de stack está documentada e tem razão de ser.

**Documento de especificação:** `docs/saas-neon-starter-kit.md`

---

## Stack (resumo executivo)

| Camada | Tecnologia | Por quê |
|---|---|---|
| Dashboard | Next.js 15 (App Router) via `@opennextjs/cloudflare` | Full-stack React no edge |
| Marketing | Astro 5 + adapter Cloudflare | SSG máximo, zero JS desnecessário |
| Monorepo | Turborepo + pnpm workspaces | Cache de build compartilhado |
| Deploy | Cloudflare Pages + Workers | Edge global, sem cold starts, custo baixo |
| DB | Neon (PostgreSQL) + Drizzle ORM | Serverless com branching por PR |
| Auth | Better Auth (plugins: organization, admin) | Multi-tenant nativo, self-hosted |
| Billing | Stripe Checkout + Webhooks + Billing Portal | Padrão de mercado |
| Email | Resend + React Email | Templates em código, boa entregabilidade |
| Jobs | Trigger.dev v3 | Background jobs com retry nativo |
| Analytics | PostHog + Cloudflare Zaraz | Analytics server-side no edge |
| Observabilidade | Sentry | Error tracking com stack traces reais |
| Rate Limiting | Cloudflare (infra) + Upstash Redis (lógica de negócio) | Duas camadas distintas |
| IA | Vercel AI SDK + OpenRouter + pgvector | Agentes, RAG, streaming — sem lock-in de modelo |

---

## Estrutura de pastas esperada

```
/
├── apps/
│   ├── web/          # Astro 5 — marketing site + landing page (porta 3000)
│   ├── app/          # Next.js 15 — dashboard autenticado, multi-tenant (porta 3001)
│   ├── api/          # Cloudflare Worker — Stripe webhooks APENAS (porta 3002)
│   └── docs/         # Astro Starlight — documentação interna (porta 3004)
│
├── packages/
│   ├── config/       # tsconfig base, ESLint, Tailwind preset — compartilhados
│   ├── auth/         # Better Auth config + plugins (organization, admin)
│   ├── database/     # Drizzle schema, migrations, client Neon (HTTP driver)
│   ├── types/        # Tipos TypeScript compartilhados
│   ├── ui/           # Shadcn/ui component library
│   ├── payment/      # Stripe helpers, pricing config, webhook handlers
│   ├── email/        # Resend + React Email templates
│   ├── analytics/    # PostHog helpers (server + client) + Zaraz Web API
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

## Decisões importantes (não reverter sem razão)

### `@opennextjs/cloudflare` (não `@cloudflare/next-on-pages`)
O pacote `@cloudflare/next-on-pages` foi **descontinuado**. O substituto oficial é `@opennextjs/cloudflare`. Sempre usar este.

### Multi-tenancy por `orgSlug` na URL
Todas as rotas do dashboard seguem o padrão `/[orgSlug]/...`. A middleware do Next.js valida se o usuário tem acesso à org antes de renderizar qualquer página.

### Neon — nunca usar connection pooling direto em Workers
Workers têm muitas instâncias concorrentes. Sempre usar o **Neon HTTP driver** via Drizzle:
```ts
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
const db = drizzle(neon(process.env.DATABASE_URL!))
```
Nunca importar `pg`, `postgres` ou `drizzle-orm/node-postgres`.

### Stripe Webhooks no `apps/api` (Worker), não no `apps/app`
Webhooks precisam de raw body para validação de assinatura. No Next.js no edge isso tem friction. Manter no Worker dedicado.

### Zaraz só no domínio principal (marketing)
O Zaraz é configurado por zona Cloudflare. Usar no `apps/web` para PageViews e no `apps/app` via API REST do Zaraz para eventos autenticados.

---

## Comandos de desenvolvimento

```bash
# Instalar dependências
pnpm install

# Dev (todos os apps)
pnpm dev

# Dev por app específico
pnpm --filter @workspace/app dev      # Next.js em localhost:3001
pnpm --filter @workspace/web dev      # Astro em localhost:3000

# Simular edge Cloudflare localmente (obrigatório antes de deploy)
pnpm --filter @workspace/app preview  # roda opennextjs-cloudflare preview

# Banco de dados
pnpm db:generate    # gerar migrations
pnpm db:migrate     # aplicar migrations
pnpm db:studio      # Drizzle Studio (GUI local)

# Build para Cloudflare Pages
pnpm --filter @workspace/app pages:build   # output: apps/app/.open-next/assets
pnpm --filter @workspace/web build         # output: apps/web/dist

# Testes
pnpm test           # Vitest (unitários)
pnpm test:e2e       # Playwright (auth → onboarding → billing)
```

---

## Checklist de setup (novo projeto a partir deste boilerplate)

- [ ] Clonar e renomear projeto
- [ ] Configurar `.env` com base no `.env.example`
- [ ] `pnpm install`
- [ ] `pnpm db:migrate` (cria schema no Neon)
- [ ] Configurar Stripe: Products + Prices + Webhook endpoint
- [ ] Configurar domínio verificado no Resend
- [ ] Ativar Zaraz no Cloudflare Dashboard → adicionar PostHog
- [ ] Criar projetos no Cloudflare Pages: `app` + `web` + `docs` (com build commands corretos)
- [ ] Setar variáveis de ambiente no Cloudflare Pages (incluindo `NODE_VERSION=20`)
- [ ] Criar rota `/[orgSlug]/settings/ai` (chave OpenRouter por org)
- [ ] Testar fluxo completo: signup → onboarding → billing → cancelamento
- [ ] Ativar Sentry (DSN + source maps)
- [ ] Verificar bundle size: `pnpm --filter @workspace/app pages:build` — checar que `.open-next` < 10MB

---

## O que NÃO está neste boilerplate (adicionar por projeto)

| Feature | Lib recomendada |
|---|---|
| File upload | Cloudflare R2 + Workers |
| API pública headless | Hono em Cloudflare Workers |
| I18n | next-intl (app) + Astro i18n (web) |
| Audit log | Tabela `events` no Drizzle |
| Real-time / colaborativo | Cloudflare Durable Objects |
| Short links / referral | Cloudflare Workers KV |
| CI/CD | GitHub Actions + Turborepo remote cache |
| Neon branch por PR | Neon CLI + GitHub Actions |
| DB pooling em produção | Cloudflare Hyperdrive |
| Outbound webhooks para usuários | Hookdeck Outpost (self-hosted) |
| Geração de imagens | Fal.ai |
| Agentes com estado longo | Trigger.dev + AI SDK |

---

## Regras de compatibilidade Cloudflare edge (INVIOLÁVEIS)

> Detalhes completos: `docs/compatibility-guide.md`

1. **Nunca** importar `pg` ou `node-postgres` — sempre `@neondatabase/serverless`
2. **Nunca** criar `Pool` ou `Client` do Neon globalmente — sempre dentro do request handler com `ctx.waitUntil(pool.end())`
3. **Nunca** usar `posthog.capture()` em Server Components — `posthog-js` é client-only, `posthog-node` para servidor
4. **Nunca** fazer queries de similaridade pgvector com `export const runtime = "edge"` — manter em Node serverless
5. **Sempre** declarar `export const dynamic = "force-dynamic"` em rotas com dados em tempo real (ISR não está wired)
6. **Toda** lógica de streaming de IA vai em Route Handler com `runtime = "edge"` — não inline em Server Components
7. Trigger.dev jobs são disparados via HTTP (`tasks.trigger(...)`) — nunca importar lógica de job no edge
8. Testar com `wrangler pages dev` localmente antes de qualquer deploy no CF Pages

## Design System — como customizar

Editar **apenas** `apps/app/src/styles/globals.css` para rebrandar:
- `--primary` → cor principal
- `--font-sans` / `--font-heading` → fontes
- `--radius` → arredondamento geral
- Adicionar paleta `.dark` para dark mode

**Não usar** Chakra UI ou SaaS UI — dependem de CSS-in-JS (emotion) que tem problemas no CF edge runtime e aumenta bundle.

## Convenções de código

- TypeScript strict em todos os packages
- Imports absolutos via `@workspace/*` (pnpm workspaces)
- Variáveis de ambiente validadas com T3 Env + Zod em build time
- Server Actions no `apps/app` apenas para mutações simples; queries complexas via `packages/database`
- Nunca exportar o cliente Drizzle diretamente — sempre exportar funções de repositório tipadas

---

## Contexto de negócio

Boilerplate pessoal do Brenno Pinheiro. Toda decisão prioriza:
1. **Custo zero no MVP** — todos os serviços têm free tier suficiente
2. **Edge-first** — sem cold starts, latência mínima globalmente
3. **Multi-tenant desde o dia 1** — não refatorar auth depois
4. **Self-hosted onde possível** — sem lock-in em SaaS de terceiros para auth ou analytics
