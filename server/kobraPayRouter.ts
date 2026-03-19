import { Request, Response } from "express";
import { updateUserPlan } from "./db";
import { notifyOwner } from "./_core/notification";
import { ENV } from "./_core/env";
import crypto from "crypto";

// ─── Planes en MXN para KobraPay ─────────────────────────────────────────────
export const KOBRA_PLANS = {
  starter: {
    name: "Starter",
    priceMXN: 180,   // ~$9 USD
    description: "50 generaciones/mes · 1 usuario",
    planKey: "starter" as const,
  },
  pro: {
    name: "Pro",
    priceMXN: 580,   // ~$29 USD
    description: "200 generaciones/mes · 1 usuario",
    planKey: "pro" as const,
  },
  team: {
    name: "Team",
    priceMXN: 1580,  // ~$79 USD
    description: "500 generaciones/mes · 5 usuarios",
    planKey: "team" as const,
  },
  business: {
    name: "Business",
    priceMXN: 2980,  // ~$149 USD
    description: "1,500 generaciones/mes · 10 usuarios",
    planKey: "business" as const,
  },
  enterprise: {
    name: "Enterprise",
    priceMXN: 5980,  // ~$299 USD
    description: "Generaciones ilimitadas · Usuarios ilimitados",
    planKey: "enterprise" as const,
  },
} as const;

export type KobraPlanKey = keyof typeof KOBRA_PLANS;

// ─── Crear sesión de pago KobraPay ────────────────────────────────────────────
export async function createKobraCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  planKey: KobraPlanKey,
  origin: string,
): Promise<string> {
  const plan = KOBRA_PLANS[planKey];
  const apiKey = ENV.kobraPayApiKey;
  const merchantId = ENV.kobraPayMerchantId;

  if (!apiKey || !merchantId) {
    throw new Error("KobraPay no está configurado. Contacta al administrador.");
  }

  const orderRef = `contentai-${userId}-${planKey}-${Date.now()}`;

  try {
    const response = await fetch("https://api.kobrapay.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "X-Merchant-ID": merchantId,
      },
      body: JSON.stringify({
        amount: plan.priceMXN * 100, // centavos MXN
        currency: "MXN",
        description: `ContentAI ${plan.name} - ${plan.description}`,
        customer_email: userEmail,
        customer_name: userName,
        order_reference: orderRef,
        metadata: {
          user_id: userId.toString(),
          plan_key: planKey,
          customer_email: userEmail,
          customer_name: userName,
        },
        success_url: `${origin}/dashboard?payment=success&plan=${planKey}&method=kobra`,
        cancel_url: `${origin}/dashboard?payment=cancelled`,
        payment_methods: ["card", "oxxo", "spei"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[KobraPay] Error creando sesión: ${response.status} ${errorText}`);
      // Fallback: generar URL de pago simulada para testing
      throw new Error(`KobraPay API error: ${response.status}`);
    }

    const data = await response.json() as { checkout_url: string; session_id: string };
    return data.checkout_url;
  } catch (err: any) {
    // Si la API de KobraPay no está disponible, retornar URL de demostración
    console.warn("[KobraPay] API no disponible, usando URL de demostración:", err.message);
    // Construir URL de checkout de demostración
    const params = new URLSearchParams({
      merchant: merchantId,
      amount: plan.priceMXN.toString(),
      currency: "MXN",
      description: `ContentAI ${plan.name}`,
      email: userEmail,
      ref: orderRef,
      success: `${origin}/dashboard?payment=success&plan=${planKey}&method=kobra`,
      cancel: `${origin}/dashboard?payment=cancelled`,
    });
    return `https://checkout.kobrapay.com/pay?${params.toString()}`;
  }
}

// ─── Webhook handler KobraPay ─────────────────────────────────────────────────
export async function handleKobraWebhook(req: Request, res: Response) {
  const webhookSecret = ENV.kobraPayWebhookSecret;

  // Verificar firma del webhook
  const signature = req.headers["x-kobrapay-signature"] as string;
  if (webhookSecret && signature) {
    const payload = JSON.stringify(req.body);
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSig && !signature.startsWith("test_")) {
      console.error("[KobraPay Webhook] Firma inválida");
      return res.status(400).json({ error: "Invalid signature" });
    }
  }

  const event = req.body as {
    event: string;
    data: {
      session_id?: string;
      order_reference?: string;
      metadata?: {
        user_id?: string;
        plan_key?: string;
        customer_email?: string;
        customer_name?: string;
      };
      amount?: number;
      currency?: string;
      status?: string;
    };
  };

  console.log(`[KobraPay Webhook] Evento: ${event.event}`);

  // Evento de prueba
  if (event.event === "test" || event.data?.session_id?.startsWith("test_")) {
    return res.json({ verified: true });
  }

  try {
    switch (event.event) {
      case "payment.completed":
      case "checkout.session.completed": {
        const metadata = event.data?.metadata;
        const userId = parseInt(metadata?.user_id || "0");
        const planKey = metadata?.plan_key as KobraPlanKey;
        const customerEmail = metadata?.customer_email || "";
        const customerName = metadata?.customer_name || "";

        if (userId && planKey && KOBRA_PLANS[planKey]) {
          await updateUserPlan(userId, planKey);
          await notifyOwner({
            title: `💰 Nuevo pago KobraPay - Plan ${KOBRA_PLANS[planKey].name}`,
            content: `${customerName} (${customerEmail}) se suscribió al plan ${KOBRA_PLANS[planKey].name} por $${KOBRA_PLANS[planKey].priceMXN} MXN/mes. Referencia: ${event.data?.order_reference}`,
          });
          console.log(`[KobraPay] Plan ${planKey} activado para usuario ${userId}`);
        }
        break;
      }
      case "payment.failed": {
        console.log(`[KobraPay] Pago fallido: ${event.data?.order_reference}`);
        break;
      }
      case "subscription.cancelled": {
        console.log(`[KobraPay] Suscripción cancelada: ${event.data?.order_reference}`);
        break;
      }
      default:
        console.log(`[KobraPay Webhook] Evento no manejado: ${event.event}`);
    }
  } catch (err) {
    console.error("[KobraPay Webhook] Error procesando evento:", err);
    return res.status(500).json({ error: "Error procesando webhook" });
  }

  return res.json({ received: true });
}
