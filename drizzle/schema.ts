import {
  int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean
} from "drizzle-orm/mysql-core";

// ─── Usuarios ────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Perfil de negocio (onboarding inteligente)
  businessDescription: text("businessDescription"),
  businessIndustry: varchar("businessIndustry", { length: 64 }),
  businessName: varchar("businessName", { length: 255 }),
  preferredLanguage: mysqlEnum("preferredLanguage", ["es", "en"]).default("es"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  passwordResetToken: varchar("passwordResetToken", { length: 128 }),
  passwordResetExpiry: timestamp("passwordResetExpiry"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Planes de suscripción ───────────────────────────────────────────────────
export const PLANS = {
  free:         { name: "Gratis",      limit: 10,   price: 0,   maxUsers: 1,  devices: 1 },
  starter:      { name: "Starter",     limit: 50,   price: 9,   maxUsers: 1,  devices: 2 },
  pro:          { name: "Pro",         limit: 200,  price: 29,  maxUsers: 1,  devices: 3 },
  team:         { name: "Team",        limit: 500,  price: 79,  maxUsers: 5,  devices: 5 },
  business:     { name: "Business",    limit: 1500, price: 149, maxUsers: 10, devices: 10 },
  enterprise:   { name: "Enterprise",  limit: -1,   price: 299, maxUsers: -1, devices: -1 },
} as const;

export type PlanType = keyof typeof PLANS;

// ─── Tipos de contenido ──────────────────────────────────────────────────────
export const CONTENT_TYPES = [
  // Redes Sociales
  "instagram_post", "instagram_story", "instagram_carousel", "instagram_reel",
  "tiktok_script", "youtube_short", "twitter_post", "linkedin_post", "facebook_post",
  // Anuncios Publicitarios
  "facebook_ad", "google_ad", "instagram_ad", "tiktok_ad",
  "whatsapp_promo", "radio_ad", "tv_ad", "flyer_copy", "email_campaign",
  // Contenido Editorial
  "blog_article", "news_article", "press_release", "newsletter", "web_copy",
  // Video y Comerciales
  "video_script", "commercial_script", "product_commercial",
  // Branding
  "brand_identity", "brand_slogan", "brand_story", "mission_vision",
  "business_pitch", "elevator_pitch",
  // Especializado
  "menu_description", "property_listing", "beverage_brand", "event_promo",
  "loyalty_campaign", "review_response",
  // Plan de contenido
  "content_plan_30days", "business_analysis",
] as const;

export type ContentType = typeof CONTENT_TYPES[number];

// ─── Industrias ───────────────────────────────────────────────────────────────
export const INDUSTRIES = [
  "general", "restaurant", "bar_nightclub", "coffee_shop", "bakery", "ice_cream_shop",
  "jewelry", "clothing_store", "beauty_salon", "spa", "gym", "fitness_instructor",
  "pharmacy", "dental_clinic", "medical_clinic", "veterinary",
  "real_estate", "construction", "architecture",
  "hotel", "travel_agency", "school", "university",
  "tequila_mezcal", "craft_beer", "winery", "beverage_brand",
  "tech_company", "ecommerce", "marketing_agency", "media",
  "hardware_store", "flower_shop", "auto_shop", "other",
] as const;

export type IndustryType = typeof INDUSTRIES[number];

// ─── Equipos ─────────────────────────────────────────────────────────────────
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  plan: mysqlEnum("plan", ["free","starter","pro","team","business","enterprise"]).default("free").notNull(),
  maxMembers: int("maxMembers").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Team = typeof teams.$inferSelect;

export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member").notNull(),
  inviteEmail: varchar("inviteEmail", { length: 320 }),
  status: mysqlEnum("status", ["active", "invited", "removed"]).default("active").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;

// ─── Suscripciones ────────────────────────────────────────────────────────────
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamId: int("teamId"),
  plan: mysqlEnum("plan", ["free","starter","pro","team","business","enterprise"]).default("free").notNull(),
  status: mysqlEnum("status", ["active","cancelled","expired","pending"]).default("active").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  kobraPaySubscriptionId: varchar("kobraPaySubscriptionId", { length: 255 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ─── Generaciones ─────────────────────────────────────────────────────────────
export const generations = mysqlTable("generations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamId: int("teamId"),
  type: varchar("type", { length: 64 }).notNull(),
  industry: varchar("industry", { length: 64 }).default("general").notNull(),
  prompt: text("prompt").notNull(),
  result: text("result").notNull(),
  imageUrl: text("imageUrl"),
  language: mysqlEnum("language", ["es", "en"]).default("es").notNull(),
  tone: varchar("tone", { length: 32 }).default("professional").notNull(),
  isFavorite: boolean("isFavorite").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = typeof generations.$inferInsert;

// ─── Uso mensual ──────────────────────────────────────────────────────────────
export const monthlyUsage = mysqlTable("monthly_usage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamId: int("teamId"),
  month: varchar("month", { length: 7 }).notNull(),
  count: int("count").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MonthlyUsage = typeof monthlyUsage.$inferSelect;

// ─── Calendario Editorial ──────────────────────────────────────────────────
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  contentType: varchar("contentType", { length: 64 }),
  platform: varchar("platform", { length: 64 }),
  scheduledDate: varchar("scheduledDate", { length: 10 }).notNull(), // YYYY-MM-DD
  scheduledTime: varchar("scheduledTime", { length: 5 }), // HH:MM
  status: mysqlEnum("status", ["draft", "scheduled", "published", "cancelled"]).default("draft").notNull(),
  generationId: int("generationId"), // link to a generation if any
  color: varchar("color", { length: 32 }).default("blue"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;
