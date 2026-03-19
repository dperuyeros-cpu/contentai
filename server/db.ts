import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, subscriptions, generations, monthlyUsage,
  calendarEvents, type CalendarEvent, type InsertCalendarEvent,
  PLANS, type PlanType, type InsertGeneration,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });

    // Crear suscripción gratuita si no existe
    const existingUser = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
    if (existingUser[0]) {
      const existingSub = await db.select().from(subscriptions).where(eq(subscriptions.userId, existingUser[0].id)).limit(1);
      if (existingSub.length === 0) {
        await db.insert(subscriptions).values({
          userId: existingUser[0].id,
          plan: "free",
          status: "active",
        });
      }
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Suscripciones ────────────────────────────────────────────────────────────

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0] ?? null;
}

export async function updateUserPlan(
  userId: number,
  plan: PlanType,
  stripeId?: string,
  kobraId?: string,
) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  if (existing.length > 0) {
    await db.update(subscriptions).set({
      plan,
      status: "active",
      stripeSubscriptionId: stripeId ?? existing[0].stripeSubscriptionId,
      kobraPaySubscriptionId: kobraId ?? existing[0].kobraPaySubscriptionId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({
      userId,
      plan,
      status: "active",
      stripeSubscriptionId: stripeId,
      kobraPaySubscriptionId: kobraId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }
}

// ─── Uso mensual ──────────────────────────────────────────────────────────────

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function getMonthlyUsage(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const month = getCurrentMonth();
  const result = await db.select().from(monthlyUsage)
    .where(and(eq(monthlyUsage.userId, userId), eq(monthlyUsage.month, month)))
    .limit(1);
  return result[0]?.count ?? 0;
}

export async function incrementMonthlyUsage(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const month = getCurrentMonth();
  const existing = await db.select().from(monthlyUsage)
    .where(and(eq(monthlyUsage.userId, userId), eq(monthlyUsage.month, month)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(monthlyUsage)
      .set({ count: sql`${monthlyUsage.count} + 1` })
      .where(and(eq(monthlyUsage.userId, userId), eq(monthlyUsage.month, month)));
  } else {
    await db.insert(monthlyUsage).values({ userId, month, count: 1 });
  }
}

export async function canGenerate(userId: number, plan: PlanType): Promise<boolean> {
  const limit = PLANS[plan].limit;
  if (limit === -1) return true;
  const usage = await getMonthlyUsage(userId);
  return usage < limit;
}

// ─── Generaciones ─────────────────────────────────────────────────────────────

export async function saveGeneration(data: InsertGeneration) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(generations).values(data);
}

export async function getUserGenerations(userId: number, limit = 20, type?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = type
    ? and(eq(generations.userId, userId), eq(generations.type, type as InsertGeneration["type"]))
    : eq(generations.userId, userId);
  return db.select().from(generations)
    .where(conditions)
    .orderBy(desc(generations.createdAt))
    .limit(limit);
}

export async function toggleFavorite(userId: number, generationId: number, isFavorite: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(generations)
    .set({ isFavorite: isFavorite })
    .where(and(eq(generations.id, generationId), eq(generations.userId, userId)));
}

// ─── Perfil de negocio ────────────────────────────────────────────────────────

export async function updateBusinessProfile(
  userId: number,
  data: {
    businessName?: string;
    businessDescription?: string;
    businessIndustry?: string;
    preferredLanguage?: "es" | "en";
  },
) {
  const db = await getDb();
  if (!db) return;
  const updateData: Record<string, unknown> = {};
  if (data.businessName !== undefined) updateData.businessName = data.businessName;
  if (data.businessDescription !== undefined) updateData.businessDescription = data.businessDescription;
  if (data.businessIndustry !== undefined) updateData.businessIndustry = data.businessIndustry;
  if (data.preferredLanguage !== undefined) updateData.preferredLanguage = data.preferredLanguage;
  if (Object.keys(updateData).length > 0) {
    await db.update(users).set(updateData).where(eq(users.id, userId));
  }
}

// ─── Auth propio (email + contraseña) ───────────────────────────────────────

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserWithPassword(
  data: { name: string; email: string; passwordHash: string }
) {
  const db = await getDb();
  if (!db) throw new Error("DB no disponible");
  const openId = `email_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  await db.insert(users).values({
    openId,
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    loginMethod: "email",
    lastSignedIn: new Date(),
  });
  const created = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
  if (created[0]) {
    await db.insert(subscriptions).values({
      userId: created[0].id,
      plan: "free",
      status: "active",
    });
  }
  return created[0];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getAllUsersWithSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  const allSubs = await db.select().from(subscriptions);
  return allUsers.map(u => ({
    ...u,
    subscription: allSubs.find(s => s.userId === u.id) ?? null,
  }));
}

export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalGenerations: 0, planBreakdown: {} };
  const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
  const totalGenerationsResult = await db.select({ count: sql<number>`count(*)` }).from(generations);
  const planBreakdownResult = await db.select({
    plan: subscriptions.plan,
    count: sql<number>`count(*)`,
  }).from(subscriptions).groupBy(subscriptions.plan);

  return {
    totalUsers: Number(totalUsersResult[0]?.count ?? 0),
    totalGenerations: Number(totalGenerationsResult[0]?.count ?? 0),
    planBreakdown: Object.fromEntries(planBreakdownResult.map(r => [r.plan, Number(r.count)])),
  };
}

// ─── Recuperación de contraseña ──────────────────────────────────────────────

export async function setPasswordResetToken(userId: number, token: string, expiry: Date) {
  const db = await getDb();
  if (!db) throw new Error("DB no disponible");
  await db.update(users).set({
    passwordResetToken: token,
    passwordResetExpiry: expiry,
  }).where(eq(users.id, userId));
}

export async function getUserByResetToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.passwordResetToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function clearPasswordResetToken(userId: number, newPasswordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("DB no disponible");
  await db.update(users).set({
    passwordHash: newPasswordHash,
    passwordResetToken: null,
    passwordResetExpiry: null,
  }).where(eq(users.id, userId));
}

// ─── Calendario Editorial ────────────────────────────────────────────────────

export async function getCalendarEvents(userId: number, month: string) {
  // month = "YYYY-MM"
  const db = await getDb();
  if (!db) return [];
  const all = await db.select().from(calendarEvents)
    .where(and(eq(calendarEvents.userId, userId), sql`scheduledDate LIKE ${month + "-%"}`))
    .orderBy(calendarEvents.scheduledDate);
  return all;
}

export async function createCalendarEvent(data: InsertCalendarEvent) {
  const db = await getDb();
  if (!db) throw new Error("DB no disponible");
  await db.insert(calendarEvents).values(data);
  const created = await db.select().from(calendarEvents)
    .where(and(eq(calendarEvents.userId, data.userId), eq(calendarEvents.scheduledDate, data.scheduledDate)))
    .orderBy(desc(calendarEvents.createdAt))
    .limit(1);
  return created[0];
}

export async function updateCalendarEvent(id: number, userId: number, data: Partial<InsertCalendarEvent>) {
  const db = await getDb();
  if (!db) throw new Error("DB no disponible");
  await db.update(calendarEvents).set(data).where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
  const updated = await db.select().from(calendarEvents).where(eq(calendarEvents.id, id)).limit(1);
  return updated[0];
}

export async function deleteCalendarEvent(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB no disponible");
  await db.delete(calendarEvents).where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
  return { success: true };
}
