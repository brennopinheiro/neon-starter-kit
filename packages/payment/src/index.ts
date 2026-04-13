import Stripe from "stripe"

export function createStripeClient(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: "2025-03-31.basil",
  })
}

export async function createCheckoutSession({
  stripe,
  priceId,
  orgId,
  userId,
  successUrl,
  cancelUrl,
}: {
  stripe: Stripe
  priceId: string
  orgId: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { orgId, userId },
    subscription_data: {
      metadata: { orgId, userId },
    },
  })
}

export async function createBillingPortalSession({
  stripe,
  customerId,
  returnUrl,
}: {
  stripe: Stripe
  customerId: string
  returnUrl: string
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export { createStripeClient as stripe }
export * from "./config"
