import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * LESSON: The Universal Backend Health Check
 * -------------------------------------------
 * In modern cloud infrastructure (Docker, Kubernetes, AWS, Render), container orchestrators
 * need a lightweight way to know if your server is alive and accepting traffic.
 *
 * They send a ping to `GET /health` every 10–30 seconds.
 * - HTTP 200: Healthy, keep routing user traffic here.
 * - Any error or timeout: Unhealthy, stop sending traffic and trigger an auto-restart.
 */
export const healthRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const healthSchema = {
    schema: {
      tags: ["Health"],
      summary: "Service Health & Runtime Diagnostics",
      description:
        "Universal health check endpoint used by container orchestrators (Docker, Kubernetes, Render) and status monitors.",
      response: {
        200: {
          description: "Service is healthy and accepting traffic",
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
            service: { type: "string", example: "@deslop/api" },
            uptimeSeconds: { type: "number", example: 120 },
            timestamp: { type: "string", example: "2026-10-24T05:00:00.000Z" },
            memoryUsage: {
              type: "object",
              properties: {
                rssMb: { type: "number", example: 68 },
                heapUsedMb: { type: "number", example: 42 },
              },
            },
          },
        },
      },
    },
  };

  const handler = async (request: any, reply: any) => {
    return reply.status(200).send({
      status: "ok",
      service: "@deslop/api",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      memoryUsage: {
        rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    });
  };

  app.get("/health", healthSchema, handler);
  app.get("/api/health", healthSchema, handler);
};
