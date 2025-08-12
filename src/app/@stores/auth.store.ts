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

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  }
};

// Helper function to delete cookie
const deleteCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      sessionId: null,
      isAuthenticated: false,
      isHydrated: false,
      login: (user: User, accessToken: string, sessionId?: string) => {
        const newState = {
          user,
          accessToken,
          sessionId: sessionId || `session:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isAuthenticated: true
        };

        set(newState);

        // Sync with cookies for middleware
        setCookie('auth-storage', JSON.stringify({ state: newState }));
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          sessionId: null,
          isAuthenticated: false
        });

        // Clear cookie
        deleteCookie('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          state.isAuthenticated = !!(state.user && state.accessToken && state.sessionId);

          // Sync with cookies after rehydration
          if (state.isAuthenticated) {
            setCookie('auth-storage', JSON.stringify({ state }));
          }
        }
      },
    }
  )
);