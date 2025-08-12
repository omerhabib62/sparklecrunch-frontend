import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../@types/user';
import { setCookie } from '../@utils/set-cookie';
import { deleteCookie } from '../@utils/delete-cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, accessToken: string, sessionId?: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

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
      updateUser: (patch: Partial<User>) => {
        const { user, accessToken, sessionId } = get();
        const newUser = user ? { ...user, ...patch } : null;
        const newState = {
          user: newUser,
          accessToken,
          sessionId,
          isAuthenticated: !!(newUser && accessToken && sessionId),
        };
        set(newState);
        setCookie('auth-storage', JSON.stringify({ state: newState }));
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          state.isAuthenticated = !!(
            state.user &&
            state.accessToken &&
            state.sessionId
          );

          // Sync with cookies after rehydration
          if (state.isAuthenticated) {
            setCookie('auth-storage', JSON.stringify({ state }));
          }
        }
      },
    }
  )
);