import axios, { type AxiosError, type AxiosInstance } from "axios";
import { getFriendlyMessage } from "./errorMessages";
import { BASE_URL } from "./config";

export function attachAuthInterceptor(api: AxiosInstance) {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as typeof error.config & {
        _retry?: boolean;
      };

      const isAuthRoute =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register");

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
        originalRequest._retry = true;
        try {
          await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          return api(originalRequest);
        } catch {
          return Promise.reject(
            new Error("Your session has expired. Please log in again."),
          );
        }
      }

      const friendlyMessage = getFriendlyMessage(error);
      error.message = friendlyMessage;
      (error as AxiosError & { friendlyMessage: string }).friendlyMessage = friendlyMessage;
      
      return Promise.reject(error);
    },
  );
}
