export const dynamic = "force-dynamic"

export default function OrgDashboardPage({
  params,
}: {
  params: { orgSlug: string }
}) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Org: {params.orgSlug}</p>
    </main>
  )
}
