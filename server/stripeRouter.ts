import Stripe from "stripe";
import { Request, Response } from "express";
import { updateUserPlan } from "./db";
import { STRIPE_PLANS, type StripePlanKey } from "./stripeProducts";
import { notifyOwner } from "./_core/notification";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

// ─── Crear sesión de checkout ─────────────────────────────────────────────────
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  planKey: StripePlanKey,
  origin: string,
): Promise<string> {
  const plan = STRIPE_PLANS[planKey];
if (!stripe) throw new Error("Stripe not configured");
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    allow_promotion_codes: true,
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `ContentAI ${plan.name}`,
            description: plan.description,
          },
          unit_amount: plan.price,
          recurring: {
            interval: plan.interval,
          },
        },
        quantity: 1,
      },
    ],
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      plan_key: planKey,
    },
    success_url: `${origin}/dashboard?payment=success&plan=${planKey}`,
    cancel_url: `${origin}/dashboard?payment=cancelled`,
  });

  return session.url!;
}

// ─── Webhook handler ──────────────────────────────────────────────────────────
export async function handleStripeWebhook(req: Request, res: Response) {
  if (!stripe) {
    return res.status(400).json({ error: "Stripe not configured" });
  }

  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Event: ${event.type} | ID: ${event.id}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.metadata?.user_id || session.client_reference_id || "0");
        const planKey = session.metadata?.plan_key as StripePlanKey;
        const customerEmail = session.metadata?.customer_email || "";
        const customerName = session.metadata?.customer_name || "";

        if (userId && planKey && STRIPE_PLANS[planKey]) {
          await updateUserPlan(userId, planKey, session.subscription as string);
          await notifyOwner({
            title: `💰 Nuevo pago Stripe - Plan ${STRIPE_PLANS[planKey].name}`,
            content: `${customerName} (${customerEmail}) se suscribió al plan ${STRIPE_PLANS[planKey].name} por $${STRIPE_PLANS[planKey].price / 100}/mes. Sesión: ${session.id}`,
          });
          console.log(`[Stripe] Plan ${planKey} activado para usuario ${userId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log(`[Stripe] Suscripción cancelada: ${subscription.id} | Customer: ${customerId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe] Pago fallido para: ${invoice.customer_email}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Evento no manejado: ${event.type}`);
    }
  } catch (err) {
    console.error("[Stripe Webhook] Error procesando evento:", err);
    return res.status(500).json({ error: "Error procesando webhook" });
  }

  return res.json({ received: true });
}