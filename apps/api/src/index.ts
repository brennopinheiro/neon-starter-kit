import Stripe from "stripe"
import { createDb } from "@workspace/database"
import { subscription } from "@workspace/database/schema"
import { eq } from "drizzle-orm"

interface Env {
  DATABASE_URL: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === "/webhooks/stripe" && request.method === "POST") {
      return handleStripeWebhook(request, env, ctx)
    }

    return new Response("Not Found", { status: 404 })
  },
}

async function handleStripeWebhook(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  })

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return new Response("Missing signature", { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await request.text()
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  const db = createDb(env.DATABASE_URL)

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const orgId = sub.metadata.orgId
        if (!orgId) break

        await db
          .insert(subscription)
          .values({
            id: sub.id,
            organizationId: orgId,
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            status: sub.status,
            plan: sub.status === "active" ? "pro" : "free",
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          })
          .onConflictDoUpdate({
            target: subscription.stripeSubscriptionId,
            set: {
              status: sub.status,
              stripePriceId: sub.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
              plan: sub.status === "active" ? "pro" : "free",
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
          })
        break
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        await db
          .update(subscription)
          .set({ status: "canceled", plan: "free" })
          .where(eq(subscription.stripeSubscriptionId, sub.id))
        break
      }
    }
  } finally {
    // Neon HTTP driver não requer cleanup
  }

  return Response.json({ received: true })
}
