import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../@types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,
      login: (user: User, accessToken: string) => 
        set({ 
          user, 
          accessToken, 
          isAuthenticated: true 
        }),
      logout: () => 
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          // Re-check authentication after hydration
          state.isAuthenticated = !!(state.user && state.accessToken);
        }
      },
    }
  )
);