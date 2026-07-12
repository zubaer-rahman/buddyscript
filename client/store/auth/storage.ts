import type { User } from "./types";

const AUTH_KEY = "auth-user";

export const authStorage = {
  load(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(user: User): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(AUTH_KEY);
  },
};
