import { API_CONFIG } from "../@config/api.config";
import { fetchWithTimeout } from "../@utils/fetch-with-timeout";
import { joinUrl } from "../@utils/join-url";

const HEALTH_CACHE_DURATION = 10000; // 10 seconds
let healthCache: { isHealthy: boolean; lastChecked: number } | null = null;


export async function checkBackendHealth(): Promise<boolean> {
  if (healthCache && Date.now() - healthCache.lastChecked < HEALTH_CACHE_DURATION) {
    return healthCache.isHealthy;
  }

  // Prefer NEXT_PUBLIC_HEALTH_PATH if provided, else API_CONFIG.HEALTH
  const healthPath = API_CONFIG.ENDPOINTS.HEALTH || "/health";
  const url = joinUrl(API_CONFIG.BASE_URL, healthPath);
  try {
    // Debug log to verify exact URL used
    if (API_CONFIG.ENVIRONMENT !== "production") {
      // eslint-disable-next-line no-console
      console.log("Health check URL:", url);
    }
    const res = await fetchWithTimeout(url, API_CONFIG.TIMEOUTS.HEALTH_CHECK || 5000, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const isHealthy = res.ok;
    healthCache = { isHealthy, lastChecked: Date.now() };
    return isHealthy;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Health check error:", err);
    healthCache = { isHealthy: false, lastChecked: Date.now() };
    return false;
  }
}

export class BackendUnavailableError extends Error {
  constructor() {
    super("Backend services are currently unavailable");
    this.name = "BackendUnavailableError";
  }
}