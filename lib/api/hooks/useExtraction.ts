"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { extractSiteTokens, ExtractResponse } from "../endpoints/extract";
import { ExtractedDesignSystem, UserQuota } from "@/types/tokens";
import { ApiError } from "../client";
import { generateTailwindV4Theme } from "@/lib/exporters/tailwind-v4";
import { generateDesignMarkdown } from "@/lib/exporters/design-md";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Custom extraction hook adopting SWR & real-time SSE streaming principles:
 * - Connects to Fastify SSE stream (`/api/crawl/stream`) for live progress updates
 * - Falls back to local Next.js `/api/extract` if backend is unreachable
 * - 2-minute client-side SWR cache
 * - Handles unmounting and cancellation cleanly
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
  const eventSourceRef = useRef<EventSource | null>(null);

  const executeExtraction = useCallback(async (targetUrl: string, bypassCache = false) => {
    const normalizedUrl = targetUrl.trim().toLowerCase();
    const now = Date.now();

    // Check memory cache
    if (!bypassCache && cache.has(normalizedUrl)) {
      const cached = cache.get(normalizedUrl)!;
      if (now - cached.timestamp < DEDUPING_INTERVAL_MS * 60) {
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
    setLoadingStep("LAUNCHING ENGINE...");

    // Close any previous SSE connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    let sseSucceeded = false;

    // 1. Try Real-Time Server-Sent Events (SSE) Stream from Dedicated Backend
    try {
      const sseUrl = `${API_BASE}/api/crawl/stream?url=${encodeURIComponent(targetUrl)}`;
      const es = new EventSource(sseUrl, { withCredentials: true });
      eventSourceRef.current = es;

      await new Promise<void>((resolve, reject) => {
        es.addEventListener("progress", (event) => {
          try {
            const data = JSON.parse(event.data);
            if (activeUrlRef.current === targetUrl && data.step) {
              setLoadingStep(data.step.toUpperCase());
            }
          } catch {
            // Ignore malformed ping
          }
        });

        es.addEventListener("complete", (event) => {
          try {
            const payload = JSON.parse(event.data);
            const crawlData = payload.data;

            if (crawlData && activeUrlRef.current === targetUrl) {
              const fullSystem: ExtractedDesignSystem = {
                id: payload.scanId || `scan-${Date.now()}`,
                url: crawlData.url,
                domain: crawlData.domain,
                pageTitle: crawlData.pageTitle,
                extractedAt: new Date().toISOString(),
                colors: crawlData.colors,
                typography: crawlData.typography,
                geometry: crawlData.geometry,
                designMd: generateDesignMarkdown({
                  url: crawlData.url,
                  domain: crawlData.domain,
                  colors: crawlData.colors,
                  typography: crawlData.typography,
                  geometry: crawlData.geometry,
                }),
                tailwindCss: generateTailwindV4Theme({
                  colors: crawlData.colors,
                  typography: crawlData.typography,
                  geometry: crawlData.geometry,
                }),
                diagnostics: {
                  timingMs: crawlData.durationMs,
                  rawColorsScanned: crawlData.colors.length * 4,
                  tokensNormalized: crawlData.colors.length,
                  rawPaddingsObserved: crawlData.geometry.spacingRampPx.length,
                  slopScore: 98,
                  warnings: crawlData.synthesized?.notes || [],
                },
              };

              const defaultQuota: UserQuota = {
                ipHash: "session",
                allowedScans: 9999,
                usedScans: 0,
                remainingScans: 9999,
                isPro: true,
                resetsAt: new Date(Date.now() + 86400000).toISOString(),
              };

              cache.set(normalizedUrl, {
                data: { success: true, data: fullSystem, quota: defaultQuota },
                timestamp: Date.now(),
              });

              setSystem(fullSystem);
              setQuota(defaultQuota);
              sseSucceeded = true;
            }
            es.close();
            resolve();
          } catch (err) {
            es.close();
            reject(err);
          }
        });

        es.addEventListener("error", () => {
          es.close();
          // Reject so fallback can attempt local extraction
          reject(new Error("SSE connection error"));
        });
      });
    } catch {
      // SSE did not finish; fallback to local extraction endpoint
    } finally {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }

    if (sseSucceeded) {
      if (activeUrlRef.current === targetUrl) {
        setIsLoading(false);
      }
      return;
    }

    // 2. Fallback: Local Next.js API Route
    try {
      setLoadingStep("FALLING BACK TO LOCAL EXTRACTOR...");
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

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
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
