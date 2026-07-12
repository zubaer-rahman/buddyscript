"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../../store/auth/authStore";
import { loginRequest } from "../authApi";

interface AxiosLikeError {
  friendlyMessage?: string;
  response?: { data?: { message?: string } };
}

function getErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosLikeError;
  return (
    axiosErr.friendlyMessage ||
    axiosErr.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

export function useLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);

  const submit = async (email: string, password: string) => {
    setError("");
    setLoading(true);
    try {
      const user = await loginRequest({ email, password });
      loginAction(user);
      toast.success("Welcome back! Logged in successfully.");
      router.push("/feed");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { submit, error, loading };
}
