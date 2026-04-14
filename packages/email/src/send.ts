import { Resend } from "resend"
import type { ReactElement } from "react"

interface SendEmailOptions {
  resend: Resend
  from: string
  to: string | string[]
  subject: string
  react: ReactElement
}

export async function sendEmail({ resend, from, to, subject, react }: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
  })

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }

  return data
}
