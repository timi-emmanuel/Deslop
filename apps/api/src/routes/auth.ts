import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { hashPassword, verifyPassword } from "../services/password.js";
import {
  createSession,
  invalidateSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "../services/session.js";
import { requireAuth } from "../plugins/auth.js";
import { config } from "../config.js";

const registerSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(1).max(120).trim().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

/**
 * LESSON: Auth Route Design & Security Defenses
 * ---------------------------------------------
 * 1. User Enumeration Defense:
 *    When login fails, we return generic "Invalid email or password" error.
 *    If you return "Email does not exist", hackers can test list of 1,000,000 emails
 *    to discover who has an account on your platform.
 *
 * 2. Defense-in-Depth Sanitization:
 *    Never return `password_hash` to the client. Even though it's hashed,
 *    leaking password hashes over the wire is a critical vulnerability.
 *
 * 3. Secure Cookie Flags:
 *    - `httpOnly: true` (JavaScript cannot read cookie -> blocks XSS token theft)
 *    - `secure: true` in production (Transmitted only over HTTPS)
 *    - `sameSite: "lax"` (Protects against CSRF attacks)
 */
export const authRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ----------------------------------------
  // 1. Register a new user
  // ----------------------------------------
  app.post("/api/auth/register", async (request, reply) => {
    if (!db) {
      return reply.status(503).send({
        success: false,
        error: "Database service is currently unavailable. Please configure DATABASE_URL.",
      });
    }

    const parseResult = registerSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: parseResult.error.errors[0]?.message || "Invalid registration payload",
      });
    }

    const { email, password, name } = parseResult.data;

    // Check if user already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return reply.status(409).send({
        success: false,
        error: "An account with this email address already exists.",
      });
    }

    // Hash password with scrypt + cryptographic salt
    const passwordHash = await hashPassword(password);

    // Insert user into PostgreSQL
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: name || null,
        plan: "free",
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        plan: users.plan,
        createdAt: users.createdAt,
      });

    // Create session
    const ipAddress = request.ip;
    const userAgent = request.headers["user-agent"];
    const sessionData = await createSession(newUser.id, ipAddress, userAgent);

    if (sessionData) {
      reply.setCookie(SESSION_COOKIE_NAME, sessionData.rawToken, {
        path: "/",
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
    }

    return reply.status(201).send({
      success: true,
      user: newUser,
    });
  });

  // ----------------------------------------
  // 2. Login
  // ----------------------------------------
  app.post("/api/auth/login", async (request, reply) => {
    if (!db) {
      return reply.status(503).send({
        success: false,
        error: "Database service is currently unavailable. Please configure DATABASE_URL.",
      });
    }

    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: "Please provide a valid email and password.",
      });
    }

    const { email, password } = parseResult.data;

    // Fetch user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Verify password with timing-safe comparison
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return reply.status(401).send({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Create session
    const ipAddress = request.ip;
    const userAgent = request.headers["user-agent"];
    const sessionData = await createSession(user.id, ipAddress, userAgent);

    if (sessionData) {
      reply.setCookie(SESSION_COOKIE_NAME, sessionData.rawToken, {
        path: "/",
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
    }

    return reply.status(200).send({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  });

  // ----------------------------------------
  // 3. Logout
  // ----------------------------------------
  app.post("/api/auth/logout", async (request, reply) => {
    const token = request.cookies[SESSION_COOKIE_NAME];
    if (token) {
      await invalidateSession(token);
    }

    reply.clearCookie(SESSION_COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
    });

    return reply.status(200).send({
      success: true,
      message: "Logged out successfully.",
    });
  });

  // ----------------------------------------
  // 4. Get Current User Profile (Protected)
  // ----------------------------------------
  app.get(
    "/api/auth/me",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const user = request.user!;
      return reply.status(200).send({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          createdAt: user.createdAt,
        },
      });
    }
  );
};
