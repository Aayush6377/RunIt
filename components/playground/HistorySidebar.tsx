"use client";
import { useEffect, useState } from "react";
import { GitCommit, Clock, X, DownloadCloud, History } from "lucide-react";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { toast } from "sonner";

export default function HistorySidebar() {
  const { snippetId, setIsHistoryOpen, setCode } = usePlaygroundStore();
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!snippetId) return;
    const fetchRevisions = async () => {
      try {
        const res = await fetch(`/api/snippets/${snippetId}/revisions`);
        const data = await res.json();
        if (data.success) setRevisions(data.data);
      } catch {
        toast.error("Failed to load history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRevisions();
  }, [snippetId]);

  const restoreRevision = async (revisionId: string) => {
    toast.loading("Restoring code...", { id: "restore" });
    try {
      const res = await fetch(`/api/revisions/${revisionId}`);
      const data = await res.json();
      if (data.success) {
        setCode(data.data.content);
        toast.success("Code restored from history!", { id: "restore" });
      } else {
        toast.error(data.message, { id: "restore" });
      }
    } catch {
      toast.error("Failed to restore revision", { id: "restore" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-72 h-full bg-[#110e15] border-r border-white/5 flex flex-col flex-shrink-0 shadow-2xl relative z-10">
      
      {/* Mac-style Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 bg-white/[0.02]">
        <h3 className="font-semibold text-white/90 flex items-center gap-2 text-sm">
          <History size={16} className="text-[#d0bcff]" /> 
          Revision History
        </h3>
        <button 
          onClick={() => setIsHistoryOpen(false)} 
          className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Timeline Area */}
      <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-3">
            <div className="w-5 h-5 border-2 border-[#d0bcff]/30 border-t-[#d0bcff] rounded-full animate-spin" />
            <p className="text-xs">Loading timeline...</p>
          </div>
        ) : revisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-3">
            <Clock size={32} className="opacity-20" />
            <p className="text-xs">No commits found.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {revisions.map((rev, index) => (
              <div key={rev.id} className="flex gap-4 group">
                
                {/* Left Column: The Continuous Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full bg-[#110e15] border-2 ring-2 transition-colors duration-300 ${index === 0 ? 'border-[#d0bcff] ring-[#d0bcff]/20 bg-[#d0bcff]/10' : 'border-white/20 ring-transparent group-hover:border-[#d0bcff]/50'}`} />
                  {/* Hide the line on the very last item */}
                  {index !== revisions.length - 1 && (
                    <div className="w-px h-full bg-gradient-to-b from-white/10 to-white/5 my-1" />
                  )}
                </div>

                {/* Right Column: The Commit Card */}
                <div className="flex-1 pb-6">
                  <div className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-all duration-300 shadow-lg">
                    
                    <div className="flex items-center gap-2 mb-1.5">
                      <GitCommit size={14} className="text-[#d0bcff]/70" />
                      <span className="text-[10px] font-bold text-[#d0bcff]/70 uppercase tracking-wider">Commit</span>
                    </div>
                    
                    <p className="text-sm text-white/90 leading-snug mb-2 font-medium">
                      {rev.message}
                    </p>
                    <p className="text-[11px] text-white/40 font-mono">
                      {formatDate(rev.createdAt)}
                    </p>

                    {/* Smooth Expanding Restore Button */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out">
                      <div className="overflow-hidden">
                        <button 
                          onClick={() => restoreRevision(rev.id)}
                          className="w-full mt-3 flex items-center justify-center gap-2 bg-[#d0bcff]/10 hover:bg-[#d0bcff]/20 text-[#d0bcff] py-2 rounded-lg text-xs font-bold transition-colors"
                        >
                          <DownloadCloud size={14} /> Restore Snapshot
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}