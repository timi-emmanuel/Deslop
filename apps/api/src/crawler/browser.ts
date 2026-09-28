import { chromium, Browser, BrowserContext } from "playwright";

/**
 * LESSON: Senior Headless Browser Lifecycle Management
 * ----------------------------------------------------
 * 1. The Anti-Pattern (What Juniors Do):
 *    Calling `await chromium.launch()` inside every HTTP request handler.
 *    Launching a new Chromium OS process takes ~1.5s - 2s and consumes 150MB+ CPU/RAM.
 *    If 10 users click "Inspect", 10 separate browsers launch, crashing the server with OOM (Out Of Memory).
 *
 * 2. The Senior Pattern (Singleton Browser + Lightweight Contexts):
 *    We launch a SINGLE Chromium instance once on demand.
 *    For every scan request, we create a `BrowserContext` via `browser.newContext()`.
 *    - Contexts take < 10ms to create.
 *    - Contexts are completely sandboxed (isolated cookies, cache, storage).
 *    - When the scrape finishes, we simply call `await context.close()`.
 *      All memory and tabs are freed instantly without touching the parent browser process!
 */

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Uses /tmp instead of /dev/shm (crucial in Docker/Linux)
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });
  }
  return browserInstance;
}

export async function createIsolatedPageContext(): Promise<{
  context: BrowserContext;
  close: () => Promise<void>;
}> {
  const browser = await getBrowser();

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Deslop/1.0",
    deviceScaleFactor: 1,
    locale: "en-US",
  });

  return {
    context,
    close: async () => {
      try {
        await context.close();
      } catch (err) {
        console.error("Error closing browser context:", err);
      }
    },
  };
}

export async function shutdownBrowser(): Promise<void> {
  if (browserInstance && browserInstance.isConnected()) {
    await browserInstance.close();
    browserInstance = null;
  }
}
