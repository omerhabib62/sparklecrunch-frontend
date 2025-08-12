import axios from 'axios';
import { API_CONFIG } from '../@config/api.config';
import { checkBackendHealth, BackendUnavailableError } from './health';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for backend health check
api.interceptors.request.use(async (config) => {
  // Skip health check for the health endpoint itself
  if (config.url?.includes('/health')) {
    return config;
  }

  // Check backend health before making any request
  const isHealthy = await checkBackendHealth();
  
  if (!isHealthy) {
    throw new BackendUnavailableError();
  }

  // Add auth token if available
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      const token = parsed.state?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to parse auth storage:', error);
    }
  }

  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof BackendUnavailableError) {
      // Redirect to maintenance page
      window.location.href = '/maintenance';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;