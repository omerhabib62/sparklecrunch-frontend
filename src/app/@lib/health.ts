const HEALTH_CACHE_DURATION = 10000; // 10 seconds
let healthCache: { isHealthy: boolean; lastChecked: number } | null = null;

export async function checkBackendHealth(): Promise<boolean> {
  // Return cached result if still valid
  if (healthCache && (Date.now() - healthCache.lastChecked) < HEALTH_CACHE_DURATION) {
    return healthCache.isHealthy;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const isHealthy = response.ok;
    
    // Update cache
    healthCache = {
      isHealthy,
      lastChecked: Date.now()
    };

    return isHealthy;
  } catch (error) {
    console.error('Backend health check failed:', error);
    
    // Update cache with unhealthy status
    healthCache = {
      isHealthy: false,
      lastChecked: Date.now()
    };
    
    return false;
  }
}

export class BackendUnavailableError extends Error {
  constructor() {
    super('Backend services are currently unavailable');
    this.name = 'BackendUnavailableError';
  }
}