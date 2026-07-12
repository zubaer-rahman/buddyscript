export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

}
