import api from "../../../lib/axios";
import { LoginPayload, RegisterPayload, AuthResponse } from "../types";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<{ success: boolean; data: AuthResponse }>(
    "/auth/login",
    payload,
  );
  return response.data.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await api.post<{ success: boolean; data: AuthResponse }>(
    "/auth/register",
    payload,
  );
  return response.data.data;
}
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
