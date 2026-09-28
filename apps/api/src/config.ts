import dotenv from "dotenv";
import { z } from "zod";

// Load .env variables from the current environment if available
dotenv.config();

/**
 * LESSON: Why we validate environment variables with Zod
 * ---------------------------------------------------
 * In junior code, you often see: `const port = process.env.PORT || 4000;` scattered
 * across 10 different files. If a required variable like `DATABASE_URL` is missing,
 * the app starts up, waits until a user hits a database route 5 minutes later,
 * and then crashes with "TypeError: cannot read property of undefined".
 *
 * Senior Pattern: "Fail Fast"
 * We define a single schema. If ANY required environment variable is missing or malformed,
 * the process throws an error immediately on boot and refuses to start.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default("0.0.0.0"),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://localhost:3001")
    .transform((val) => val.split(",").map((s) => s.trim())),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables at server startup:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
