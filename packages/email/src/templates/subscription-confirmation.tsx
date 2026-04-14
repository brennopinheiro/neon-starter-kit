import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface SubscriptionConfirmationProps {
  name: string
  planName: string
  amount: string
  nextBillingDate: string
}

export function SubscriptionConfirmationEmail({
  name,
  planName,
  amount,
  nextBillingDate,
}: SubscriptionConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Assinatura {planName} ativada com sucesso</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", padding: "0 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "40px" }}>
            <Heading style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>
              Assinatura ativada!
            </Heading>
            <Text style={{ color: "#555", lineHeight: "1.6" }}>
              Olá, {name}! Sua assinatura do plano <strong>{planName}</strong> foi ativada com sucesso.
            </Text>
            <Section
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                padding: "16px 20px",
                margin: "24px 0",
              }}
            >
              <Text style={{ margin: "4px 0", color: "#555" }}>
                <strong>Plano:</strong> {planName}
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                <strong>Valor:</strong> {amount}
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                <strong>Próxima cobrança:</strong> {nextBillingDate}
              </Text>
            </Section>
            <Hr style={{ borderColor: "#eee", margin: "32px 0" }} />
            <Text style={{ color: "#999", fontSize: "12px" }}>
              Você pode gerenciar sua assinatura a qualquer momento nas configurações de billing.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default SubscriptionConfirmationEmail
