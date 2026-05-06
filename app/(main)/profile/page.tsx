"use client";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "next-auth/react";
import { User, Mail, Shield, Camera, Key, LogOut, AlertTriangle, Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ProfilePage() {
  const { user, setSession, clearAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile State
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Danger State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setPreviewImage(user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      if (name !== user?.name) formData.append("name", name);
      if (username !== user?.username) formData.append("username", username);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
        
        const meRes = await fetch("/api/user/me");
        const meData = await meRes.json();
        if (meData.success) {
          setSession(meData.data.user, meData.data.hasGithubToken);
        }
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, type: "PASSWORD_RESET" })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handlePasswordReset = async () => {
    if (otp.length !== 6) return toast.error("Enter a valid 6-digit code");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setIsResetting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, password: newPassword, code: otp })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
        setOtpSent(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Account deleted. Goodbye!");
        setIsDeleteModalOpen(false);
        clearAuth();
        signOut({ callbackUrl: "/login" });
      } else {
        toast.error(data.message);
        setIsDeleting(false);
      }
    } catch {
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    clearAuth();
    await signOut({ callbackUrl: "/login" });
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 relative z-20 min-h-screen">
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Account <span className="text-[#d0bcff]">Settings</span>
        </h1>
        <p className="text-white/40 text-sm mt-2 max-w-md mx-auto sm:mx-0">
          Manage your personal profile information, security credentials, and account status.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* Personal Info Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[24px] overflow-hidden shadow-2xl backdrop-blur-3xl">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
              <div className="p-2.5 bg-[#d0bcff]/10 rounded-xl border border-[#d0bcff]/20">
                <User size={20} className="text-[#d0bcff]" />
              </div>
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
            </div>

            {/* Changed items-start to items-center on mobile so the avatar stays in the middle */}
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
              
              {/* Avatar Uploader */}
              <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#110e15] overflow-hidden shadow-xl relative z-10 transition-transform group-hover:scale-105">
                  <img src={previewImage || ""} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>

              {/* Form Fields */}
              <div className="flex-1 w-full space-y-5 text-left">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1.5 block">Email Address</label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-white/50 cursor-not-allowed">
                    <Mail size={16} /> {user.email}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1.5 block">Full Name</label>
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-transparent focus:border-[#d0bcff]/40 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1.5 block">Username</label>
                    <input 
                      type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-transparent focus:border-[#d0bcff]/40 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
            <button 
              onClick={handleProfileUpdate} disabled={isSavingProfile}
              className="flex items-center justify-center gap-2 bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] px-8 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 active:scale-95 shadow-lg w-full sm:w-auto"
            >
              {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Profile</>}
            </button>
          </div>
        </motion.div>

        {/* Security & Password Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-2xl backdrop-blur-3xl">
          <div className="flex items-center gap-3 mb-6 justify-center sm:justify-start">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Shield size={20} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Security & Password</h2>
          </div>

          <div className="max-w-xl space-y-5 mx-auto sm:mx-0">
            {!otpSent ? (
               <div className="space-y-4">
                 <p className="text-sm text-white/50">To change your password, we first need to verify your identity by sending a code to your registered email.</p>
                 <button 
                   onClick={handleSendOtp} 
                   disabled={isSendingOtp} 
                   className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 w-full sm:w-auto"
                 >
                   {isSendingOtp ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                   Send Verification Code
                 </button>
               </div>
            ) : (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1.5 block">Verification Code</label>
                    <input 
                      type="text" placeholder="Enter 6-digit OTP" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-white/5 border border-transparent focus:border-blue-500/40 rounded-xl px-4 py-3.5 text-white outline-none tracking-widest font-mono transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1.5 block">New Password</label>
                      <input 
                        type="password" placeholder="Min. 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/5 border border-transparent focus:border-blue-500/40 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1.5 block">Confirm Password</label>
                      <input 
                        type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-transparent focus:border-blue-500/40 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handlePasswordReset} 
                    disabled={isResetting || otp.length !== 6 || !newPassword || !confirmPassword} 
                    className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 active:scale-95 flex justify-center items-center w-full sm:w-auto"
                  >
                    {isResetting ? <Loader2 size={16} className="animate-spin" /> : <><Key size={16} className="mr-2" /> Verify & Update Password</>}
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a0a0f]/95 border border-red-500/20 rounded-[24px] p-6 sm:p-8 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
              </div>
              <p className="text-white/40 text-sm">Logging out clears your active session. Deleting your account is permanent.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all border border-white/10 active:scale-95"
              >
                <LogOut size={16} /> Sign Out
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3.5 rounded-xl font-bold text-sm transition-all border border-red-500/20 active:scale-95"
              >
                <AlertTriangle size={16} /> Delete Account
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Confirmation Modal for Delete Account */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure? This action cannot be undone. All your unshared snippets will be permanently deleted and ownership of shared snippets will be transferred to co-owners."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}