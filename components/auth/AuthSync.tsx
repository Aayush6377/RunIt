"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setSession(session.user);
    } else if (status === "unauthenticated") {
      setSession(null);
    }
  }, [session, status, setSession]);

  return null;
}