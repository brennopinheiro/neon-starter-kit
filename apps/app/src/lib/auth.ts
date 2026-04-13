import { createAuth } from "@workspace/auth"
import { env } from "@/env"

export const auth = createAuth(env.DATABASE_URL, env.NEXT_PUBLIC_APP_URL)
