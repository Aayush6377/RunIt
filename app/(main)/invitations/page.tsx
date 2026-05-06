"use client";
import { useEffect, useState, useCallback } from "react";
import { Eye, User, Clock, Inbox, ShieldCheck, ArrowRight, Search, ChevronLeft, ChevronRight, CheckCircle2, XCircle, FolderCode } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";

// Debounce Helper
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function InvitationsPage() {
  const [invites, setInvites] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [tab, setTab] = useState<"pending" | "past">("pending");
  const [page, setPage] = useState(1);

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        tab: tab,
        search: debouncedSearch
      });

      const res = await fetch(`/api/invitations?${params}`);
      const data = await res.json();
      if (data.success) {
        setInvites(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error("Failed to fetch invitations");
    } finally {
      setLoading(false);
    }
  }, [page, tab, debouncedSearch]);

  // Reset to page 1 if search or tab changes
  useEffect(() => {
    setPage(1);
  }, [tab, debouncedSearch]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6 relative z-20 min-h-screen flex flex-col">
      
      {/* Header & Stats (Matches Snippets UI) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20 text-[#d0bcff] text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck size={14} /> Collaboration Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Incoming <span className="text-[#d0bcff]">Invites</span>
          </h1>
        </div>

        {/* Dynamic Stats Grid */}
        {meta?.stats && (
          <div className="flex gap-4">
            <div className="bg-[#110e15]/80 border border-white/5 rounded-2xl p-4 min-w-[120px] backdrop-blur-md">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Total</p>
              <p className="text-2xl font-black text-white">{meta.stats.total}</p>
            </div>
            <div className="bg-[#110e15]/80 border border-white/5 rounded-2xl p-4 min-w-[120px] backdrop-blur-md">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Pending</p>
              <p className="text-2xl font-black text-yellow-400">{meta.stats.pending}</p>
            </div>
            <div className="bg-[#110e15]/80 border border-white/5 rounded-2xl p-4 min-w-[120px] backdrop-blur-md">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Past</p>
              <p className="text-2xl font-black text-blue-400">{meta.stats.past}</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar (Search & Tabs) */}
      <div className="bg-[#0a0a0f]/90 border border-white/10 rounded-2xl p-2 mb-8 flex flex-col md:flex-row gap-2 backdrop-blur-xl shadow-xl z-30">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text" 
            placeholder="Search by snippet or sender..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-transparent focus:border-[#d0bcff]/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20"
          />
        </div>
        
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setTab("pending")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "pending" ? "bg-[#d0bcff] text-[#23005c] shadow-md" : "text-white/50 hover:text-white hover:bg-white/5"}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setTab("past")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "past" ? "bg-[#d0bcff] text-[#23005c] shadow-md" : "text-white/50 hover:text-white hover:bg-white/5"}`}
          >
            Past Invites
          </button>
        </div>
      </div>

      {/* Invitations List */}
      <div className="flex-1">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center"><Loader /></div>
        ) : invites.length === 0 ? (
          <div className="bg-[#0a0a0f]/90 border border-white/10 rounded-[32px] p-16 text-center backdrop-blur-2xl shadow-2xl">
             <Inbox size={48} className="text-white/10 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-white mb-2">No {tab} invitations found</h2>
             <p className="text-white/40 text-sm mb-6">You're all caught up on your collaboration requests.</p>
             <Link href="/playground" className="text-[#d0bcff] text-sm font-bold hover:underline inline-flex items-center gap-2">
               Go to Playground <ArrowRight size={16} />
             </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {invites.map((invite: any) => (
                <motion.div
                  key={invite.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="group relative bg-[#0a0a0f]/95 border border-white/10 hover:border-[#d0bcff]/40 p-5 sm:p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between transition-all backdrop-blur-3xl shadow-2xl overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#d0bcff] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                    <img 
                      src={invite.sender.image || `https://api.dicebear.com/7.x/initials/svg?seed=${invite.sender.name}`} 
                      className="w-14 h-14 rounded-2xl border border-white/10 object-cover shadow-lg"
                      alt="Sender"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-white font-bold text-lg">{invite.snippet.title}</h3>
                        <span className="text-[9px] font-bold bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-tighter">{invite.snippet.language}</span>
                        <span className="text-[9px] font-bold bg-[#d0bcff]/10 border border-[#d0bcff]/20 px-2 py-0.5 rounded text-[#d0bcff] uppercase tracking-tighter">{invite.assignedRole.replace("_", " ")}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <p className="flex items-center gap-1.5"><User size={12} /> from <span className="text-white/70">@{invite.sender.username}</span></p>
                        <p className="flex items-center gap-1.5"><Clock size={12} /> {formatDate(invite.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dynamic Action Button based on Status */}
                  <div className="mt-4 sm:mt-0 shrink-0">
                    {invite.status === "PENDING" && (
                      <Link 
                        href={`/invitations/${invite.id}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-[#d0bcff] text-white hover:text-[#23005c] rounded-xl transition-all font-bold text-sm border border-white/10 active:scale-95 shadow-lg w-full sm:w-auto"
                      >
                        View Details <Eye size={16} />
                      </Link>
                    )}
                    {invite.status === "ACCEPTED" && (
                      <Link 
                        href={`/playground/${invite.snippetId}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all font-bold text-sm shadow-lg w-full sm:w-auto"
                      >
                        <CheckCircle2 size={16} /> Open Snippet
                      </Link>
                    )}
                    {invite.status === "REJECTED" && (
                      <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500/5 text-red-400/50 border border-red-500/10 rounded-xl font-bold text-sm w-full sm:w-auto cursor-not-allowed">
                        <XCircle size={16} /> Rejected
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {meta?.pagination?.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-white/50">
            Page <span className="text-white">{page}</span> of <span className="text-white">{meta.pagination.totalPages}</span>
          </span>
          <button 
            disabled={page === meta.pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}