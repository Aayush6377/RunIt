"use client";
import { SessionProvider } from "next-auth/react";
import AuthSync from "@/components/auth/AuthSync";
import { Toaster } from "sonner";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster theme="dark" position="top-right" richColors />
      <AuthSync /> 
      {children}
    </SessionProvider>
  );
}