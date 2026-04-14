import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface InviteEmailProps {
  inviterName: string
  orgName: string
  inviteUrl: string
  expiresAt: string
}

export function InviteEmail({ inviterName, orgName, inviteUrl, expiresAt }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{inviterName} te convidou para {orgName}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", padding: "0 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "40px" }}>
            <Heading style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>
              Você foi convidado
            </Heading>
            <Text style={{ color: "#555", lineHeight: "1.6" }}>
              <strong>{inviterName}</strong> te convidou para entrar em <strong>{orgName}</strong>.
              Clique no botão abaixo para aceitar o convite.
            </Text>
            <Button
              href={inviteUrl}
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Aceitar convite
            </Button>
            <Hr style={{ borderColor: "#eee", margin: "32px 0" }} />
            <Text style={{ color: "#999", fontSize: "12px" }}>
              Este convite expira em {expiresAt}. Se você não esperava este email, pode ignorá-lo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default InviteEmail
