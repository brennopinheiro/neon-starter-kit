"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { env } from "@/env"
import { organizationSettings } from "@workspace/database"
import { encryptApiKey } from "@workspace/ai/crypto"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function saveAiApiKey(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const orgId = formData.get("orgId") as string
  const apiKey = formData.get("apiKey") as string

  if (!orgId || !apiKey?.startsWith("sk-or-")) {
    throw new Error("Chave OpenRouter inválida")
  }

  const { encrypted, iv } = await encryptApiKey(apiKey, env.AI_ENCRYPTION_KEY)

  await db
    .insert(organizationSettings)
    .values({
      id: crypto.randomUUID(),
      organizationId: orgId,
      aiApiKeyEncrypted: encrypted,
      aiApiKeyIv: iv,
    })
    .onConflictDoUpdate({
      target: organizationSettings.organizationId,
      set: {
        aiApiKeyEncrypted: encrypted,
        aiApiKeyIv: iv,
        updatedAt: new Date(),
      },
    })

  revalidatePath(`/[orgSlug]/settings/ai`, "page")
}

export async function removeAiApiKey(orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  await db
    .update(organizationSettings)
    .set({ aiApiKeyEncrypted: null, aiApiKeyIv: null, updatedAt: new Date() })
    .where(eq(organizationSettings.organizationId, orgId))

  revalidatePath(`/[orgSlug]/settings/ai`, "page")
}
