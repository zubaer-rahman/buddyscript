import type { User } from "./types";

const AUTH_KEY = "auth-user";

export const authStorage = {
  load(): User | null {
    try {
      const raw = localStorage.getItem("auth-user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  toStorable(user: User): User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
  },
  clear(): void {
    localStorage.removeItem(AUTH_KEY);
  },
};
