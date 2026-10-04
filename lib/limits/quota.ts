import { UserQuota } from "@/types/tokens";

/**
 * In-memory store for tracking free scan allowances.
 * In a multi-region production cluster, this can be swapped with Redis / Upstash KV.
 */
const quotaStore = new Map<string, { count: number; windowStart: number }>();

const MAX_FREE_DAILY_SCANS = 9999;
const WINDOW_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Evaluates current quota status for a visitor without decrementing.
 */
export async function getQuota(clientIp: string, isProHeader?: boolean): Promise<UserQuota> {
  const now = Date.now();
  const isPro = Boolean(isProHeader);

  const isLocal =
    clientIp === "127.0.0.1" ||
    clientIp === "localhost" ||
    clientIp === "::1" ||
    process.env.NODE_ENV === "development";

  if (isPro || isLocal) {
    return {
      ipHash: clientIp,
      allowedScans: 9999,
      usedScans: 0,
      remainingScans: 9999,
      isPro: true,
      resetsAt: new Date(now + WINDOW_DURATION_MS).toISOString(),
    };
  }

  const record = quotaStore.get(clientIp);

  if (!record || now - record.windowStart > WINDOW_DURATION_MS) {
    return {
      ipHash: clientIp,
      allowedScans: MAX_FREE_DAILY_SCANS,
      usedScans: 0,
      remainingScans: MAX_FREE_DAILY_SCANS,
      isPro: false,
      resetsAt: new Date(now + WINDOW_DURATION_MS).toISOString(),
    };
  }

  const remaining = Math.max(0, MAX_FREE_DAILY_SCANS - record.count);
  return {
    ipHash: clientIp,
    allowedScans: MAX_FREE_DAILY_SCANS,
    usedScans: record.count,
    remainingScans: remaining,
    isPro: false,
    resetsAt: new Date(record.windowStart + WINDOW_DURATION_MS).toISOString(),
  };
}

/**
 * Consumes one scan from the visitor's allowance.
 * Returns the updated quota.
 */
export async function consumeQuota(clientIp: string, isProHeader?: boolean): Promise<UserQuota> {
  const now = Date.now();
  if (isProHeader) {
    return getQuota(clientIp, true);
  }

  const record = quotaStore.get(clientIp);

  if (!record || now - record.windowStart > WINDOW_DURATION_MS) {
    quotaStore.set(clientIp, { count: 1, windowStart: now });
    return {
      ipHash: clientIp,
      allowedScans: MAX_FREE_DAILY_SCANS,
      usedScans: 1,
      remainingScans: MAX_FREE_DAILY_SCANS - 1,
      isPro: false,
      resetsAt: new Date(now + WINDOW_DURATION_MS).toISOString(),
    };
  }

  record.count += 1;
  quotaStore.set(clientIp, record);

  const remaining = Math.max(0, MAX_FREE_DAILY_SCANS - record.count);
  return {
    ipHash: clientIp,
    allowedScans: MAX_FREE_DAILY_SCANS,
    usedScans: record.count,
    remainingScans: remaining,
    isPro: false,
    resetsAt: new Date(record.windowStart + WINDOW_DURATION_MS).toISOString(),
  };
}
