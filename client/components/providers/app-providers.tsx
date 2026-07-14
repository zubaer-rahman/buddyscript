"use client";

import { Toaster } from "react-hot-toast";
import { DarkModeProvider } from "../../contexts/dark-mode-context";
import { useEffect } from "react";
import { authStorage } from "../../store/auth/storage";
import { useAuthStore } from "../../store/auth/authStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const user = authStorage.load();
    if (user) {
      useAuthStore.setState({ user, isAuthenticated: true });
    }
    useAuthStore.setState({ hasHydrated: true });
  }, []);
  return (
    <DarkModeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: "Poppins, sans-serif", fontSize: "14px" },
        }}
      />
      {children}
    </DarkModeProvider>
  );
}
