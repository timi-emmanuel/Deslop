import { NextRequest, NextResponse } from "next/server";
import { synthesizeWithZorveus } from "@/lib/ai/zorveus";
import { ExtractedDesignSystem } from "@/types/tokens";

function deriveStableUserId(clientIp: string, isPro: boolean): string {
  let hash = 0;
  for (let i = 0; i < clientIp.length; i++) {
    hash = (hash << 5) - hash + clientIp.charCodeAt(i);
    hash |= 0;
  }
  const idSuffix = Math.abs(hash).toString(36);
  return isPro ? `usr_pro_${idSuffix}` : `usr_guest_${idSuffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.system) {
      return NextResponse.json(
        { success: false, error: "Missing extracted design system in request body" },
        { status: 400 }
      );
    }

    const system: ExtractedDesignSystem = body.system;
    const customPrompt: string | undefined = body.customPrompt;

    // Resolve trusted client identity and plan state on the server
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";
    const isPro = request.headers.get("x-deslop-pro") === "true";

    const externalUserId = deriveStableUserId(clientIp, isPro);

    const result = await synthesizeWithZorveus({
      domain: system.domain,
      url: system.url,
      colors: system.colors,
      typography: system.typography,
      geometry: system.geometry,
      customPrompt,
      externalUserId,
      isPro,
    });

    if (!result.success && result.errorCode) {
      const statusCode =
        result.errorCode === "ALLOWANCE_EXHAUSTED"
          ? 402 // Payment / Allowance Required
          : result.errorCode === "RATE_LIMITED"
          ? 429 // Too Many Requests
          : result.errorCode === "FUNDING_UNAVAILABLE"
          ? 503 // Service Unavailable
          : 500;

      return NextResponse.json(result, { status: statusCode });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Synthesis failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
