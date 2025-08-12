const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com/v1/api';
};

const getAppEnvironment = () => {
  return process.env.NODE_ENV === 'development' ? 'development' : process.env.NODE_ENV;
}

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENVIRONMENT: getAppEnvironment(),
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "SparkleCrunch",
  TAGLINE: process.env.NEXT_PUBLIC_APP_TAGLINE ||
    "Your platform for connecting clients and freelancers",
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh-token',

      METADATA: '/auth/register/metadata',
    },
    ONBOARDING: {
      FREELANCER: '/users/onboarding/freelancer',
      CLIENT: '/users/onboarding/client',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
    HEALTH: '/health',
  },
  TIMEOUTS: {
    DEFAULT: 10000,
    HEALTH_CHECK: 5000,
  },
};