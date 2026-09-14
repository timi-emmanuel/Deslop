import { apiClient } from "../client";
import { ExtractedDesignSystem, UserQuota } from "@/types/tokens";

export interface ExtractResponse {
  success: boolean;
  data: ExtractedDesignSystem;
  quota: UserQuota;
  paywall?: boolean;
}

/**
 * Pure TypeScript endpoint call for website design extraction.
 * Separates data fetching from UI component lifecycle.
 */
export async function extractSiteTokens(url: string): Promise<ExtractResponse> {
  return apiClient<ExtractResponse>("/api/extract", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
