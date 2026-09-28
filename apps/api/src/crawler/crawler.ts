import { URL } from "node:url";
import {
  synthesizeTokens,
  convertSynthesizedToColorTokens,
  synthesizeGeometry,
  ColorToken,
  GeometrySpec,
  TypographySpec,
  SynthesizedTokenOutput,
} from "@deslop/tokens";
import { createIsolatedPageContext } from "./browser.js";
import { HARVEST_DOM_SCRIPT, InBrowserHarvestResult } from "./dom-evaluator.js";

export interface CrawlResult {
  url: string;
  domain: string;
  pageTitle: string;
  screenshotBase64: string;
  colors: ColorToken[];
  synthesized: SynthesizedTokenOutput;
  geometry: GeometrySpec;
  typography: TypographySpec;
  durationMs: number;
}

export type CrawlProgressCallback = (step: string, percent: number) => void;

/**
 * LESSON: Production Crawl Pipeline
 * ---------------------------------
 * 1. Sandboxed Browser Context:
 *    We spawn a lightweight isolated context. If the visited site has malware,
 *    cookies, or service workers, they are contained within this context and wiped.
 *
 * 2. Timeout Guards:
 *    Never wait indefinitely for a web page. A broken site or slow third-party tracker
 *    can hang forever. We set `timeout: 15000` (15s max).
 *
 * 3. Base64 Viewport Screenshot:
 *    Captures what the user actually sees at 1280x800 desktop resolution.
 *
 * 4. Deterministic Token Synthesis:
 *    Takes real in-browser computed styles and runs our CIEDE2000 math engine
 *    to yield strict, production-ready tokens.
 */
export async function crawlWebsite(
  targetUrl: string,
  onProgress?: CrawlProgressCallback,
  signal?: AbortSignal
): Promise<CrawlResult> {
  if (signal?.aborted) {
    throw new Error("Crawl aborted by client");
  }

  const startTime = Date.now();
  const parsed = new URL(targetUrl);
  const domain = parsed.hostname.replace(/^www\./, "");

  onProgress?.("Launching isolated browser context...", 10);
  const { context, close } = await createIsolatedPageContext();

  const onAbort = () => {
    close().catch(() => {});
  };
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    const page = await context.newPage();

    onProgress?.(`Navigating to ${domain}...`, 25);
    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    // Allow 1 second for dynamic fonts and client-side hydrates to paint
    await page.waitForTimeout(1000);

    onProgress?.("Capturing viewport screenshot...", 45);
    const screenshotBuffer = await page.screenshot({
      type: "jpeg",
      quality: 80,
    });
    const screenshotBase64 = `data:image/jpeg;base64,${screenshotBuffer.toString("base64")}`;

    onProgress?.("Harvesting computed styles and active CSS variables...", 65);
    const harvested = await page.evaluate<InBrowserHarvestResult>(HARVEST_DOM_SCRIPT);

    onProgress?.("Synthesizing tokens with CIEDE2000 math...", 85);
    // 1. Run Stage 3 Token Synthesis
    const synthesized = synthesizeTokens(harvested.rawObservations);
    const colors = convertSynthesizedToColorTokens(synthesized);

    // 2. Synthesize Modular Geometry
    const geometry = synthesizeGeometry(
      harvested.geometry.observedPaddings,
      harvested.geometry.observedRadii,
      harvested.geometry.observedShadows
    );

    // 3. Assemble Typography
    const primaryFont = harvested.typography.fontFamilies[0] || "Inter, system-ui, sans-serif";
    const typography: TypographySpec = {
      displayFamily: primaryFont,
      bodyFamily: primaryFont,
      monoFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      scaleName: "Major Second (1.125)",
      scaleRatio: 1.125,
      steps: [
        { name: "h1", sizePx: 36, lineHeightPx: 44, letterSpacing: "-0.02em" },
        { name: "h2", sizePx: 28, lineHeightPx: 36, letterSpacing: "-0.01em" },
        { name: "h3", sizePx: 22, lineHeightPx: 28, letterSpacing: "0em" },
        { name: "body", sizePx: 16, lineHeightPx: 24, letterSpacing: "0em" },
        { name: "caption", sizePx: 14, lineHeightPx: 20, letterSpacing: "0.01em" },
      ],
    };

    onProgress?.("Extraction completed successfully.", 100);

    return {
      url: targetUrl,
      domain,
      pageTitle: harvested.pageTitle || domain,
      screenshotBase64,
      colors,
      synthesized,
      geometry,
      typography,
      durationMs: Date.now() - startTime,
    };
  } finally {
    signal?.removeEventListener("abort", onAbort);
    // Crucial: Always close context to release Chromium tabs and memory
    await close();
  }
}
