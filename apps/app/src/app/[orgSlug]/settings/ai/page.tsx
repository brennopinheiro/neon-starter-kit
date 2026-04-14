export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { organizationSettings, organization } from "@workspace/database"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AiSettingsForm } from "./form"

export default async function AiSettingsPage({
  params,
}: {
  params: { orgSlug: string }
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const org = await db.query.organization.findFirst({
    where: eq(organization.slug, params.orgSlug),
  })
  if (!org) redirect("/")

  const settings = await db.query.organizationSettings.findFirst({
    where: eq(organizationSettings.organizationId, org.id),
  })

  const hasApiKey = Boolean(settings?.aiApiKeyEncrypted)

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações de IA</h1>
        <p className="text-muted-foreground mt-1">
          Configure sua chave OpenRouter para usar modelos de IA nesta organização.
        </p>
      </div>
      <AiSettingsForm orgId={org.id} hasApiKey={hasApiKey} />
    </main>
  )
}
