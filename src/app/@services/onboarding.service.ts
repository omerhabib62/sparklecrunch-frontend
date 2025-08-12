import api from '../@lib/api';
import { API_CONFIG } from '../@config/api.config';
import { checkBackendHealth, BackendUnavailableError } from '../@lib/health';
import { User } from '../@types/user';

export interface FreelancerOnboardingDto {
  bio: string;
  skills: string[]; // already split
  phone?: string;
}

export interface ClientOnboardingDto {
  phone?: string;
  companyName?: string;
  bio?: string;
}

export async function completeFreelancerOnboarding(
  data: FreelancerOnboardingDto
): Promise<User> {
  const ok = await checkBackendHealth();
  if (!ok) throw new BackendUnavailableError();
  const res = await api.post<User>(API_CONFIG.ENDPOINTS.ONBOARDING.FREELANCER, data);
  return res.data;
}

export async function completeClientOnboarding(
  data: ClientOnboardingDto
): Promise<User> {
  const ok = await checkBackendHealth();
  if (!ok) throw new BackendUnavailableError();
  const res = await api.post<User>(API_CONFIG.ENDPOINTS.ONBOARDING.CLIENT, data);
  return res.data;
}