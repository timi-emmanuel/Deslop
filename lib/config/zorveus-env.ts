/**
 * Zorveus Environment Configuration & Plan Policy Routing
 *
 * Secure server-side resolution for Zorveus Inference and Service Keys,
 * ensuring secret keys never leak to browser bundles.
 */

export interface ZorveusConfig {
  inferenceKey: string;
  freeKey?: string;
  proKey?: string;
  serviceKey?: string;
  appId?: string;
  defaultModel: string;
  gatewayBaseUrl: string;
  controlPlaneBaseUrl: string;
}

export function getZorveusConfig(): ZorveusConfig {
  return {
    inferenceKey: process.env.ZORVEUS_INFERENCE_KEY || "",
    freeKey: process.env.ZORVEUS_FREE_KEY,
    proKey: process.env.ZORVEUS_PRO_KEY,
    serviceKey: process.env.ZORVEUS_SERVICE_KEY,
    appId: process.env.ZORVEUS_APP_ID,
    defaultModel: process.env.ZORVEUS_MODEL || "anthropic/claude-3-5-sonnet-latest",
    gatewayBaseUrl: process.env.ZORVEUS_GATEWAY_URL || "https://api.zorveus.com/v1",
    controlPlaneBaseUrl: process.env.ZORVEUS_BASE_URL || "https://api.zorveus.com",
  };
}

/**
 * Resolves the appropriate Zorveus inference key based on user subscription plan.
 * - Pro plan routes through ZORVEUS_PRO_KEY (allow_overrun policy)
 * - Free plan routes through ZORVEUS_FREE_KEY (limit_output policy)
 * - Falls back to default ZORVEUS_INFERENCE_KEY if plan-specific keys are not configured.
 */
export function resolveInferenceKeyForPlan(isPro: boolean): string {
  const config = getZorveusConfig();
  if (isPro && config.proKey) {
    return config.proKey;
  }
  if (!isPro && config.freeKey) {
    return config.freeKey;
  }
  return config.inferenceKey;
}

/**
 * Returns whether Zorveus inference capability is configured.
 */
export function isZorveusInferenceConfigured(isPro = false): boolean {
  return Boolean(resolveInferenceKeyForPlan(isPro));
}

/**
 * Returns whether the Zorveus management service key is configured for server-to-server operations.
 */
export function isZorveusServiceConfigured(): boolean {
  return Boolean(process.env.ZORVEUS_SERVICE_KEY);
}
