import { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import { config } from "../config.js";

/**
 * LESSON: What is CORS and why does it exist?
 * -------------------------------------------
 * Browsers enforce the "Same-Origin Policy".
 * If your Next.js frontend is on `http://localhost:3001` and your Fastify backend is on
 * `http://localhost:4000`, the browser treats them as two completely different origins.
 *
 * Before the browser sends a POST or sends cookies, it sends a pre-flight "OPTIONS" request:
 * "Hey backend, do you allow http://localhost:3001 to talk to you?"
 *
 * This plugin registers `@fastify/cors` to explicitly allow our frontend to make requests
 * and exchange HTTP-only cookies securely.
 */
export async function registerCors(app: FastifyInstance) {
  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like curl, mobile apps, or Postman)
      if (!origin) return cb(null, true);

      // Check if the requesting origin matches our allowed origins
      const isAllowed = config.CORS_ORIGINS.some((allowed) => {
        return origin === allowed || allowed === "*";
      });

      if (isAllowed) {
        cb(null, true);
      } else {
        cb(new Error(`CORS Error: Origin '${origin}' is not permitted.`), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-deslop-pro"],
  });
}
