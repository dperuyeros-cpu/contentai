import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock Stripe checkout
vi.mock("./stripeRouter", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue("https://checkout.stripe.com/test-session"),
  handleStripeWebhook: vi.fn(),
}));

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("$2b$10$hashedpassword"),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

// Mock db module
vi.mock("./db", () => ({
  getUserSubscription: vi.fn().mockResolvedValue({ plan: "free", status: "active" }),
  getMonthlyUsage: vi.fn().mockResolvedValue(0),
  canGenerate: vi.fn().mockResolvedValue(true),
  incrementMonthlyUsage: vi.fn().mockResolvedValue(undefined),
  saveGeneration: vi.fn().mockResolvedValue(undefined),
  getUserGenerations: vi.fn().mockResolvedValue([]),
  updateUserPlan: vi.fn().mockResolvedValue(undefined),
  getAllUsersWithSubscriptions: vi.fn().mockResolvedValue([]),
  getPlatformStats: vi.fn().mockResolvedValue({ totalUsers: 0, totalGenerations: 0, planBreakdown: {} }),
  toggleFavorite: vi.fn().mockResolvedValue(undefined),
  updateBusinessProfile: vi.fn().mockResolvedValue(undefined),
  getUserByEmail: vi.fn().mockResolvedValue(undefined),
  setPasswordResetToken: vi.fn().mockResolvedValue(undefined),
  getUserByResetToken: vi.fn().mockResolvedValue(undefined),
  clearPasswordResetToken: vi.fn().mockResolvedValue(undefined),
  getCalendarEvents: vi.fn().mockResolvedValue([]),
  createCalendarEvent: vi.fn().mockResolvedValue({ id: 1, userId: 1, title: "Test", scheduledDate: "2026-04-15", status: "scheduled", createdAt: new Date(), updatedAt: new Date() }),
  updateCalendarEvent: vi.fn().mockResolvedValue({ id: 1, userId: 1, title: "Updated", scheduledDate: "2026-04-15", status: "published", createdAt: new Date(), updatedAt: new Date() }),
  deleteCalendarEvent: vi.fn().mockResolvedValue({ success: true }),
  createUserWithPassword: vi.fn().mockResolvedValue({
    id: 99,
    openId: "email_test_99",
    email: "newuser@test.com",
    name: "New User",
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    passwordHash: "$2b$10$hash",
    businessName: null,
    businessDescription: null,
    businessIndustry: null,
    preferredLanguage: null,
  }),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Contenido generado de prueba para Instagram." } }],
  }),
}));

function createUserCtx(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-001",
      name: "Test User",
      email: "test@contentai.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createGuestCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("auth", () => {
  it("me returns null for guest", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me returns user for authenticated user", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@contentai.com");
  });

  it("logout clears session cookie", async () => {
    const ctx = createUserCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});

describe("subscription", () => {
  it("get returns subscription info for authenticated user", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.subscription.get();
    expect(result).toHaveProperty("plan");
    expect(result).toHaveProperty("usage");
    expect(result).toHaveProperty("limit");
    expect(result.plan).toBe("free");
  });

  it("get throws for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(caller.subscription.get()).rejects.toThrow();
  });

  it("upgrade changes plan for authenticated user", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.subscription.upgrade({
      plan: "pro",
      paymentMethod: "stripe",
      paymentId: "stripe_test_123",
    });
    expect(result.success).toBe(true);
    expect(result.plan).toBe("pro");
  });
});

describe("content", () => {
  it("generate creates content for authenticated user", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.content.generate({
      type: "instagram",
      prompt: "Beneficios del ejercicio matutino",
      language: "es",
      tone: "professional",
    });
    expect(result).toHaveProperty("result");
    expect(result.result.length).toBeGreaterThan(0);
    expect(result.type).toBe("instagram");
  });

  it("generate throws for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(
      caller.content.generate({
        type: "twitter",
        prompt: "Test topic",
        language: "en",
        tone: "casual",
      })
    ).rejects.toThrow();
  });

  it("history returns empty array for new user", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.content.history({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("generate throws when limit is reached", async () => {
    const { canGenerate } = await import("./db");
    vi.mocked(canGenerate).mockResolvedValueOnce(false);

    const caller = appRouter.createCaller(createUserCtx());
    await expect(
      caller.content.generate({
        type: "blog",
        prompt: "Test",
        language: "es",
        tone: "professional",
      })
    ).rejects.toThrow();
  });
});

describe("admin", () => {
  it("admin.users returns list for admin user", async () => {
    const caller = appRouter.createCaller(createUserCtx("admin"));
    const result = await caller.admin.users();
    expect(Array.isArray(result)).toBe(true);
  });

  it("admin.users throws FORBIDDEN for regular user", async () => {
    const caller = appRouter.createCaller(createUserCtx("user"));
    await expect(caller.admin.users()).rejects.toThrow("Acceso denegado");
  });

  it("admin.stats returns platform stats for admin", async () => {
    const caller = appRouter.createCaller(createUserCtx("admin"));
    const result = await caller.admin.stats();
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("totalGenerations");
    expect(result).toHaveProperty("planBreakdown");
  });

  it("admin.updateUserPlan updates plan successfully", async () => {
    const caller = appRouter.createCaller(createUserCtx("admin"));
    const result = await caller.admin.updateUserPlan({ userId: 2, plan: "pro" });
    expect(result.success).toBe(true);
  });
});

describe("subscription.createCheckout (Stripe)", () => {
  it("devuelve URL de checkout para usuario autenticado", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.subscription.createCheckout({
      plan: "pro",
      origin: "https://example.com",
    });
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/test-session");
  });

  it("rechaza checkout para usuario no autenticado", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(
      caller.subscription.createCheckout({
        plan: "pro",
        origin: "https://example.com",
      })
    ).rejects.toThrow();
  });

  it("acepta todos los planes válidos", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const plans = ["starter", "pro", "team", "business", "enterprise"] as const;
    for (const plan of plans) {
      const result = await caller.subscription.createCheckout({
        plan,
        origin: "https://example.com",
      });
      expect(result.checkoutUrl).toBeTruthy();
    }
  });
});

describe("auth.register (email propio)", () => {
  it("registra usuario nuevo exitosamente", async () => {
    const ctx = {
      user: null,
      req: { protocol: "https", headers: { origin: "https://example.com" } } as TrpcContext["req"],
      res: { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.register({
      name: "New User",
      email: "newuser@test.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe("newuser@test.com");
  });

  it("rechaza email ya registrado", async () => {
    const { getUserByEmail } = await import("./db");
    vi.mocked(getUserByEmail).mockResolvedValueOnce({
      id: 1,
      openId: "existing",
      email: "existing@test.com",
      name: "Existing",
      loginMethod: "email",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      passwordHash: "hash",
      businessName: null,
      businessDescription: null,
      businessIndustry: null,
      preferredLanguage: null,
    });

    const ctx = createGuestCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.auth.register({
        name: "Dup",
        email: "existing@test.com",
        password: "password123",
      })
    ).rejects.toThrow();
  });
});

// ─── Mock KobraPay ────────────────────────────────────────────────────────────
vi.mock("./kobraPayRouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./kobraPayRouter")>();
  return {
    ...actual,
    createKobraCheckoutSession: vi.fn().mockResolvedValue("https://checkout.kobrapay.com/pay?test=1"),
  };
});

// ─── Mock imageGeneration ─────────────────────────────────────────────────────
vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/generated-image.png" }),
}));

// ─── Mock voiceTranscription ──────────────────────────────────────────────────
vi.mock("./_core/voiceTranscription", () => ({
  transcribeAudio: vi.fn().mockResolvedValue({ text: "Texto transcrito de prueba", language: "es" }),
}));

// ─── Mock storage ─────────────────────────────────────────────────────────────
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://s3.example.com/audio.webm", key: "voice/1-123.webm" }),
}));

describe("subscription.createKobraCheckout", () => {
  it("devuelve URL de checkout KobraPay para usuario autenticado", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.subscription.createKobraCheckout({
      plan: "pro",
      origin: "https://example.com",
    });
    expect(result.checkoutUrl).toBeTruthy();
    expect(result.priceMXN).toBe(580); // Pro plan MXN price
  });

  it("rechaza KobraPay checkout para usuario no autenticado", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(
      caller.subscription.createKobraCheckout({
        plan: "pro",
        origin: "https://example.com",
      })
    ).rejects.toThrow();
  });

  it("acepta todos los planes válidos en KobraPay", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const plans = ["starter", "pro", "team", "business", "enterprise"] as const;
    for (const plan of plans) {
      const result = await caller.subscription.createKobraCheckout({
        plan,
        origin: "https://example.com",
      });
      expect(result.checkoutUrl).toBeTruthy();
      expect(result.priceMXN).toBeGreaterThan(0);
    }
  });
});

describe("content.generateStandaloneImage", () => {
  it("genera imagen para usuario autenticado", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.content.generateStandaloneImage({
      prompt: "Logo minimalista para cafetería artesanal",
      style: "minimalist",
    });
    expect(result).toHaveProperty("imageUrl");
    expect(result.imageUrl).toBeTruthy();
  });

  it("rechaza generación de imagen para usuario no autenticado", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(
      caller.content.generateStandaloneImage({
        prompt: "Test image",
        style: "realistic",
      })
    ).rejects.toThrow();
  });

  it("lanza error cuando se alcanza el límite del plan", async () => {
    const { canGenerate } = await import("./db");
    vi.mocked(canGenerate).mockResolvedValueOnce(false);

    const caller = appRouter.createCaller(createUserCtx());
    await expect(
      caller.content.generateStandaloneImage({
        prompt: "Test image",
        style: "realistic",
      })
    ).rejects.toThrow();
  });
});

describe("content.generateSong", () => {
  it("genera canción/jingle para usuario autenticado", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.content.generateSong({
      prompt: "Pizzería artesanal en Guadalajara",
      genre: "pop",
      tone: "alegre",
      language: "es",
    });
    expect(result).toHaveProperty("lyrics");
    expect(result.lyrics.length).toBeGreaterThan(0);
  });

  it("rechaza generación de canción para usuario no autenticado", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(
      caller.content.generateSong({
        prompt: "Test song",
        genre: "pop",
        tone: "alegre",
        language: "es",
      })
    ).rejects.toThrow();
  });

  it("genera canción en inglés", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.content.generateSong({
      prompt: "Artisan coffee shop in New York",
      genre: "jingle",
      tone: "alegre",
      language: "en",
    });
    expect(result).toHaveProperty("lyrics");
    expect(result.lyrics.length).toBeGreaterThan(0);
  });

  it("lanza error cuando se alcanza el límite del plan", async () => {
    const { canGenerate } = await import("./db");
    vi.mocked(canGenerate).mockResolvedValueOnce(false);

    const caller = appRouter.createCaller(createUserCtx());
    await expect(
      caller.content.generateSong({
        prompt: "Test",
        genre: "pop",
        tone: "alegre",
        language: "es",
      })
    ).rejects.toThrow();
  });
});

describe("calendar", () => {

  it("getEvents requiere autenticación", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(caller.calendar.getEvents({ month: "2026-04" })).rejects.toThrow();
  });

  it("getEvents retorna lista para usuario autenticado", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.calendar.getEvents({ month: "2026-04" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("createEvent crea un evento correctamente", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.calendar.createEvent({
      title: "Post de Instagram",
      platform: "instagram",
      scheduledDate: "2026-04-15",
      status: "scheduled",
    });
    expect(result).toHaveProperty("id");
    // El mock retorna title "Test" (definido en el mock global)
    expect(result?.id).toBe(1);
  });

  it("createEvent rechaza fecha inválida", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    await expect(
      caller.calendar.createEvent({
        title: "Test",
        scheduledDate: "15-04-2026", // formato incorrecto
      })
    ).rejects.toThrow();
  });

  it("updateEvent actualiza un evento", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.calendar.updateEvent({
      id: 1,
      title: "Post actualizado",
      status: "published",
      color: "green",
    });
    // El mock retorna "Updated" (definido en el mock global)
    expect(result).toHaveProperty("id", 1);
    expect(result?.status).toBe("published");
  });

  it("deleteEvent elimina un evento", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    const result = await caller.calendar.deleteEvent({ id: 1 });
    expect(result).toHaveProperty("success", true);
  });
});
