import { create } from "zustand";
import type { AuthState } from "./types";
import { authStorage } from "./storage";

const initialUser = authStorage.load();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  hasHydrated: false,
  login: (user) => {
    const storable = authStorage.toStorable(user);
    localStorage.setItem("auth-user", JSON.stringify(storable));
    set({ user: storable, isAuthenticated: true });
  },
  logout: () => {
    authStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
  setHasHydrated: (hasHydrated: boolean) => {
    set({ hasHydrated });
  },
}));
