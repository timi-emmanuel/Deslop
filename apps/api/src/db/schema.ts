import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

/**
 * LESSON: Relational Schema Design & Data Integrity
 * ------------------------------------------------
 * In relational databases, we define explicit constraints:
 * 1. Primary Keys: `uuid().defaultRandom().primaryKey()`
 * 2. Uniqueness: `email` must be unique to prevent duplicate accounts.
 * 3. Foreign Keys & Cascading:
 *    When `users` is deleted, `references(() => users.id, { onDelete: "cascade" })`
 *    tells PostgreSQL to automatically clean up all associated sessions and scans.
 *    Without CASCADE, orphaned rows would remain in the database forever.
 * 4. JSONB:
 *    Postgres supports binary JSON (`jsonb`). It gives us the flexibility of NoSQL
 *    for complex design token trees while retaining ACID guarantees.
 */

// ==========================================
// 1. Users Table
// ==========================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }),
  plan: varchar("plan", { length: 20 }).default("free").notNull(), // 'free' | 'pro'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 2. Sessions Table (Stateful Auth)
// ==========================================
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // We store the SHA-256 hash of the session token, NEVER the raw token itself
  tokenHash: text("token_hash").notNull().unique(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 3. Scans Table (Scan History & Caching)
// ==========================================
export const scans = pgTable("scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // null for guest scans
  url: text("url").notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
  screenshotUrl: text("screenshot_url"),
  tokens: jsonb("tokens").notNull(), // Synthesized tokens JSON blob
  markdown: text("markdown").notNull(), // Full design system guidelines markdown
  brandArchetype: varchar("brand_archetype", { length: 120 }),
  scanDurationMs: integer("scan_duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Infer TypeScript types directly from the Drizzle schemas (Zero duplicate types!)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;
