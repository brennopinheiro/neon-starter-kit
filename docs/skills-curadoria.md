# Curadoria de Skills — SaaS Starter Kit

> Skills do Claude Code mapeadas por camada da stack. Organizadas em: Oficiais (mantidas pelo próprio criador da lib) → Community (bem testadas) → Lacunas (criar ao longo do boilerplate).
>
> Fontes pesquisadas: skills.sh · skillsmp.com · GitHub · lobehub.com

---

## Como instalar

```bash
# Global — disponível em todos os projetos futuros (recomendado para libs agnósticas)
npx skills add <owner/repo@skill> -g -y

# Local — apenas neste projeto
npx skills add <owner/repo@skill>
```

Após instalar: slash command `/nome-da-skill` fica disponível no Claude Code.

---

## BANCO DE DADOS

### Neon — OFICIAL ✅

**Repo:** `neondatabase/agent-skills`

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `neon-postgres` | `npx skills add neondatabase/agent-skills@neon-postgres -g -y` | — | Conexão serverless, Neon CLI, branching, Drizzle setup, Auth, Platform API |
| `claimable-postgres` | `npx skills add neondatabase/agent-skills@claimable-postgres -g -y` | — | DB throwaway via `neon.new` — útil para testes isolados |
| `neon-postgres-egress-optimizer` | `npx skills add neondatabase/agent-skills@neon-postgres-egress-optimizer -g -y` | — | Diagnóstico de overfetching, otimização de custos |

**Bônus — Postgres best practices genéricas** (curadas por membros do PostgreSQL Core Team):
```bash
npx skills add neondatabase/postgres-skills -g -y
```

---

### Drizzle ORM — Community ✅

| Skill | Install | Cobre |
|---|---|---|
| `drizzle-orm` | `npx skills add oldirty/drizzle-orm-skill -g -y` | Schema PostgreSQL, migrations, queries, joins, transactions, `drizzle.config.ts`. Busca docs em tempo real. |

---

## AUTENTICAÇÃO

### Better Auth — OFICIAL ✅

**Repo:** `better-auth/skills`

| Skill | Install | Cobre |
|---|---|---|
| `best-practices` | `npx skills add better-auth/skills@best-practices -g -y` | Config server/client, adapters, sessões, plugins, env vars |
| `organization` | `npx skills add better-auth/skills@organization -g -y` | Plugin multi-tenant: roles, convites, member management |
| `create-auth` | `npx skills add better-auth/skills@create-auth -g -y` | Scaffold de nova auth layer |
| `emailAndPassword` | `npx skills add better-auth/skills@emailAndPassword -g -y` | Fluxo email/senha, verificação, reset |
| `twoFactor` | `npx skills add better-auth/skills@twoFactor -g -y` | Setup 2FA |

> Alternativa via plugin marketplace (instala tudo de uma vez):
> ```
> /plugin marketplace add better-auth/skills
> /plugin install auth-skills
> ```

---

## EMAIL

### Resend — OFICIAL ✅

**Repo:** `resend/resend-skills` e `resend/react-email`

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `resend` | `npx skills add resend/resend-skills@resend -g -y` | 5.5K | Envio único e batch (até 100), idempotency keys, retries, inbound email, webhooks com verificação de assinatura, gerenciamento de domínios/contatos, broadcasts, automações |
| `react-email` | `npx skills add resend/react-email@react-email -g -y` | 4.1K | Componentes de email (Html, Button, Image, CodeBlock...), Tailwind pixel-based, preview local, i18n, renderização HTML/plain text |
| `email-best-practices` | `npx skills add resend/email-best-practices -g -y` | — | SPF/DKIM/DMARC, anti-spam, templates transacionais, compliance LGPD/GDPR, double opt-in, bounce tracking |

> **Nota:** batch send não suporta anexos nem agendamento.

---

## BACKGROUND JOBS

### Trigger.dev v3 — OFICIAL ✅

**Repo:** `triggerdotdev/skills`

| Skill | Install | Cobre |
|---|---|---|
| `trigger-setup` | `npx skills add triggerdotdev/skills@trigger-setup -g -y` | SDK install, `npx trigger init`, primeiro task |
| `trigger-tasks` | `npx skills add triggerdotdev/skills@trigger-tasks -g -y` | Tasks duráveis, batch, retry, cron, concorrência, debounce, checkpointing |
| `trigger-config` | `npx skills add triggerdotdev/skills@trigger-config -g -y` | Build extensions (Prisma, Playwright, FFmpeg, Python), env sync, telemetry |
| `trigger-agents` | `npx skills add triggerdotdev/skills@trigger-agents -g -y` | Workflows LLM, orquestrador-workers, human-in-the-loop, evaluator-optimizer |
| `trigger-realtime` | `npx skills add triggerdotdev/skills@trigger-realtime -g -y` | React hooks, streaming de progresso para UI, wait tokens |
| `trigger-cost-savings` | `npx skills add triggerdotdev/skills@trigger-cost-savings -g -y` | Análise e redução de custo de execuções |

---

## ANALYTICS

### PostHog — OFICIAL ✅

**Repo:** `posthog/posthog-for-claude` — auto-atualizado a cada release do PostHog

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `posthog-instrumentation` | `npx skills add posthog/posthog-for-claude@posthog-instrumentation -g -y` | 558 | Setup Next.js App Router 15.3+, feature flags, eventos, identify de usuário |

> Via plugin marketplace (instala todas as skills PostHog):
> ```
> /plugin marketplace add PostHog/skills
> /plugin install posthog-all@posthog-skills
> ```

---

## BILLING

### Stripe — Sem skill oficial da Stripe no skills.sh

Melhor seleção disponível:

| Skill | Install | Installs | Qualidade | Cobre |
|---|---|---|---|---|
| `subscription-management` | `npx skills add claude-office-skills/skills@subscription-management -g -y` | 502 | Community | Gestão de assinaturas, lifecycle completo |
| `stripe-sync` | `npx skills add andrelandgraf/fullstackrecipes@stripe-sync -g -y` | 73 | Community | Sync Stripe ↔ banco de dados, webhooks |
| `stripe-integration-expert` | `npx skills add borghei/claude-skills@stripe-integration-expert -g -y` | 43 | Community | Integração completa Stripe |
| `stripe-best-practices` | `npx skills add smithery.ai@stripe-best-practices -g -y` | 14 | Community | Best practices gerais |
| `stripe-local-dev` | `npx skills add phrazzld/claude-config@stripe-local-dev -g -y` | 21 | Community | Setup local Stripe CLI + webhook forwarding |

> **Recomendação:** `stripe-sync` (andrelandgraf) é o mais específico para o padrão que vamos usar (webhook → update no banco). `stripe-local-dev` é essencial para dev.

> **Alternativa avançada (não no skills.sh):** `Alex647648/saas-skills-suite` — `mvp-billing-system` — skill construída de 4 dias de implementação real: multi-plano, créditos, idempotency. Requer adaptação da camada Supabase → Neon.

---

## DEPLOY / INFRAESTRUTURA

### Cloudflare — OFICIAL ✅

**Repo:** `cloudflare/skills` — 9K installs

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `cloudflare` | `npx skills add cloudflare/skills@cloudflare -g -y` | 9K | Árvore de decisão para 50+ produtos Cloudflare: Workers, Pages, KV, R2, D1, Durable Objects, Zaraz, WAF, Wrangler, Terraform |

> Inclui Zaraz (sob "Media/Tags") — sem skill dedicada para Zaraz, está consolidado aqui.

**Skills Cloudflare complementares (community):**

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `cloudflare` (dmmulroy) | `npx skills add dmmulroy/cloudflare-skill@cloudflare -g -y` | 305 | Alternativa com foco em Workers |
| `workers-security` | `npx skills add secondsky/claude-skills@workers-security -g -y` | 88 | Segurança específica para Workers |

**Next.js + Cloudflare (opennextjs):**

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `cloudflare-opennext` | `npx skills add null-shot/cloudflare-skills@cloudflare-opennext -g -y` | 81 | `@opennextjs/cloudflare` especificamente |
| `cloudflare-nextjs` | `npx skills add jackspace/claudeskillz@cloudflare-nextjs -g -y` | 82 | Next.js no Cloudflare Pages, build config |

---

## MONOREPO / TURBOREPO

### Turborepo — OFICIAL Vercel ✅

**Repo:** `vercel/turborepo` (também disponível no skills.sh como `giuseppe-trisciuoglio/developer-kit@turborepo-monorepo`)

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `turborepo-monorepo` | `npx skills add giuseppe-trisciuoglio/developer-kit@turborepo-monorepo -g -y` | 339 | turbo.json, task pipelines, `dependsOn`, caching, remote cache, CI (GitHub Actions), env vars, `--filter`, `--affected`, `turbo watch` |
| `turborepo` | `npx skills add acedergren/agentic-tools@turborepo -g -y` | 18 | Turborepo avançado |
| `monorepo-navigator` | `npx skills add borghei/claude-skills@monorepo-navigator -g -y` | 39 | Navegação em monorepos complexos |

---

## UI / COMPONENTES

### Shadcn/ui — OFICIAL ✅

**Repo:** `shadcn-ui/ui` — 81.8K installs no skills.sh

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `shadcn` (oficial) | `npx skillsadd shadcn/ui -g -y` ou `pnpm dlx skills add shadcn/ui -g -y` | 81.8K | Lê `components.json`, CLI (`init`, `add`, `search`, `diff`), theming OKLCH, dark mode, registry, padrões de composição |
| `shadcn-ui` (community) | `npx skills add existential-birds/beagle@shadcn-ui -g -y` | 223 | Alternativa community bem testada |

> Skills já ativas nesta sessão: `vercel:shadcn` (básica) — instalar a oficial `shadcn/ui` para cobertura completa.

---

## IA & AGENTES

### Vercel AI SDK — OFICIAL ✅

**Repo:** `vercel/ai` — **18.3K installs**

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `ai-sdk` | `npx skills add vercel/ai/ai-sdk -g -y` | 18.3K | `generateText`, `streamText`, tool calling, agentes, RAG, `useChat`/`useCompletion`, OpenRouter via `@openrouter/ai-sdk-provider`, AI Gateway, DevTools |

> Skills extras do mesmo repo (menos relevantes para este boilerplate):
> - `develop-ai-functions-example` (658 installs) — exemplos práticos de funções AI
> - `add-provider-package` (269 installs) — integrar novo provider no SDK

**Integração com OpenRouter:**
```bash
pnpm add @openrouter/ai-sdk-provider ai
```
OpenRouter é compatível diretamente com o Vercel AI SDK — sem adapter adicional.

**Lacuna — sem skills dedicadas encontradas para:**
- OpenRouter (coberto dentro do `ai-sdk` skill)
- pgvector / vetores no Neon (coberto pelo `neon-postgres` skill)
- Fal.ai (sem skill — adicionar por projeto quando necessário)

---

## OBSERVABILIDADE

### Sentry — OFICIAL ✅

**Fonte:** `sentry/dev` — publicada pelo próprio time do Sentry — **14.5K installs**

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `sentry-cli` | `npx skills add https://cli.sentry.dev -g -y` | 14.5K | Auth, projetos, issues (com IA via Seer: `sentry issue explain` / `sentry issue plan`), releases, traces, spans, logs, API direto, output JSON para scripting |

**Skills community complementares:**

| Skill | Install | Installs | Cobre |
|---|---|---|---|
| `sentry-skill` | `npx skills add julianobarbosa/claude-code-skills@sentry-skill -g -y` | 37 | Setup e integração Sentry |
| `sentry-observability` | `npx skills add jeremylongshore/claude-code-plugins-plus-skills@sentry-observability -g -y` | 27 | Observabilidade com Sentry |
| `observability` | `npx skills add phrazzld/claude-config@observability -g -y` | 23 | Observabilidade geral |
| `fix-observability` | `npx skills add phrazzld/claude-config@fix-observability -g -y` | 23 | Debug de problemas de observabilidade |

---

## TESTES

### Vitest + Playwright — Sem skills oficiais

Não foram encontradas skills oficiais para Vitest ou Playwright no skills.sh. Para o boilerplate:

- **Vitest**: bem documentado, zero configuração em projetos TypeScript modernos. Usar docs oficiais.
- **Playwright**: skill community disponível:

```bash
npx skills add jeremylongshore/claude-code-plugins-plus-skills@playwright-e2e -g -y  # se disponível
```

**Fluxos E2E essenciais a cobrir no boilerplate:**
1. Signup → verificação de email → onboarding (criar org) → dashboard
2. Convite de membro → aceitar convite → acesso à org
3. Upgrade de plano → Stripe Checkout → webhook → plano atualizado
4. Cancelamento → webhook → downgrade

---

## SKILLS JÁ ATIVAS NESTA SESSÃO

Não precisam instalar — disponíveis via slash command:

| Skill | Slug | Relevância |
|---|---|---|
| Vercel Next.js | `vercel:nextjs` | App Router, data fetching |
| Vercel React Best Practices | `vercel:react-best-practices` | RSC, Server Actions, hidratação |
| Vercel Next Cache | `vercel:next-cache-components` | PPR, `use cache`, cache profiles |
| Vercel Shadcn | `vercel:shadcn` | shadcn/ui (básico) |
| Vercel AI SDK | `vercel:ai-sdk` | Para quando o SaaS tiver IA |
| Supabase Postgres | `supabase-postgres-best-practices` | Patterns PostgreSQL aplicáveis ao Neon |
| Next Best Practices | `next-best-practices` | Next.js genérico |
| Vercel Composition | `vercel:composition-patterns` | React compound components |

---

## LACUNAS — Skills a criar neste boilerplate

| Tecnologia | Lacuna | Plano |
|---|---|---|
| **Cloudflare Zaraz** | Coberto parcialmente pelo `cloudflare/skills`. Sem skill dedicada. | Criar `zaraz` skill com: config via dashboard, Zaraz Web API (`window.zaraz.track`, `zaraz.set`), setup PostHog via Zaraz |
| **Sentry** | Skill oficial existe (`sentry/dev` — 14.5K installs) | Nenhuma lacuna |
| **pnpm workspaces** | Coberto parcialmente pelo Turborepo skill | Documentar no CLAUDE.md do boilerplate |
| **React Email + Resend (integrado)** | Skills separadas existem, integração não | Criar `resend-react-email` skill combinando os dois |

---

## Ordem de instalação recomendada

```bash
# 1. Banco de dados
npx skills add neondatabase/agent-skills@neon-postgres -g -y
npx skills add neondatabase/postgres-skills -g -y
npx skills add oldirty/drizzle-orm-skill -g -y

# 2. Autenticação
npx skills add better-auth/skills@best-practices -g -y
npx skills add better-auth/skills@organization -g -y

# 3. Email
npx skills add resend/resend-skills@resend -g -y
npx skills add resend/react-email@react-email -g -y
npx skills add resend/email-best-practices -g -y

# 4. Background jobs
npx skills add triggerdotdev/skills@trigger-setup -g -y
npx skills add triggerdotdev/skills@trigger-tasks -g -y

# 5. Analytics
npx skills add posthog/posthog-for-claude@posthog-instrumentation -g -y

# 6. Billing
npx skills add andrelandgraf/fullstackrecipes@stripe-sync -g -y
npx skills add phrazzld/claude-config@stripe-local-dev -g -y

# 7. Deploy / Infra
npx skills add cloudflare/skills@cloudflare -g -y
npx skills add null-shot/cloudflare-skills@cloudflare-opennext -g -y

# 8. Monorepo
npx skills add giuseppe-trisciuoglio/developer-kit@turborepo-monorepo -g -y

# 9. IA
npx skills add vercel/ai/ai-sdk -g -y

# 10. Observabilidade
npx skills add https://cli.sentry.dev -g -y

# 11. UI
npx skillsadd shadcn/ui -g -y
```

---

## Status de cobertura por camada

| Camada | Cobertura | Qualidade |
|---|---|---|
| Neon / Postgres | ✅ Completa | Oficial |
| Drizzle ORM | ✅ Boa | Community |
| Better Auth | ✅ Completa | Oficial |
| Resend + React Email | ✅ Completa | Oficial |
| Trigger.dev v3 | ✅ Completa | Oficial |
| PostHog | ✅ Boa | Oficial |
| **Vercel AI SDK** | **✅ Completa** | **Oficial (18.3K)** |
| Stripe | ⚠️ Parcial | Community |
| Cloudflare (geral) | ✅ Boa | Oficial |
| Cloudflare Zaraz | ⚠️ Parcial | Coberto em cloudflare/skills |
| OpenNext (Cloudflare) | ✅ Boa | Community |
| Turborepo | ✅ Boa | Oficial Vercel |
| Shadcn/ui | ✅ Completa | Oficial |
| Sentry | ✅ Oficial (14.5K installs) |
| OpenRouter / pgvector / Fal.ai | Cobertos por ai-sdk + neon-postgres |
