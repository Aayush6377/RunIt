"use client";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import { GithubIcon, GoogleIcon } from "@/components/ui/Icons";
import { useEffect, useState } from "react";

export default function OAuthButtons() {
  const { setLastProvider, lastUsedProvider } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOAuth = async (provider: "google" | "github") => {
    setLastProvider(provider.toUpperCase() as any);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  const renderBadge = (provider: string) => {
    if (mounted && lastUsedProvider === provider) {
      return (
        <div className="absolute -top-2 -right-2 z-20 flex items-center gap-1.5 bg-primary px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(208,188,255,0.4)] border border-white/10">
          <span className="text-[8px] uppercase tracking-tighter text-[#23005c] font-black">
            Last Used
          </span>
          <span className="w-1 h-1 rounded-full bg-[#23005c] animate-pulse"></span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* GitHub Button */}
      <div className="relative">
        {renderBadge("GITHUB")}
        <button
          suppressHydrationWarning
          onClick={() => handleOAuth("github")}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg border transition-all text-on-surface font-medium bg-[#0f0d15]/50 hover:bg-[#0f0d15] group ${
            mounted && lastUsedProvider === "GITHUB"
              ? "border-primary/60 shadow-[0_0_15px_rgba(208,188,255,0.1)]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <GithubIcon size={20} />
            <span>Continue with GitHub</span>
          </div>
        </button>
      </div>

      {/* Google Button */}
      <div className="relative">
        {renderBadge("GOOGLE")}
        <button
          suppressHydrationWarning
          onClick={() => handleOAuth("google")}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg border transition-all text-on-surface font-medium bg-[#0f0d15]/50 hover:bg-[#0f0d15] group ${
            mounted && lastUsedProvider === "GOOGLE"
              ? "border-primary/60 shadow-[0_0_15px_rgba(208,188,255,0.1)]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <GoogleIcon size={20} />
            <span>Continue with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
}