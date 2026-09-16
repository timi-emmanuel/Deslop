import { ZorveusServiceClient, assertDecimalString } from "@zorveus/sdk";
import { getZorveusConfig, isZorveusServiceConfigured } from "../config/zorveus-env";

/**
 * Initializes the Zorveus Management Service Client.
 * WARNING: Never export or call this from browser client code.
 */
function getServiceClient(): ZorveusServiceClient | null {
  const { serviceKey, controlPlaneBaseUrl } = getZorveusConfig();
  if (!serviceKey) return null;

  return new ZorveusServiceClient({
    apiKey: serviceKey,
    baseURL: controlPlaneBaseUrl,
  });
}

export interface GrantCreditParams {
  externalUserId: string;
  amount: string; // Decimal-safe monetary string (e.g. "10.0000")
  currency?: string;
  reason?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}

export interface UserCreditSummary {
  externalUserId: string;
  availableBalance: string;
  currency: string;
  creditMode?: string;
}

/**
 * Grants AI allowance credits to an end user via the Zorveus Service API.
 * Uses decimal-safe monetary validation and supports idempotency to prevent double-crediting.
 */
export async function grantUserCredits(
  params: GrantCreditParams
): Promise<{ success: boolean; grantId?: string; error?: string }> {
  if (!isZorveusServiceConfigured()) {
    return { success: false, error: "ZORVEUS_SERVICE_KEY not configured" };
  }

  const client = getServiceClient();
  if (!client) {
    return { success: false, error: "Failed to initialize Zorveus service client" };
  }

  const { appId } = getZorveusConfig();

  // Validate decimal string safety for financial amounts
  assertDecimalString(params.amount, "amount");

  try {
    const response = await client.productUsers.grantCreditByExternalId(
      {
        appId: appId || "deslop-default",
        externalUserId: params.externalUserId,
        amount: params.amount,
        currency: params.currency || "USD",
        reason: params.reason || "purchased_credits",
        metadata: params.metadata,
      },
      {
        idempotencyKey: params.idempotencyKey,
      }
    );

    return {
      success: true,
      grantId: response.credit_grant?.credit_grant_id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to grant credits";
    console.error("[Zorveus Service] Error granting credit:", err);
    return { success: false, error: message };
  }
}

/**
 * Retrieves the current live credit and balance summary for a product user.
 */
export async function getUserCreditSummary(
  externalUserId: string
): Promise<UserCreditSummary | null> {
  if (!isZorveusServiceConfigured()) return null;

  const client = getServiceClient();
  if (!client) return null;
  const { appId } = getZorveusConfig();

  try {
    const summary = await client.productUsers.getCreditSummaryByExternalId({
      appId: appId || "deslop-default",
      externalUserId: externalUserId,
    });

    return {
      externalUserId,
      availableBalance: summary.available_credits,
      currency: summary.currency,
      creditMode: "active",
    };
  } catch (err: unknown) {
    console.warn(`[Zorveus Service] Could not retrieve credit summary for ${externalUserId}:`, err);
    return null;
  }
}
