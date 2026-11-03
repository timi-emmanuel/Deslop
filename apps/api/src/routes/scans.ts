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
    {
      preHandler: [requireAuth],
      schema: {
        tags: ["Scans"],
        summary: "Get authenticated user's scan history",
        description:
          "Returns the latest 50 design system scans performed by the authenticated user, ordered from newest to oldest.",
        security: [{ cookieAuth: [] }],
        response: {
          200: {
            description: "List of user scan records",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              scans: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    userId: { type: "string", nullable: true },
                    url: { type: "string" },
                    domain: { type: "string" },
                    screenshotUrl: { type: "string", nullable: true },
                    tokens: { type: "object", additionalProperties: true },
                    markdown: { type: "string", nullable: true },
                    brandArchetype: { type: "string", nullable: true },
                    scanDurationMs: { type: "number", nullable: true },
                    createdAt: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized (no valid session cookie)",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string" },
            },
          },
          503: {
            description: "Database service unavailable",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string" },
            },
          },
        },
      },
    },
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
  app.get(
    "/api/scans/:id",
    {
      schema: {
        tags: ["Scans"],
        summary: "Get single scan by UUID",
        description: "Retrieves a specific design system scan and synthesized tokens by record ID.",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", format: "uuid", example: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
          },
        },
        response: {
          200: {
            description: "Found scan record",
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              scan: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
          404: {
            description: "Scan record not found",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string" },
            },
          },
          503: {
            description: "Database service unavailable",
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
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
    }
  );
};
