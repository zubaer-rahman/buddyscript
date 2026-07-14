"use client";
import { queryClient } from "@lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

type DarkModeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DarkModeContext.Provider>
  );
};
