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

  app.get("/health", handler);
  app.get("/api/health", handler);
};
