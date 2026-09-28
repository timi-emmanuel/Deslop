import crypto from "node:crypto";
import { eq, and, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import { sessions, users, User, Session } from "../db/schema.js";

export const SESSION_COOKIE_NAME = "deslop_session";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * LESSON: Stateful Session Authentication
 * ---------------------------------------
 * 1. Why Stateful Sessions over Stateless JWTs?
 *    JWTs cannot be easily revoked if a user's account is compromised, unless you
 *    build a blocklist in Redis (which defeats the stateless claim).
 *    Stateful sessions let you instantly revoke sessions, view active login devices,
 *    and force-logout users from the database.
 *
 * 2. Why Hash the Session Token?
 *    If an attacker gains read access to the database (SQL injection or DB backup leak),
 *    they cannot use the stored `token_hash` values to authenticate because SHA-256
 *    is a one-way mathematical function. The raw token exists ONLY on the client's cookie.
 */

export interface SessionValidationResult {
  session: Session;
  user: User;
}

/**
 * Creates a new authenticated session for a user and stores its SHA-256 hash.
 */
export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ rawToken: string; expiresAt: Date } | null> {
  if (!db) {
    throw new Error("Database not connected");
  }

  // 1. Generate 32 bytes of cryptographic randomness (64 hex characters)
  const rawToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash the token before storing
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  // 3. Set expiration (30 days)
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  // 4. Save session in PostgreSQL
  await db.insert(sessions).values({
    userId,
    tokenHash,
    ipAddress,
    userAgent,
    expiresAt,
  });

  return { rawToken, expiresAt };
}

/**
 * Validates an incoming session cookie against PostgreSQL.
 */
export async function validateSession(rawToken: string): Promise<SessionValidationResult | null> {
  if (!db || !rawToken) return null;

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const now = new Date();

  // Find session where tokenHash matches and session has not expired
  const [foundSession] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
    .limit(1);

  if (!foundSession) {
    return null;
  }

  // Fetch the associated user
  const [foundUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, foundSession.userId))
    .limit(1);

  if (!foundUser) {
    return null;
  }

  return {
    session: foundSession,
    user: foundUser,
  };
}

/**
 * Destroys a session on logout.
 */
export async function invalidateSession(rawToken: string): Promise<void> {
  if (!db || !rawToken) return;

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}
