"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setSession({
        id: (session.user as any).id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
        username: (session.user as any).username || undefined,
      });
    } else if (status === "unauthenticated") {
      setSession(null);
    }
  }, [session, status, setSession]);

  return null;
}