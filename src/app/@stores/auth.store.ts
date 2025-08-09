import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../@types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, accessToken: string, sessionId?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      sessionId: null,
      isAuthenticated: false,
      isHydrated: false,
      login: (user: User, accessToken: string, sessionId?: string) =>
        set({
          user,
          accessToken,
          sessionId: sessionId || `session:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isAuthenticated: true
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          sessionId: null,
          isAuthenticated: false
        }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          // Re-check authentication after hydration
          state.isAuthenticated = !!(state.user && state.accessToken && state.sessionId);
        }
      },
    }
  )
);