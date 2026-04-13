# Curadoria de Skills — SaaS Starter Kit

> Skills do Claude Code que cobrem cada camada da stack. Instalar antes de começar a construir o boilerplate — cada skill injeta contexto técnico atualizado no AI, aumentando precisão e velocidade.

---

## Como instalar uma skill

```bash
# Instalação global (disponível em qualquer projeto)
npx skills add <owner/repo@skill> -g -y

# Instalação local (apenas neste projeto)
npx skills add <owner/repo@skill>
```

Após instalar, a skill fica disponível como slash command no Claude Code: `/nome-da-skill`

---

## Skills OFICIAIS (mantidas pelos criadores da tecnologia)

### Neon — Banco de Dados

**Repositório:** `neondatabase/agent-skills` — mantido pelo time Neon

| Skill | Comando | Cobre |
|---|---|---|
| `neon-postgres` | `npx skills add neondatabase/agent-skills@neon-postgres -g -y` | Conexão serverless, Neon CLI, branching, Drizzle setup, Auth, Platform API |
| `claimable-postgres` | `npx skills add neondatabase/agent-skills@claimable-postgres -g -y` | DB throwaway via `neon.new` — útil para testes isolados |
| `neon-postgres-egress-optimizer` | `npx skills add neondatabase/agent-skills@neon-postgres-egress-optimizer -g -y` | Diagnóstico de overfetching e otimização de custos |

**Bônus:** Postgres best practices gerais curadas por membros do PostgreSQL Core Team:
```bash
npx skills add neondatabase/postgres-skills -g -y
```

---

### Better Auth — Autenticação

**Repositório:** `better-auth/skills` — mantido pelo time Better Auth

| Skill | Comando | Cobre |
|---|---|---|
| `best-practices` | `npx skills add better-auth/skills@best-practices -g -y` | Config server/client, adapters, sessões, plugins, env vars |
| `organization` | `npx skills add better-auth/skills@organization -g -y` | Plugin multi-tenant: roles, convites, member management |
| `create-auth` | `npx skills add better-auth/skills@create-auth -g -y` | Scaffold inicial de nova auth layer |
| `emailAndPassword` | `npx skills add better-auth/skills@emailAndPassword -g -y` | Fluxo email/senha, verificação, reset |
| `twoFactor` | `npx skills add better-auth/skills@twoFactor -g -y` | Setup 2FA |

> **Instalação via plugin marketplace (alternativa):**
> ```
> /plugin marketplace add better-auth/skills
> /plugin install auth-skills
> ```

---

### Trigger.dev — Background Jobs

**Repositório:** `triggerdotdev/skills` — mantido pelo time Trigger.dev (v3)

| Skill | Comando | Cobre |
|---|---|---|
| `trigger-setup` | `npx skills add triggerdotdev/skills@trigger-setup -g -y` | SDK install, `npx trigger init`, primeiro task |
| `trigger-tasks` | `npx skills add triggerdotdev/skills@trigger-tasks -g -y` | Tasks duráveis, batch, retry, cron, concorrência, debounce |
| `trigger-config` | `npx skills add triggerdotdev/skills@trigger-config -g -y` | Build extensions (Prisma, Playwright, FFmpeg), env sync |
| `trigger-agents` | `npx skills add triggerdotdev/skills@trigger-agents -g -y` | Workflows com LLM, human-in-the-loop, orquestração |
| `trigger-realtime` | `npx skills add triggerdotdev/skills@trigger-realtime -g -y` | React hooks, streaming de progresso para UI |
| `trigger-cost-savings` | `npx skills add triggerdotdev/skills@trigger-cost-savings -g -y` | Análise de custos de execução |

---

### PostHog — Analytics

**Repositório:** `posthog/posthog-for-claude` — mantido pelo time PostHog (auto-atualizado a cada release)

| Skill | Comando | Instalações | Cobre |
|---|---|---|---|
| `posthog-instrumentation` | `npx skills add posthog/posthog-for-claude@posthog-instrumentation -g -y` | 558 | Setup Next.js App Router (15.3+), feature flags, eventos, identify |

> **Via plugin marketplace (instala todas as skills PostHog):**
> ```
> /plugin marketplace add PostHog/skills
> /plugin install posthog-all@posthog-skills
> ```

Skills extras (community, `jeremylongshore`):
```bash
npx skills add jeremylongshore/claude-code-plugins-plus-skills@posthog-install-auth -g -y
npx skills add jeremylongshore/claude-code-plugins-plus-skills@posthog-performance-tuning -g -y
```

---

## Skills COMMUNITY (bem avaliadas)

### Cloudflare + Next.js

| Skill | Comando | Installs | Cobre |
|---|---|---|---|
| `cloudflare-nextjs` | `npx skills add jackspace/claudeskillz@cloudflare-nextjs -g -y` | 82 | Next.js no Cloudflare Pages, configuração de build |
| `cloudflare-opennext` | `npx skills add null-shot/cloudflare-skills@cloudflare-opennext -g -y` | 81 | `@opennextjs/cloudflare` especificamente — **mais relevante para nossa stack** |

### Neon + Next.js (React)

```bash
npx skills add neondatabase/neon-js@neon-js-react -g -y   # 14 installs
```
Cobre: Neon com React/Next.js, connection pooling, queries tipadas.

### Next.js Full Stack Geral

```bash
npx skills add saccoai/agent-skills@nextjs-fullstack -g -y  # 12 installs
npx skills add andrelandgraf/fullstackrecipes@base-app-setup -g -y  # 81 installs
```

### Drizzle ORM

```bash
npx skills add oldirty/drizzle-orm-skill -g -y
```
Cobre: schema PostgreSQL, migrations, queries (select/insert/update/delete), joins, transactions, `drizzle.config.ts`. Busca docs em tempo real de `orm.drizzle.team/docs/`.

### Stripe (Billing)

Não existe skill oficial da Stripe. Melhores opções:

| Skill | Comando | Installs | Cobre |
|---|---|---|---|
| `stripe-integration-expert` | `npx skills add alirezarezvani/claude-skills@stripe-integration-expert -g -y` | 5 | Integração completa |
| `fix-stripe` | `npx skills add phrazzld/claude-config@fix-stripe -g -y` | 22 | Debug de erros Stripe comuns |
| `stripe-local-dev` | `npx skills add phrazzld/claude-config@stripe-local-dev -g -y` | 21 | Setup local com Stripe CLI + webhook forwarding |
| `log-stripe-issues` | `npx skills add phrazzld/claude-config@log-stripe-issues -g -y` | 22 | Logging de problemas de billing |

> **Nota:** Para billing robusto (multi-plano, créditos, ciclo de vida), revisar manualmente o `Alex647648/saas-skills-suite` — skill `mvp-billing-system` — foi construída a partir de 4 dias de implementação real. Requer adaptação da camada Supabase → Neon.

---

## Skills JÁ DISPONÍVEIS nesta sessão (não precisam instalar)

Estas skills já estão ativas no Claude Code:

| Skill | Slug | Cobre |
|---|---|---|
| Vercel Next.js | `vercel:nextjs` | Next.js com Vercel — padrões App Router |
| Vercel Next Best Practices | `vercel:react-best-practices` | RSC, Server Actions, hidratação |
| Vercel Next Cache | `vercel:next-cache-components` | PPR, `use cache`, cache profiles |
| Vercel Shadcn | `vercel:shadcn` | shadcn/ui components |
| Vercel AI SDK | `vercel:ai-sdk` | AI SDK (quando o produto tiver IA) |
| Supabase Postgres | `supabase-postgres-best-practices` | Patterns PostgreSQL (muitos aplicáveis ao Neon) |
| Next Best Practices | `next-best-practices` | Já instalada |
| Vercel Composition | `vercel:composition-patterns` | React compound components |

---

## Lacunas — Sem skill oficial disponível

| Tecnologia | Situação | Workaround |
|---|---|---|
| **Turborepo / pnpm workspaces** | Nenhuma skill dedicada encontrada | Documentar no CLAUDE.md do projeto |
| **Cloudflare Workers (API)** | Sem skill oficial Workers | `vercel:vercel-functions` cobre padrões similares |
| **Cloudflare Zaraz** | Sem skill | Documentar config manual no CLAUDE.md |
| **React Email / Resend** | Sem skill | Usar docs oficiais |
| **Shadcn (free)** | Sem skill oficial gratuita | `vercel:shadcn` cobre o básico |

---

## Ordem de instalação recomendada

```bash
# 1. Banco de dados (base de tudo)
npx skills add neondatabase/agent-skills@neon-postgres -g -y
npx skills add neondatabase/postgres-skills -g -y
npx skills add oldirty/drizzle-orm-skill -g -y

# 2. Autenticação
npx skills add better-auth/skills@best-practices -g -y
npx skills add better-auth/skills@organization -g -y

# 3. Deploy Cloudflare
npx skills add null-shot/cloudflare-skills@cloudflare-opennext -g -y
npx skills add jackspace/claudeskillz@cloudflare-nextjs -g -y

# 4. Background jobs
npx skills add triggerdotdev/skills@trigger-setup -g -y
npx skills add triggerdotdev/skills@trigger-tasks -g -y

# 5. Analytics
npx skills add posthog/posthog-for-claude@posthog-instrumentation -g -y

# 6. Billing (debug helpers)
npx skills add phrazzld/claude-config@stripe-local-dev -g -y
npx skills add phrazzld/claude-config@fix-stripe -g -y
```

---

## Decisão: instalar local vs global?

- **Global (`-g`):** Skills de tecnologias agnósticas ao projeto (Neon, Drizzle, Better Auth, Trigger.dev) — você vai usar em todos os SaaS futuros
- **Local (sem `-g`):** Skills específicas de um projeto (ex: se um SaaS tiver um Stripe config muito particular)

Para este boilerplate, **tudo global** faz sentido.
