import api from "../../../lib/axios";
import type { User } from "../../../store/auth/types";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
type LoginPayload = Pick<RegisterPayload, "email" | "password">;

interface LoginOrRegisterResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export async function loginRequest(payload: LoginPayload): Promise<User> {
  const response = await api.post<LoginOrRegisterResponse>(
    "/auth/login",
    payload,
  );
  return response.data.data.user;
}

export async function registerRequest(payload: RegisterPayload): Promise<User> {
  const response = await api.post<LoginOrRegisterResponse>(
    "/auth/register",
    payload,
  );
  return response.data.data.user;
}
