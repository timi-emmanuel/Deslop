import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * LESSON: Drizzle Kit & Migration Management
 * ------------------------------------------
 * When you change your TypeScript schema in `src/db/schema.ts`, you run:
 * `npx drizzle-kit generate`
 *
 * Drizzle Kit compares your TypeScript schema against your previous migrations
 * and generates clean, standard SQL files in the `./drizzle` directory.
 * You can inspect the exact `CREATE TABLE`, `ALTER TABLE`, or `ADD CONSTRAINT`
 * SQL before running them on your database.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/deslop",
  },
});
