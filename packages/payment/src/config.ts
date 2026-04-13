export type PricingPlan = {
  id: string
  name: string
  description: string
  stripePriceId: string
  price: number
  currency: "brl" | "usd"
  interval: "month" | "year"
  features: string[]
}

export const PLANS: Record<string, PricingPlan> = {
  pro_monthly: {
    id: "pro_monthly",
    name: "Pro",
    description: "Para times que estão crescendo",
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
    price: 9700, // R$ 97,00 em centavos
    currency: "brl",
    interval: "month",
    features: [
      "Até 10 usuários",
      "Projetos ilimitados",
      "Suporte prioritário",
      "Acesso à API",
    ],
  },
  pro_yearly: {
    id: "pro_yearly",
    name: "Pro (Anual)",
    description: "Para times que estão crescendo — melhor custo-benefício",
    stripePriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? "",
    price: 87000, // R$ 870,00 em centavos (2 meses grátis)
    currency: "brl",
    interval: "year",
    features: [
      "Até 10 usuários",
      "Projetos ilimitados",
      "Suporte prioritário",
      "Acesso à API",
    ],
  },
}
