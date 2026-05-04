"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { setSession } = useAuthStore();
  const { setTheme, setVimMode, setLanguage, setAutoSave, setTerminalPosition } = usePlaygroundStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        
        if (data.success) {
          setSession(data.data.user, data.data.hasGithubToken);
          setTheme(data.data.preferences.theme);
          setVimMode(data.data.preferences.vimMode);
          setLanguage(data.data.preferences.defaultLanguage.toLowerCase()); 
          setAutoSave(data.data.preferences.autoSave);
          setTerminalPosition(data.data.preferences.terminalPosition.toLowerCase());
        }
      } catch (e) {
        console.error("Failed to load user session");
      }
    };
    
    loadUser();
  }, [setSession, setTheme, setVimMode, setLanguage, setAutoSave, setTerminalPosition]);

  return <>{children}</>;
}