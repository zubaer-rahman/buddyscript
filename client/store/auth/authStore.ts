import { create } from "zustand";
import type { AuthState } from "./types";
import { authStorage } from "./storage";

const initialUser = authStorage.load();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  hasHydrated: false,
  login: (user) => {
    authStorage.save(user);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    authStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
  setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
}));
