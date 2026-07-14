import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
 import { register } from "@features/auth/api/authApi";
import { getErrorMessage } from "../utils/getErrorMessage";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export function useRegister() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  const submit = async ({ repeatPassword, ...payload }: RegisterInput) => {
    setError("");

    if (payload.password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(payload);
      toast.success("Account created! Welcome to Buddy.");
      router.push("/feed");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { submit, error, loading };
}
