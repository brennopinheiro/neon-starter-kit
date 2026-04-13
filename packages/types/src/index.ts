export type { Database } from "@workspace/database"

export type Plan = "free" | "pro" | "enterprise"

export type OrgRole = "owner" | "admin" | "member"

export interface OrgContext {
  orgId: string
  orgSlug: string
  userId: string
  role: OrgRole
}
