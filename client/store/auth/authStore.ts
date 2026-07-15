import { create } from "zustand";
import type { AuthState } from "./types";
import { AUTH_KEY, authStorage } from "./storage";
import { persist } from "zustand/middleware";
import { queryClient } from "../../lib/queryClient";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        const storable = authStorage.toStorable(user);
        set({ user: storable, isAuthenticated: true });
        queryClient.clear();
      },
      logout: () => {
        authStorage.clear();
        set({ user: null, isAuthenticated: false });
        queryClient.clear();
      },
      hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: AUTH_KEY,
      version: 1,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
