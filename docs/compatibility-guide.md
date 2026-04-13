# Guia de Compatibilidade — SaaS Starter Kit

> Gaps e soluções conhecidas antes do scaffold. Pesquisados em abril/2026.
> Ler antes de começar qualquer implementação.

---

## Mapa de Status

| Combinação | Status | Seção |
|---|---|---|
| @opennextjs/cloudflare + Next.js 15 | 🟡 Funciona com cuidados | [→](#1-opennextjscloudflare--nextjs-15) |
| Neon HTTP driver + CF Workers | ✅ Funciona | [→](#2-neon-driver--cloudflare-workers) |
| Better Auth + Cloudflare edge | 🟡 Funciona com cuidados | [→](#3-better-auth--cloudflare-edge) |
| Trigger.dev v3 + CF Pages | ✅ Funciona (by design) | [→](#4-triggerdev-v3--cloudflare) |
| Vercel AI SDK + CF edge | 🟡 Funciona com cuidados | [→](#5-vercel-ai-sdk--cloudflare-edge) |
| PostHog + Next.js 15 App Router | 🟡 Funciona com cuidados | [→](#6-posthog--nextjs-15-app-router) |
| pgvector + Drizzle + CF edge | 🟡 Funciona com cuidados | [→](#7-pgvector--drizzle--cloudflare-edge) |
| Sentry + Next.js 15 + CF Pages | ✅ Funciona | [→](#8-sentry--nextjs-15--cloudflare-pages) |
| Turborepo + pnpm + CF Pages | ✅ Funciona com config | [→](#9-turborepo--pnpm--cloudflare-pages) |

---

## 1. @opennextjs/cloudflare + Next.js 15

**Limitações conhecidas:**
- ISR (`revalidatePath`, `revalidateTag`) funciona parcialmente — KV não está autowired
- Streaming SSR (React 19 concurrent) pode ser inconsistente
- Limite de **10MB comprimido** por Worker — bundle grande pode estourar
- Zero Node.js APIs (`fs`, `crypto`, `stream`, `Buffer`) — deps que usam esses módulos quebram

**Soluções:**

```typescript
// next.config.ts — regras para bundle no edge
const nextConfig = {
  // Dependências pesadas que não precisam rodar no edge — ficam no Node
  serverExternalPackages: ["@sentry/node", "pino"],

  experimental: {
    // Desabilitar features que aumentam bundle desnecessariamente
  },
}
```

```typescript
// Em rotas que fazem fetch de dados em tempo real
// SEMPRE declarar — sem isso ISR pode cachear indefinidamente
export const dynamic = "force-dynamic"
```

**Regra prática:**
- `apps/web` (Astro) = estático, zero problema
- `apps/app` (Next.js) = testar `wrangler pages dev` localmente antes de cada deploy
- Monitorar tamanho do bundle: `pnpm --filter @workspace/app pages:build && du -sh .vercel/output`
- Usar `@opennextjs/cloudflare@canary` — releases frequentes corrigindo exatamente esses issues

---

## 2. Neon Driver + Cloudflare Workers

✅ **Compatível** — mas com regra de lifecyle obrigatória.

O driver `@neondatabase/serverless` usa HTTP/WebSocket (não TCP), funcionando nativamente no edge.

**Regra de ouro — nunca fazer isso:**
```typescript
// ❌ ERRADO — Pool global quebra no edge (Workers são stateless por request)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export default { async fetch() { /* usa pool global */ } }
```

**Sempre fazer assim:**
```typescript
// ✅ CORRETO — Pool criado e encerrado dentro do request handler
import { Pool } from "@neondatabase/serverless"

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const pool = new Pool({ connectionString: env.DATABASE_URL })
    try {
      const result = await pool.query("SELECT 1")
      return Response.json(result.rows)
    } finally {
      ctx.waitUntil(pool.end()) // limpa sem bloquear response
    }
  },
}
```

**Para Drizzle:**
```typescript
// packages/database/src/client.ts
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// neon() usa HTTP puro — mais simples, sem lifecycle manual
export function createDb(connectionString: string) {
  const sql = neon(connectionString)
  return drizzle(sql)
}
```

**Produção em escala:** Adicionar Cloudflare Hyperdrive para reduzir latência e gerenciar connection pooling automaticamente.

---

## 3. Better Auth + Cloudflare Edge

🟡 **Funciona**, mas depende do driver correto do Neon.

Better Auth roda como Route Handler do Next.js (`/api/auth/[...all]/route.ts`), que é compilado para CF Workers via `@opennextjs/cloudflare`. A chave é garantir que nenhum dep interno use `node-postgres` ou APIs de Node.

**Configuração correta:**
```typescript
// packages/auth/src/index.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { neon } from "@neondatabase/serverless"   // ← HTTP driver
import { drizzle } from "drizzle-orm/neon-http"   // ← neon-http, não neon-serverless

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  // ...
})
```

**Risco ativo:** Plugin `admin` e `organization` do Better Auth fazem queries complexas. Testar os dois no edge antes de ir para produção. Se houver problema, isolar auth em `apps/api` (Worker Node-compatible via `nodejs_compat`).

---

## 4. Trigger.dev v3 + Cloudflare

✅ **Sem problema** — a arquitetura é por design assim.

**Como funciona:**
```
CF Pages (Next.js) → tasks.trigger("job", payload) → Trigger.dev infra (Node.js) → executa job
```

Jobs **nunca** rodam dentro do CF Worker. Sua app só dispara via HTTP call para a API do Trigger.dev. Isso funciona de qualquer runtime, incluindo edge.

```typescript
// apps/app/src/app/api/some-action/route.ts
import { tasks } from "@trigger.dev/sdk/v3"
import { myJob } from "@workspace/jobs"

export async function POST(req: Request) {
  await tasks.trigger(myJob, { payload: "..." }) // HTTP call → Trigger.dev
  return Response.json({ ok: true })
}
```

**Implicação:** `packages/jobs` não precisa rodar no edge. Pode usar qualquer dep Node.js que precisar.

---

## 5. Vercel AI SDK + Cloudflare Edge

🟡 **Funciona para text/streaming básico. RSC streaming tem problemas.**

**O que funciona:**
```typescript
// apps/app/src/app/api/ai/chat/route.ts
import { streamText } from "ai"
import { openrouter } from "@workspace/ai"

export const runtime = "edge" // ← obrigatório declarar

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openrouter("anthropic/claude-3-5-sonnet"),
    messages,
  })
  return result.toDataStreamResponse() // ← streaming via ReadableStream (edge-compatible)
}
```

**O que NÃO fazer:**
```typescript
// ❌ Streaming de IA direto em Server Component não funciona bem no edge
// ❌ useChat com RSC mode tem inconsistências
// ❌ AI SDK UI components (streamUI) podem falhar no CF edge
```

**Regra:** Toda IA via Route Handler. Frontend usa `useChat` do `ai/react` chamando o Route Handler — funciona perfeitamente.

---

## 6. PostHog + Next.js 15 App Router

🟡 **Dois clientes distintos, não intercambiáveis.**

`posthog-js` usa APIs de browser (`window`, `document`) — não roda em Server Components.

**Configuração correta:**

```typescript
// apps/app/src/components/providers/posthog-provider.tsx
"use client" // ← obrigatório
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // controlar manualmente
    })
  }, [])
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

```typescript
// packages/analytics/src/server.ts — para Server Actions e Route Handlers
import { PostHog } from "posthog-node"

export const posthogServer = new PostHog(process.env.POSTHOG_KEY!, {
  host: process.env.POSTHOG_HOST,
})

// Usar em Server Actions:
// await posthogServer.capture({ distinctId: userId, event: "subscription_upgraded" })
```

**Regra:**
- Browser events (pageview, cliques, UI) → `posthog-js` via `PHProvider`
- Backend events (billing, auth, dados) → `posthog-node` em Server Actions/Route Handlers
- **Nunca** chamar `posthog.capture()` em Server Components direto

---

## 7. pgvector + Drizzle + Cloudflare Edge

🟡 **Insert funciona. Similarity search precisa de rota dedicada.**

Problema: queries de similaridade (cosine distance) usam codificação binária `Float32Array` que o CF edge não serializa corretamente.

**O que funciona no edge:**
```typescript
// INSERT de embedding — OK no edge
await db.insert(embeddings).values({
  orgId,
  content: text,
  embedding: Array.from(embeddingVector), // array normal, não Float32Array
  metadata: {},
})
```

**O que NÃO funciona no edge — mover para Route Handler com Node:**
```typescript
// apps/app/src/app/api/ai/search/route.ts
// NÃO declarar runtime = "edge" aqui — deixar rodar em Node (serverless function)
import { cosineDistance, desc, gt, sql } from "drizzle-orm"

export async function POST(req: Request) {
  const { query } = await req.json()
  const embedding = await generateEmbedding(query)

  // Similarity search via SQL — requer Node runtime
  const results = await db
    .select()
    .from(embeddings)
    .orderBy(sql`embedding <=> ${JSON.stringify(embedding)}::vector`)
    .limit(5)

  return Response.json(results)
}
```

**Regra:** Routes de busca vetorial não têm `export const runtime = "edge"`. Rodam como Serverless Functions normais (Node.js).

---

## 8. Sentry + Next.js 15 + Cloudflare Pages

✅ **Funciona out of the box.**

```bash
npx @sentry/wizard@latest -i nextjs
```

O wizard cria automaticamente `sentry.client.config.ts`, `sentry.server.config.ts`, e `sentry.edge.config.ts` — este último é o que roda nos CF Workers sem Node APIs.

Setar no Cloudflare Pages: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.

---

## 9. Turborepo + pnpm + Cloudflare Pages

✅ **Funciona com build command correto.**

**Configuração Cloudflare Pages (por app):**

```bash
# apps/app (Next.js)
Build command:   pnpm install --frozen-lockfile && pnpm --filter @workspace/app pages:build
Build output:    apps/app/.open-next
Root directory:  /

# apps/web (Astro)
Build command:   pnpm install --frozen-lockfile && pnpm --filter @workspace/web build
Build output:    apps/web/dist
Root directory:  /
```

**Problema comum:** CF Pages usa `npm` por padrão. Sempre sobrescrever para `pnpm install` explicitamente — senão o layout do `node_modules` quebra os workspace symlinks do Turborepo.

**Variável de ambiente necessária:**
```bash
# No Cloudflare Pages dashboard → Environment Variables
NODE_VERSION=20
```

---

## Resumo: Regras Invioláveis

1. **Nunca** usar `pg` ou `node-postgres` — sempre `@neondatabase/serverless`
2. **Nunca** criar Pool de DB globalmente — sempre dentro do request handler
3. **Nunca** chamar `posthog.capture()` em Server Components — usar `posthog-node` em actions
4. **Nunca** fazer similarity search pgvector com `runtime = "edge"` — manter em Node serverless
5. **Sempre** declarar `export const dynamic = "force-dynamic"` em rotas com dados em tempo real
6. **Sempre** testar com `wrangler pages dev` localmente antes de qualquer deploy
7. **Toda** lógica de IA via Route Handler — não inline em Server Components
8. Trigger.dev jobs são chamados via HTTP — nunca importados direto no edge
