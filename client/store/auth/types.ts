export interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
  hasHydrated: boolean;
}