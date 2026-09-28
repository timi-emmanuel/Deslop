import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { db } from "../db/index.js";
import { scans } from "../db/schema.js";
import { crawlWebsite } from "../crawler/crawler.js";
import { optionalAuth } from "../plugins/auth.js";

const crawlSchema = z.object({
  url: z.string().url("Please provide a valid URL starting with http:// or https://"),
});

/**
 * LESSON: Synchronous vs. Asynchronous Inspection Route
 * -----------------------------------------------------
 * This route performs a direct crawl of the target website using headless Playwright.
 * - Extracts real rendered styles and CSS variables.
 * - Takes a desktop viewport screenshot.
 * - Runs Stage 3 Token Synthesis.
 * - If the request comes with an authenticated session cookie, it automatically
 *   saves the scan to the `scans` table for the user's history!
 */
export const crawlRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    "/api/crawl",
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      const parseResult = crawlSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          error: parseResult.error.errors[0]?.message || "Invalid URL",
        });
      }

      const { url } = parseResult.data;

      try {
        app.log.info(`Starting Playwright crawl for ${url}`);
        const result = await crawlWebsite(url, (step, percent) => {
          app.log.debug(`[${percent}%] ${step}`);
        });

        // If user is authenticated and DB is available, persist scan to history
        let scanId: string | undefined;
        if (db) {
          try {
            const [savedScan] = await db
              .insert(scans)
              .values({
                userId: request.user?.id || null,
                url: result.url,
                domain: result.domain,
                screenshotUrl: result.screenshotBase64.slice(0, 500) + "...(truncated in DB preview)",
                tokens: result.synthesized.tokens,
                markdown: `# ${result.domain} Design System\n\nExtracted by Deslop Engine.`,
                brandArchetype: "Disciplined Neutral",
                scanDurationMs: result.durationMs,
              })
              .returning({ id: scans.id });

            scanId = savedScan?.id;
          } catch (dbErr) {
            app.log.warn({ dbErr }, "Could not persist scan to database");
          }
        }

        return reply.status(200).send({
          success: true,
          scanId,
          data: result,
        });
      } catch (err: unknown) {
        app.log.error({ err }, `Failed to crawl target URL ${url}`);
        const message = err instanceof Error ? err.message : "Crawl failed";
        return reply.status(500).send({
          success: false,
          error: `Crawler error: ${message}`,
        });
      }
    }
  );

  // -------------------------------------------------------------
  // Real-Time Server-Sent Events (SSE) Stream
  // GET /api/crawl/stream?url=https://linear.app
  // -------------------------------------------------------------
  app.get(
    "/api/crawl/stream",
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      const query = request.query as { url?: string };
      const parseResult = crawlSchema.safeParse(query);

      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          error: parseResult.error.errors[0]?.message || "Invalid URL query param",
        });
      }

      const { url } = parseResult.data;

      // 1. Establish SSE Connection Headers
      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no", // Disables buffering on Nginx/Cloudflare
      });

      const sendEvent = (event: string, payload: unknown) => {
        if (!reply.raw.writableEnded) {
          reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
        }
      };

      // 2. Cancellation handling
      const abortController = new AbortController();
      request.raw.on("close", () => {
        app.log.info(`Client disconnected from SSE stream for ${url}. Aborting crawl...`);
        abortController.abort();
      });

      sendEvent("connected", { status: "ready", url });

      try {
        const result = await crawlWebsite(
          url,
          (step, percent) => {
            sendEvent("progress", { step, percent });
          },
          abortController.signal
        );

        // Persist to database if authenticated and DB available
        let scanId: string | undefined;
        if (db) {
          try {
            const [savedScan] = await db
              .insert(scans)
              .values({
                userId: request.user?.id || null,
                url: result.url,
                domain: result.domain,
                screenshotUrl: result.screenshotBase64.slice(0, 500) + "...(truncated in DB preview)",
                tokens: result.synthesized.tokens,
                markdown: `# ${result.domain} Design System\n\nExtracted by Deslop Engine.`,
                brandArchetype: "Disciplined Neutral",
                scanDurationMs: result.durationMs,
              })
              .returning({ id: scans.id });

            scanId = savedScan?.id;
          } catch (dbErr) {
            app.log.warn({ dbErr }, "Could not persist scan to database in SSE handler");
          }
        }

        sendEvent("complete", {
          success: true,
          scanId,
          data: result,
        });

        reply.raw.end();
      } catch (err: unknown) {
        if (abortController.signal.aborted) {
          app.log.info("Crawl aborted due to client disconnection");
          return;
        }

        const message = err instanceof Error ? err.message : "Crawl failed";
        app.log.error({ err }, `SSE crawl error for ${url}`);
        sendEvent("error", { message });
        reply.raw.end();
      }
    }
  );
};

