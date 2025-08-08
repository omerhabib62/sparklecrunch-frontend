const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com/v1/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
    // Add more endpoints as needed
  },
};