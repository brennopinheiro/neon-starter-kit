import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { organization } from "./auth"

export const organizationSettings = pgTable("organization_settings", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .unique()
    .references(() => organization.id, { onDelete: "cascade" }),
  // AI: per-org OpenRouter API key (AES-256-GCM encrypted)
  aiApiKeyEncrypted: text("ai_api_key_encrypted"),
  aiApiKeyIv: text("ai_api_key_iv"),
  // Feature flags per org
  features: jsonb("features").$type<Record<string, boolean>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
