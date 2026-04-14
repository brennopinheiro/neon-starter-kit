export const runtime = "edge"

import { streamText } from "ai"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { env } from "@/env"
import { organizationSettings, organization } from "@workspace/database"
import { getOpenRouterModel, decryptApiKey } from "@workspace/ai"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { messages, orgSlug } = await request.json()

  // Buscar chave API da org (ou fallback para chave global)
  const org = await db.query.organization.findFirst({
    where: eq(organization.slug, orgSlug),
  })

  let apiKey = env.OPENROUTER_API_KEY ?? ""

  if (org) {
    const settings = await db.query.organizationSettings.findFirst({
      where: eq(organizationSettings.organizationId, org.id),
    })

    if (settings?.aiApiKeyEncrypted && settings.aiApiKeyIv) {
      apiKey = await decryptApiKey(
        settings.aiApiKeyEncrypted,
        settings.aiApiKeyIv,
        env.AI_ENCRYPTION_KEY
      )
    }
  }

  if (!apiKey) {
    return Response.json(
      { error: "Nenhuma chave de IA configurada" },
      { status: 422 }
    )
  }

  const model = getOpenRouterModel(apiKey)

  const result = streamText({
    model,
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
