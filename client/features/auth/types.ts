export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export type LoginPayload = Pick<RegisterPayload, "email" | "password">;

export interface AuthResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
  };
  accessToken?: string;
}
