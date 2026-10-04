import { NextRequest, NextResponse } from "next/server";
import { validateTargetUrl } from "@/lib/extractor/security";
import { consumeQuota, getQuota } from "@/lib/limits/quota";
import { extractDesignSystem } from "@/lib/extractor/crawler";

export async function POST(request: NextRequest) {
  try {
    let body: { url?: string };
    try {
      body = await request.json();
    } catch (parseErr) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const rawUrl = body?.url;
    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid website URL in the 'url' field" },
        { status: 400 }
      );
    }

    // SSRF & Protocol Validation
    const validation = validateTargetUrl(rawUrl);
    if (!validation.isValid || !validation.sanitizedUrl) {
      return NextResponse.json(
        { success: false, error: validation.error || "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Client IP detection (handles proxies e.g. x-forwarded-for)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0]?.trim() || "127.0.0.1" : "127.0.0.1";
    const isPro = request.headers.get("x-deslop-pro") === "true";

    // Evaluate Quota (unconstrained during public free launch)
    const currentQuota = await getQuota(clientIp, true);

    // Perform Extraction
    const designSystem = await extractDesignSystem(validation.sanitizedUrl);

    // Decrement Quota
    const updatedQuota = await consumeQuota(clientIp, isPro);

    return NextResponse.json({
      success: true,
      data: designSystem,
      quota: updatedQuota,
    });
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/extract] Error:", errorDetails);
    return NextResponse.json(
      {
        success: false,
        error: "Extraction failed",
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}
