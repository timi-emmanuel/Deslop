import { NextRequest, NextResponse } from "next/server";
import { getQuota } from "@/lib/limits/quota";

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const isPro = request.headers.get("x-deslop-pro") === "true";

  const quota = await getQuota(clientIp, isPro);
  return NextResponse.json({ success: true, quota });
}
