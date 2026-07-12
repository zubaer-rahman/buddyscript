"use client";

import { Toaster } from "react-hot-toast";
import { DarkModeProvider } from "@/context/dark-mode-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
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