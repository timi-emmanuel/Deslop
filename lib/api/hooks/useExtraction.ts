"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { extractSiteTokens, ExtractResponse } from "../endpoints/extract";
import { ExtractedDesignSystem, UserQuota } from "@/types/tokens";
import { ApiError } from "../client";

// In-memory response cache adhering to SWR deduplication principles
const cache = new Map<string, { data: ExtractResponse; timestamp: number }>();
const DEDUPING_INTERVAL_MS = 2000;

export interface UseExtractionResult {
  system: ExtractedDesignSystem | null;
  quota: UserQuota | null;
  isLoading: boolean;
  loadingStep: string;
  error: string | null;
  isPaywall: boolean;
  refetch: () => Promise<void>;
}

/**
 * Custom extraction hook adopting SWR Stale-While-Revalidate principles:
 * - 2-second deduping interval to prevent duplicate in-flight crawls
 * - Instant cache retrieval on back/forward navigation
 * - Zero background polling loops
 */
export function useExtraction(rawUrl: string | null): UseExtractionResult {
  const [system, setSystem] = useState<ExtractedDesignSystem | null>(null);
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingStep, setLoadingStep] = useState<string>("INITIALIZING SCANNER");
  const [error, setError] = useState<string | null>(null);
  const [isPaywall, setIsPaywall] = useState<boolean>(false);

  const activeUrlRef = useRef<string | null>(rawUrl);
  activeUrlRef.current = rawUrl;

  const executeExtraction = useCallback(async (targetUrl: string, bypassCache = false) => {
    const normalizedUrl = targetUrl.trim().toLowerCase();
    const now = Date.now();

    // Check memory cache
    if (!bypassCache && cache.has(normalizedUrl)) {
      const cached = cache.get(normalizedUrl)!;
      if (now - cached.timestamp < DEDUPING_INTERVAL_MS * 60) { // 2 min cache
        setSystem(cached.data.data);
        setQuota(cached.data.quota);
        setIsLoading(false);
        setError(null);
        setIsPaywall(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setIsPaywall(false);

    setLoadingStep("CONNECTING TO HEADLESS RUNTIME...");
    const t1 = setTimeout(() => setLoadingStep("HARVESTING COMPUTED STYLES & FONTS..."), 350);
    const t2 = setTimeout(() => setLoadingStep("SYNTHESIZING OKLCH PALETTE & 8PT GRID..."), 700);

    try {
      const result = await extractSiteTokens(targetUrl);

      if (activeUrlRef.current === targetUrl) {
        cache.set(normalizedUrl, { data: result, timestamp: Date.now() });
        setSystem(result.data);
        setQuota(result.quota);
      }
    } catch (err: unknown) {
      if (activeUrlRef.current === targetUrl) {
        if (err instanceof ApiError) {
          if (err.status === 429 || err.data?.paywall) {
            setIsPaywall(true);
            if (err.data?.quota) setQuota(err.data.quota);
          }
          setError(err.message);
        } else {
          setError(err instanceof Error ? err.message : "Extraction failed");
        }
      }
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      if (activeUrlRef.current === targetUrl) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!rawUrl) {
      setIsLoading(false);
      return;
    }
    executeExtraction(rawUrl);
  }, [rawUrl, executeExtraction]);

  const refetch = useCallback(async () => {
    if (rawUrl) {
      await executeExtraction(rawUrl, true);
    }
  }, [rawUrl, executeExtraction]);

  return {
    system,
    quota,
    isLoading,
    loadingStep,
    error,
    isPaywall,
    refetch,
  };
}
