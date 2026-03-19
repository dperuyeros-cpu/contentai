// ─── Productos y precios de ContentAI en Stripe ─────────────────────────────
// Cada plan tiene su price_id de Stripe (se crean en el dashboard de Stripe)
// Para testing, usamos precios dinámicos con amount

export const STRIPE_PLANS = {
  starter: {
    name: "Starter",
    price: 900, // $9.00 USD en centavos
    interval: "month" as const,
    description: "50 generaciones/mes · 1 usuario",
    planKey: "starter" as const,
  },
  pro: {
    name: "Pro",
    price: 2900, // $29.00 USD en centavos
    interval: "month" as const,
    description: "200 generaciones/mes · 1 usuario",
    planKey: "pro" as const,
  },
  team: {
    name: "Team",
    price: 7900, // $79.00 USD en centavos
    interval: "month" as const,
    description: "500 generaciones/mes · 5 usuarios",
    planKey: "team" as const,
  },
  business: {
    name: "Business",
    price: 14900, // $149.00 USD en centavos
    interval: "month" as const,
    description: "1,500 generaciones/mes · 10 usuarios",
    planKey: "business" as const,
  },
  enterprise: {
    name: "Enterprise",
    price: 29900, // $299.00 USD en centavos
    interval: "month" as const,
    description: "Generaciones ilimitadas · Usuarios ilimitados",
    planKey: "enterprise" as const,
  },
} as const;

export type StripePlanKey = keyof typeof STRIPE_PLANS;
