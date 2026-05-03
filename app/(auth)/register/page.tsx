"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import OAuthButtons from "@/components/auth/OAuthButtons";
import OtpInput from "@/components/auth/OtpInput";

async function postRequest(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "An error occurred");
  return data;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  // Added confirmPassword to state
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    code: "" 
  });

  const { trigger: sendOtp, isMutating: isSending } = useSWRMutation("/api/auth/otp/send", postRequest);
  const { trigger: register, isMutating: isRegistering } = useSWRMutation("/api/auth/register", postRequest);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await sendOtp({ email: formData.email, type: "REGISTER" });
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRegister = async () => {
    if (formData.code.length !== 6) return;
    try {
      const { confirmPassword, ...submitData } = formData;
      await register(submitData);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full bg-[#15121b]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-white mb-1">Initialize Account</h1>
            <p className="text-sm text-on-surface-variant mb-6">
              Already in the system? <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </p>

            <OAuthButtons />

            <div className="flex items-center gap-4 py-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Or Execute</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <input 
                type="text" required placeholder="Full Name"
                className="w-full bg-[#0f0d15] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input 
                type="email" required placeholder="Email Address"
                className="w-full bg-[#0f0d15] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input 
                type="password" required placeholder="Password (Min 8 chars)"
                className="w-full bg-[#0f0d15] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {/* New Confirm Password Field */}
              <input 
                type="password" required placeholder="Confirm Password"
                className={`w-full bg-[#0f0d15] border rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-white/10 focus:border-primary"
                }`}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              
              <button 
                disabled={isSending || !formData.name || !formData.email || formData.password.length < 8} 
                className="w-full bg-primary text-[#23005c] font-bold py-3 rounded-lg mt-2 hover:bg-[#b59cfc] transition-all disabled:opacity-50"
              >
                {isSending ? "Processing..." : "Continue"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Verify Email</h1>
            <p className="text-sm text-on-surface-variant mb-8 text-center leading-relaxed">
              We sent a 6-digit code to <br/><span className="text-primary">{formData.email}</span>
            </p>

            <OtpInput length={6} onComplete={(code) => setFormData({ ...formData, code })} />

            <button 
              onClick={handleRegister} 
              disabled={isRegistering || formData.code.length !== 6} 
              className="w-full bg-primary text-[#23005c] font-bold py-3 rounded-lg mt-8 hover:bg-[#b59cfc] transition-all disabled:opacity-50"
            >
              {isRegistering ? "Verifying..." : "Create Account"}
            </button>

            <button onClick={() => setStep("form")} className="w-full text-center text-sm text-on-surface-variant hover:text-white mt-4 transition-colors">
              Back to form
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}