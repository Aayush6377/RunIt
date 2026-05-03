"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");

  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "", 
    code: "" 
  });

  const { trigger: sendOtp, isMutating: isSending } = useSWRMutation("/api/auth/otp/send", postRequest);
  const { trigger: resetPassword, isMutating: isResetting } = useSWRMutation("/api/auth/reset-password", postRequest);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp({ email: formData.email, type: "PASSWORD_RESET" });
      toast.success("Reset code sent to your email!");
      setStep("reset");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.code.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    try {
      const { confirmPassword, ...payload } = formData;
      await resetPassword(payload);
      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isMatch = formData.password === formData.confirmPassword && formData.password.length >= 8;

  return (
    <div className="w-full bg-[#15121b]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div key="email" initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              Enter the email address associated with your account, and we'll send you a 6-digit reset code.
            </p>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <input 
                type="email" required placeholder="Email Address"
                className="w-full bg-[#0f0d15] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              
              <button disabled={isSending || !formData.email} className="w-full bg-primary text-[#23005c] font-bold py-3 rounded-lg mt-2 hover:bg-[#b59cfc] transition-all disabled:opacity-50">
                {isSending ? "Sending Code..." : "Send Reset Code"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-on-surface-variant hover:text-white transition-colors">
                Return to Login
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Set New Password</h1>
            <p className="text-sm text-on-surface-variant mb-8 text-center leading-relaxed">
              Enter the code sent to <span className="text-primary">{formData.email}</span> and your new password.
            </p>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Verification Code</label>
                <OtpInput length={6} onComplete={(code) => setFormData({ ...formData, code })} />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">New Password</label>
                <input 
                  type="password" required placeholder="Min 8 characters" minLength={8}
                  className="w-full bg-[#0f0d15] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <input 
                  type="password" required placeholder="Confirm New Password"
                  className={`w-full bg-[#0f0d15] border rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword 
                    ? "border-red-500/50 focus:border-red-500" 
                    : "border-white/10 focus:border-primary"
                  }`}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <button 
                type="submit"
                disabled={isResetting || formData.code.length !== 6 || !isMatch} 
                className="w-full bg-primary text-[#23005c] font-bold py-3 rounded-lg mt-4 hover:bg-[#b59cfc] transition-all disabled:opacity-50"
              >
                {isResetting ? "Updating..." : "Update Password"}
              </button>
            </form>

            <button onClick={() => setStep("email")} className="w-full text-center text-sm text-on-surface-variant hover:text-white mt-6 transition-colors">
              Use a different email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}