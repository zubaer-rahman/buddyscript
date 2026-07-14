import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@store/auth/authStore";
import { login as loginApi } from "@features/auth/api/authApi";
import type { LoginPayload } from "../types";

export function useLogin() {
  const router = useRouter();
  const storeLogin = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data) => {
      storeLogin(data.user);
      toast.success("Welcome back! Logged in successfully.");
      router.push("/feed");
    },
  });
}
