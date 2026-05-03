"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.ok) {
        toast.success("Welcome back to RunIt!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="w-full bg-[#15121b]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative"
    >
      <h1 className="text-2xl font-bold text-white mb-1">Access Account</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        New to RunIt? <Link href="/register" className="text-primary hover:underline transition-colors">Create an account</Link>
      </p>

      <OAuthButtons />

      <div className="flex items-center gap-4 py-6">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">Or Use Credentials</span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="text" 
          required 
          placeholder="Username or Email"
          className="w-full bg-[#0f0d15] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/30"
          onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
          disabled={isLoading}
        />
        
        <input 
          type="password" 
          required 
          placeholder="Password"
          className="w-full bg-[#0f0d15] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/30"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={isLoading}
        />

        <div className="flex justify-end mt-[-8px] mb-2">
          <Link 
            href="/reset-password" 
            className="text-xs font-code text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Forgot Password?
          </Link>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading || !formData.usernameOrEmail || !formData.password} 
          className="w-full bg-primary text-[#23005c] font-bold py-3 rounded-lg hover:bg-[#b59cfc] transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(208,188,255,0.3)] flex items-center justify-center gap-2"
        >
          {isLoading ? <span className="animate-pulse">Authenticating...</span> : "Sign In"}
        </button>
      </form>
    </motion.div>
  );
}