import api from "../../../lib/axios";
import type { User } from "../../../store/auth/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export async function loginRequest(payload: LoginPayload): Promise<User> {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data.data.user;
}
