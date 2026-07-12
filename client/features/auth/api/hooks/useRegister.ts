import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../../store/auth/authStore";
import { getErrorMessage } from "../utils/getErrorMessage";
import { registerRequest } from "../authApi";

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
  const loginAction = useAuthStore((state) => state.login);

  const submit = async ({ repeatPassword, ...payload }: RegisterInput) => {
    setError("");

    if (payload.password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const user = await registerRequest(payload);
      loginAction(user);
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
