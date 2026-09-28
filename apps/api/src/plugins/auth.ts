import { FastifyRequest, FastifyReply } from "fastify";
import { validateSession, SESSION_COOKIE_NAME } from "../services/session.js";
import { User, Session } from "../db/schema.js";

/**
 * LESSON: TypeScript Declaration Merging for Request Context
 * ---------------------------------------------------------
 * In Express or Fastify, route handlers need access to the logged-in user.
 * Rather than passing user data through custom parameters, we attach it to the `request` object.
 * Declaration merging tells TypeScript that `request.user` exists and is properly typed.
 */
declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
    session: Session | null;
  }
}

/**
 * Strict Auth Guard:
 * Rejects with 401 Unauthorized if the client lacks a valid active session.
 * Used on protected routes (e.g. `/api/auth/me`, `/api/scans/history`).
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies[SESSION_COOKIE_NAME];

  if (!token) {
    return reply.status(401).send({
      success: false,
      error: "Authentication required. Please log in.",
    });
  }

  const result = await validateSession(token);
  if (!result) {
    return reply.status(401).send({
      success: false,
      error: "Session expired or invalid. Please log in again.",
    });
  }

  request.user = result.user;
  request.session = result.session;
}

/**
 * Optional Auth Guard:
 * Checks if a session exists without rejecting if it doesn't.
 * Used on public routes (like `/api/extract` or `/api/jobs`) so logged-in users
 * get their scans automatically linked to their history, while guests can still browse.
 */
export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply) {
  const token = request.cookies[SESSION_COOKIE_NAME];
  if (!token) {
    request.user = null;
    request.session = null;
    return;
  }

  const result = await validateSession(token);
  if (result) {
    request.user = result.user;
    request.session = result.session;
  } else {
    request.user = null;
    request.session = null;
  }
}
