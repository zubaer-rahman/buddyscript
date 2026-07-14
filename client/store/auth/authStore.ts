import { create } from "zustand";
import type { AuthState } from "./types";
import { AUTH_KEY, authStorage } from "./storage";
import { persist } from "zustand/middleware";

const initialUser = authStorage.load();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: initialUser,
      isAuthenticated: !!initialUser,
      login: (user) => {
        const storable = authStorage.toStorable(user);
        // localStorage.setItem("auth-user", JSON.stringify(storable));
        set({ user: storable, isAuthenticated: true });
      },
      logout: () => {
        authStorage.clear();
        set({ user: null, isAuthenticated: false });
      },
      hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: AUTH_KEY,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
