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
      // Allow requests with no origin (like curl, mobile apps, or server-to-server)
      if (!origin) return cb(null, true);

      // In development, automatically allow any localhost or 127.0.0.1 port (Next.js 3000/3001, Vite 5173, etc.)
      if (
        config.NODE_ENV === "development" &&
        (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
      ) {
        return cb(null, true);
      }

      // Check if the requesting origin matches our explicitly configured allowed origins
      const isAllowed = config.CORS_ORIGINS.some((allowed) => {
        return origin === allowed || allowed === "*";
      });

      if (isAllowed) {
        cb(null, true);
      } else {
        // Calling cb(null, false) denies CORS cleanly without crashing the request with a 500
        cb(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-deslop-pro"],
  });
}
