import api from '@/lib/api';
import { User } from '../@types/user';
import { LoginResponse } from '../@responses/login.response';

export async function login(email: string, password: string): Promise<LoginResponse> {
  // Replace this with your actual API call
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function register(data: any): Promise<{ user: User; accessToken: string }> {
  const res = await api.post('/auth/register', data);
  return res.data;
}
