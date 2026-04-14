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

interface WelcomeEmailProps {
  name: string
  orgSlug: string
  appUrl: string
}

export function WelcomeEmail({ name, orgSlug, appUrl }: WelcomeEmailProps) {
  const dashboardUrl = `${appUrl}/${orgSlug}`

  return (
    <Html>
      <Head />
      <Preview>Bem-vindo! Sua conta está pronta.</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", padding: "0 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "40px" }}>
            <Heading style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>
              Olá, {name}!
            </Heading>
            <Text style={{ color: "#555", lineHeight: "1.6" }}>
              Sua conta foi criada com sucesso. Clique no botão abaixo para acessar seu dashboard.
            </Text>
            <Button
              href={dashboardUrl}
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Acessar Dashboard
            </Button>
            <Hr style={{ borderColor: "#eee", margin: "32px 0" }} />
            <Text style={{ color: "#999", fontSize: "12px" }}>
              Se você não criou esta conta, pode ignorar este email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
