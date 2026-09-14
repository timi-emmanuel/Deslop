/**
 * SSRF and Protocol Security Guard.
 * Protects server-side crawler execution from hitting private internal infrastructure,
 * cloud metadata endpoints, and non-HTTP protocols.
 */

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "169.254.169.254",
]);

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export function validateTargetUrl(rawUrl: string): UrlValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, error: "URL must be a non-empty string" };
  }

  let formatted = rawUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);

    // Enforce HTTP / HTTPS protocols only
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { isValid: false, error: "Only HTTP and HTTPS protocols are supported" };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check blocked hostnames
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return { isValid: false, error: "Access to private or internal loopback hosts is prohibited" };
    }

    // Block private RFC 1918 and link-local IP ranges
    if (
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      /^169\.254\./.test(hostname)
    ) {
      return { isValid: false, error: "Access to internal IP subnets is prohibited" };
    }

    // Basic TLD existence check (e.g. at least one dot in domain)
    if (!hostname.includes(".") && hostname !== "localhost") {
      return { isValid: false, error: "Invalid domain name syntax" };
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
    };
  } catch {
    return { isValid: false, error: "Malformed URL provided" };
  }
}
