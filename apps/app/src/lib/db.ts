import { createDb } from "@workspace/database"
import { env } from "@/env"

export const db = createDb(env.DATABASE_URL)
