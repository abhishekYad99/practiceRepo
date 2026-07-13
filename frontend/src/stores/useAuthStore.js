import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Auth store — persisted to localStorage.
 *
 * Holds the logged-in `user` object (user details + accessToken) so the session
 * survives reloads. Matches how the axios instance reads it:
 *   useAuthStore.getState().user?.accessToken
 *   useAuthStore.getState().user?.email
 *   useAuthStore.getState().clearUser()
 *
 * On login, save the API's user payload (make sure it includes accessToken):
 *   useAuthStore.getState().setUser({ id, name, email, accessToken });
 *
 * In components:
 *   const user  = useAuthStore((s) => s.user);
 *   const token = useAuthStore((s) => s.user?.accessToken);
 */

// SSR-safe storage so importing this on the server never crashes.
const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      hasHydrated: false,

      // Save the full user object (should include accessToken).
      setUser: (user) => set({ user }),

      // Merge/patch fields on the existing user (e.g. after "edit name").
      updateUser: (partial) =>
        set((state) => ({ user: state.user ? { ...state.user, ...partial } : partial })),

      // Clear the session (used on logout and by the axios 401 handler).
      clearUser: () => set({ user: null }),

      setHasHydrated: (value) => set({ hasHydrated: value }),

      // Convenience getters.
      getToken: () => get().user?.accessToken ?? null,
      isAuthenticated: () => Boolean(get().user?.accessToken),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : noopStorage
      ),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
