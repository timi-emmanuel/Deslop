import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { scans } from "../db/schema.js";
import { requireAuth } from "../plugins/auth.js";

/**
 * LESSON: Relational History Queries & Ownership Guards
 * -----------------------------------------------------
 * When fetching user data:
 * 1. Filter by Foreign Key (`eq(scans.userId, request.user.id)`).
 * 2. Order by Timestamp (`desc(scans.createdAt)`) so the newest scans appear first.
 * 3. Never trust user-supplied IDs blindly. When fetching `/api/scans/:id`, verify that
 *    the requesting user actually owns that scan record (Ownership Verification).
 */
export const scanRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ----------------------------------------
  // 1. Get Logged-in User's Scan History
  // ----------------------------------------
  app.get(
    "/api/scans/history",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      if (!db) {
        return reply.status(503).send({
          success: false,
          error: "Database unavailable.",
        });
      }

      const user = request.user!;

      const userScans = await db
        .select()
        .from(scans)
        .where(eq(scans.userId, user.id))
        .orderBy(desc(scans.createdAt))
        .limit(50);

      return reply.status(200).send({
        success: true,
        scans: userScans,
      });
    }
  );

  // ----------------------------------------
  // 2. Get Single Scan by ID
  // ----------------------------------------
  app.get("/api/scans/:id", async (request, reply) => {
    if (!db) {
      return reply.status(503).send({
        success: false,
        error: "Database unavailable.",
      });
    }

    const { id } = request.params as { id: string };

    const [foundScan] = await db
      .select()
      .from(scans)
      .where(eq(scans.id, id))
      .limit(1);

    if (!foundScan) {
      return reply.status(404).send({
        success: false,
        error: "Scan record not found.",
      });
    }

    return reply.status(200).send({
      success: true,
      scan: foundScan,
    });
  });
};
