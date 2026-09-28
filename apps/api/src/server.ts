import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { config } from "./config.js";
import { registerCors } from "./plugins/cors.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { crawlRoutes } from "./routes/crawl.js";
import { scanRoutes } from "./routes/scans.js";
import { closeDbPool } from "./db/index.js";
import { shutdownBrowser } from "./crawler/browser.js";

/**
 * LESSON: Server Bootstrapping & Graceful Shutdown
 * ------------------------------------------------
 * This file is the entrypoint to the entire backend application.
 *
 * 1. Structured Logging:
 *    We pass `{ logger: true }` so Fastify automatically logs every request
 *    method, path, IP, response status, and duration in ms.
 *
 * 2. Graceful Shutdown:
 *    When you restart a server or deploy new code in production, the OS sends
 *    a `SIGINT` (Ctrl+C) or `SIGTERM` (Docker stop) signal.
 *    If we abruptly kill the process with `process.exit(0)`, any active Playwright
 *    crawls or database transactions are severed mid-flight.
 *    Graceful shutdown stops accepting new requests, lets active requests finish,
 *    and closes database/browser pools cleanly before exiting.
 */
export async function buildServer() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === "development" ? "info" : "warn",
      transport:
        config.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
    // Don't leak stack traces in production
    exposeHeadRoutes: true,
  });

  // 1. Register Global Plugins
  await registerCors(app);
  await app.register(fastifyCookie);

  // 2. Register Routes
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(crawlRoutes);
  await app.register(scanRoutes);

  // 3. Centralized Error Handler (Fail-Safe)
  app.setErrorHandler((error: Error & { statusCode?: number }, request, reply) => {
    app.log.error(error);

    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      success: false,
      error: error.message || "Internal Server Error",
      statusCode,
    });
  });

  return app;
}

async function start() {
  const app = await buildServer();

  try {
    const address = await app.listen({
      port: config.PORT,
      host: config.HOST,
    });
    app.log.info(`🚀 Deslop Backend Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful Shutdown Listeners
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}. Starting graceful shutdown...`);
      try {
        await app.close();
        await closeDbPool();
        await shutdownBrowser();
        app.log.info("Server, database pool, and browser closed successfully. Exiting process.");
        process.exit(0);
      } catch (err) {
        app.log.error({ err }, "Error during graceful shutdown");
        process.exit(1);
      }
    });
  }
}

// Start the server
start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

