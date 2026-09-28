import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

const { Pool } = pg;

/**
 * LESSON: Connection Pooling with PostgreSQL
 * -----------------------------------------
 * Opening a TCP connection to PostgreSQL has overhead (SSL handshake, authentication).
 * If 50 users click "Inspect" simultaneously, opening 50 new connections will overload the DB.
 *
 * A `Pool` maintains e.g. 10 warm connections in memory. Fastify route handlers borrow
 * a connection, execute their query, and return it to the pool in milliseconds.
 */

let pool: pg.Pool | null = null;
export let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  pool = new Pool({
    connectionString: databaseUrl,
    max: 10, // Max 10 concurrent connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  db = drizzle(pool, { schema });
}

export async function checkDbConnection(): Promise<boolean> {
  if (!pool) return false;
  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT 1");
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database connection check failed:", err);
    return false;
  }
}

export async function closeDbPool(): Promise<void> {
  if (pool) {
    await pool.end();
  }
}
