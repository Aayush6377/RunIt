"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, X, Shield, Code2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { motion } from "framer-motion";

export default function InvitationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    fetch(`/api/invitations/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInvite(data.data);
          setLoading(false);
        } else {
          toast.error(data.message || "Invitation not found");
          router.push("/invitations");
        }
      })
      .catch(() => {
        router.push("/invitations");
      });
  }, [id, router]);

  const handleResponse = async (status: "ACCEPTED" | "REJECTED") => {
    setIsResponding(true);
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Invitation ${status.toLowerCase()}!`);
        router.push(status === "ACCEPTED" ? `/playground/${invite.snippetId}` : "/invitations");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsResponding(false);
    }
  };


  if (loading || !invite) {
    return (
      <div className="h-screen flex items-center justify-center relative z-20">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 relative z-20">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm font-bold group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Inbox
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#0a0a0f]/95 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl"
      >
        {/* Mac Header */}
        <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">system.invite_validation</span>
        </div>

        <div className="p-10 sm:p-14 text-center">
          <div className="relative inline-block mb-8">
             <img 
               src={invite.sender.image || `https://api.dicebear.com/7.x/initials/svg?seed=${invite.sender.name}`} 
               className="w-28 h-28 rounded-full border-4 border-[#110e15] shadow-2xl relative z-10"
               alt="Sender"
             />
             <div className="absolute bottom-0 right-1 p-2.5 bg-[#d0bcff] rounded-full border-4 border-[#0a0a0f] text-[#23005c] z-20">
               <Shield size={18} strokeWidth={2.5} />
             </div>
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Collaboration <span className="text-[#d0bcff]">Request</span></h1>
          <p className="text-white/50 text-sm mb-8">@{invite.sender.username} invited you to work on:</p>

          {/* Project Details */}
          <div className="bg-white/5 rounded-3xl p-6 mb-10 border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-[#d0bcff]/10 rounded-2xl border border-[#d0bcff]/20 text-[#d0bcff]"><Code2 size={24} /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-white/20">Project</p>
                <h2 className="text-white font-bold text-lg">{invite.snippet.title}</h2>
              </div>
            </div>
            <span className="text-xs font-bold text-[#d0bcff] bg-[#d0bcff]/10 px-4 py-1.5 rounded-full border border-[#d0bcff]/20">{invite.assignedRole.replace("_", " ")}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button disabled={isResponding} onClick={() => handleResponse("REJECTED")} className="flex-1 py-4 bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 rounded-2xl border border-white/10 transition-all font-bold text-sm">Reject</button>
            <button disabled={isResponding} onClick={() => handleResponse("ACCEPTED")} className="flex-1 py-4 bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] rounded-2xl transition-all font-bold text-sm shadow-xl flex items-center justify-center gap-2">
              {isResponding ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Accept Invite</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}