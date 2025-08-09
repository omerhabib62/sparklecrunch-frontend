import api from '../@lib/api';
import { User } from '../@types/user';
import { LoginResponse } from '../@responses/login.response';
import { API_CONFIG } from '../@config/api.config';

export async function login(email: string, password: string): Promise<LoginResponse> {
  console.log('Auth service - login called with:', { email, password: password ? '***' : 'EMPTY' });
  
  const payload = {
    email,
    password,
  };
  
  console.log('Sending payload:', { ...payload, password: payload.password ? '***' : 'EMPTY' });
  
  const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, payload);
  
  return response.data;
}

export async function register(data: any): Promise<{ user: User; accessToken: string }> {
  const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
}

export async function logout(): Promise<void> {
  // Get session ID from localStorage or generate one
  // You'll need to store sessionId when user logs in
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  const sessionId = authStorage.state?.sessionId || 'current-session';
  
  const payload = {
    sessionId
  };
  
  await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, payload);
}
