import { NextRequest, NextResponse } from "next/server";
import { synthesizeWithZorveus } from "@/lib/ai/zorveus";
import { ExtractedDesignSystem } from "@/types/tokens";

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

    const result = await synthesizeWithZorveus({
      domain: system.domain,
      url: system.url,
      colors: system.colors,
      typography: system.typography,
      geometry: system.geometry,
      customPrompt,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Synthesis failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
