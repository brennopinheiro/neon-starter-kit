import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@workspace/database/schema"

export function createAuth(databaseUrl: string, appUrl: string) {
  const sql = neon(databaseUrl)
  const db = drizzle(sql, { schema })

  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
    baseURL: appUrl,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      organization(),
      admin(),
    ],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },
  })
}

export type Auth = ReturnType<typeof createAuth>
