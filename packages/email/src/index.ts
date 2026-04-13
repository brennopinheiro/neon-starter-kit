import { Resend } from "resend"

export function createEmailClient(apiKey: string) {
  return new Resend(apiKey)
}

export type { Resend }
