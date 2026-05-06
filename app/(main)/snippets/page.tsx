"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Code2, Clock, Users, ArrowRight, ChevronLeft, ChevronRight, FolderCode, Globe, Lock, Link as LinkIcon, Share2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import Loader from "@/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Debounce Helper
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SnippetsPage() {
  const { user } = useAuthStore();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [langFilter, setLangFilter] = useState("ALL");
  const [visFilter, setVisFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        role: roleFilter,
        language: langFilter,
        visibility: visFilter,
        search: debouncedSearch
      });

      const res = await fetch(`/api/snippets?${params}`);
      const data = await res.json();
      if (data.success) {
        setSnippets(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      toast.error("Failed to fetch snippets");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, langFilter, visFilter, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, langFilter, visFilter, debouncedSearch]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  // Handle Share functionality
  const handleShare = (token: string) => {
    if (!token) return;
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!");
  };

  const getUserRoleBadge = (snippet: any) => {
    if (snippet.ownerId === user?.id) {
      return { label: "OWNER", color: "text-green-400 bg-green-400/10 border-green-400/20" };
    }
    const collab = snippet.collaborators.find((c: any) => c.user.id === user?.id);
    const role = collab?.role || "UNKNOWN";
    
    switch (role) {
      case "CO_OWNER": return { label: "CO-OWNER", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
      case "EDITOR": return { label: "EDITOR", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" };
      case "VIEWER": return { label: "VIEWER", color: "text-gray-400 bg-gray-400/10 border-gray-400/20" };
      default: return { label: role, color: "text-white/50 bg-white/5 border-white/10" };
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "PUBLIC": return <Globe size={12} className="text-green-400" />;
      case "PRIVATE": return <Lock size={12} className="text-red-400" />;
      case "UNLISTED": return <LinkIcon size={12} className="text-yellow-400" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6 relative z-20 min-h-screen flex flex-col">
      
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20 text-[#d0bcff] text-xs font-bold uppercase tracking-widest mb-4">
            <FolderCode size={14} /> Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Your <span className="text-[#d0bcff]">Snippets</span>
          </h1>
        </div>

        {meta?.stats && (
          <div className="flex gap-4">
            <div className="bg-[#110e15]/80 border border-white/5 rounded-2xl p-4 min-w-[120px] backdrop-blur-md">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Total</p>
              <p className="text-2xl font-black text-white">{meta.stats.totalCombined}</p>
            </div>
            <div className="bg-[#110e15]/80 border border-white/5 rounded-2xl p-4 min-w-[120px] backdrop-blur-md">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Owned</p>
              <p className="text-2xl font-black text-green-400">{meta.stats.totalOwned}</p>
            </div>
            <div className="bg-[#110e15]/80 border border-white/5 rounded-2xl p-4 min-w-[120px] backdrop-blur-md">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Shared</p>
              <p className="text-2xl font-black text-blue-400">{meta.stats.totalShared}</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-[#0a0a0f]/90 border border-white/10 rounded-2xl p-2 mb-8 flex flex-col md:flex-row gap-2 backdrop-blur-xl shadow-xl z-30">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text" 
            placeholder="Search snippets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-transparent focus:border-[#d0bcff]/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Role Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d0bcff]/70" />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-white/5 border border-transparent focus:border-[#d0bcff]/30 rounded-xl py-3 pl-9 pr-10 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-[#110e15] text-white">All Roles</option>
              <option value="OWNER" className="bg-[#110e15] text-white">Owner</option>
              <option value="CO_OWNER" className="bg-[#110e15] text-white">Co-Owner</option>
              <option value="EDITOR" className="bg-[#110e15] text-white">Editor</option>
              <option value="VIEWER" className="bg-[#110e15] text-white">Viewer</option>
            </select>
          </div>

          {/* Visibility Filter */}
          <select 
            value={visFilter} 
            onChange={(e) => setVisFilter(e.target.value)}
            className="bg-white/5 border border-transparent focus:border-[#d0bcff]/30 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer font-medium"
          >
            <option value="ALL" className="bg-[#110e15] text-white">All Visibility</option>
            <option value="PUBLIC" className="bg-[#110e15] text-white">Public</option>
            <option value="PRIVATE" className="bg-[#110e15] text-white">Private</option>
            <option value="UNLISTED" className="bg-[#110e15] text-white">Unlisted</option>
          </select>

          {/* Language Filter */}
          <select 
            value={langFilter} 
            onChange={(e) => setLangFilter(e.target.value)}
            className="bg-white/5 border border-transparent focus:border-[#d0bcff]/30 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer font-medium"
          >
            <option value="ALL" className="bg-[#110e15] text-white">All Languages</option>
            <option value="javascript" className="bg-[#110e15] text-white">JavaScript</option>
            <option value="typescript" className="bg-[#110e15] text-white">TypeScript</option>
            <option value="python" className="bg-[#110e15] text-white">Python</option>
            <option value="cpp" className="bg-[#110e15] text-white">C++</option>
            <option value="java" className="bg-[#110e15] text-white">Java</option>
            <option value="rust" className="bg-[#110e15] text-white">Rust</option>
            <option value="go" className="bg-[#110e15] text-white">Go</option>
          </select>
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="flex-1">
        {loading ? (
          <div className="h-[400px] flex items-center justify-center"><Loader /></div>
        ) : snippets.length === 0 ? (
          <div className="bg-[#110e15]/50 border border-white/5 rounded-[32px] p-16 text-center backdrop-blur-xl">
             <FolderCode size={48} className="text-white/10 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-white mb-2">No snippets found</h2>
             <p className="text-white/40 text-sm">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {snippets.map((snippet) => {
                const badge = getUserRoleBadge(snippet);
                const totalMembers = snippet.collaborators.length + 1; // +1 for the owner

                return (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-[#0a0a0f]/95 border border-white/10 hover:border-[#d0bcff]/40 rounded-[24px] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-2xl backdrop-blur-3xl relative"
                  >
                    {/* Header */}
                    <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-4 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-[#ff5f56] transition-colors" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-[#ffbd2e] transition-colors" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-[#27c93f] transition-colors" />
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded text-white/50 text-[10px] uppercase tracking-widest font-bold">
                           {getVisibilityIcon(snippet.visibility)}
                           {snippet.visibility}
                         </div>
                         <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{snippet.language}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-[#d0bcff]/10 rounded-xl border border-[#d0bcff]/20">
                          <Code2 size={20} className="text-[#d0bcff]" />
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-md border tracking-widest uppercase ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{snippet.title}</h3>
                      
                      <div className="mt-auto pt-6 flex items-center justify-between text-xs text-white/40">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(snippet.updatedAt))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white/30">{totalMembers} Members</span>
                          {/* Owner + Collaborator Avatars */}
                          <div className="flex -space-x-2">
                            <img 
                              src={snippet.owner.image || `https://api.dicebear.com/7.x/initials/svg?seed=${snippet.owner.name}`} 
                              className="w-6 h-6 rounded-full border-2 border-[#0a0a0f] relative z-10" 
                              title={`Owner: @${snippet.owner.username}`}
                            />
                            {snippet.collaborators.slice(0, 2).map((c: any) => (
                              <img 
                                key={c.id} 
                                src={c.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${c.user.name}`} 
                                className="w-6 h-6 rounded-full border-2 border-[#0a0a0f]" 
                                title={`@${c.user.username}`}
                              />
                            ))}
                            {snippet.collaborators.length > 2 && (
                              <div className="w-6 h-6 rounded-full border-2 border-[#0a0a0f] bg-white/10 flex items-center justify-center text-[8px] font-bold text-white">
                                +{snippet.collaborators.length - 2}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 flex gap-2">
                      <Link 
                        href={`/playground/${snippet.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-[#d0bcff] text-white hover:text-[#23005c] border border-white/5 hover:border-[#d0bcff] py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-[0.98]"
                      >
                        Open Editor <ArrowRight size={16} />
                      </Link>

                      {/* Share Button (Only visible if Public or Unlisted) */}
                      {(snippet.visibility === "PUBLIC" || snippet.visibility === "UNLISTED") && snippet.shareToken && (
                        <button 
                          onClick={() => handleShare(snippet.shareToken)}
                          className="px-4 flex items-center justify-center bg-white/5 hover:bg-[#d0bcff]/20 text-[#d0bcff] border border-white/5 hover:border-[#d0bcff]/50 rounded-xl transition-all active:scale-[0.95]"
                          title="Copy Share Link"
                        >
                          <Share2 size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
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