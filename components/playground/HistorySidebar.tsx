"use client";
import { useEffect, useState } from "react";
import { GitCommit, Clock, X, DownloadCloud } from "lucide-react";
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

  return (
    <div className="w-64 h-full bg-[#0a0a0f] border-r border-white/10 flex flex-col flex-shrink-0">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm"><Clock size={16} className="text-[#d0bcff]"/> History</h3>
        <button onClick={() => setIsHistoryOpen(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {isLoading ? (
          <div className="text-center text-white/40 text-sm mt-10">Loading timeline...</div>
        ) : revisions.length === 0 ? (
          <div className="text-center text-white/40 text-sm mt-10">No commits found.</div>
        ) : (
          revisions.map((rev) => (
            <div key={rev.id} className="bg-white/5 border border-white/10 rounded-lg p-3 relative group">
              <div className="absolute top-0 bottom-0 left-3 w-px bg-white/10 -z-10" />
              <div className="flex items-start gap-2">
                <div className="mt-1 bg-[#0a0a0f] p-0.5 rounded-full border border-white/20"><GitCommit size={12} className="text-white/60"/></div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium break-words leading-tight">{rev.message}</p>
                  <p className="text-[10px] text-white/40 mt-1">{new Date(rev.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => restoreRevision(rev.id)}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-[#d0bcff]/10 hover:bg-[#d0bcff]/20 text-[#d0bcff] py-1.5 rounded text-xs font-bold transition-colors opacity-0 group-hover:opacity-100"
              >
                <DownloadCloud size={14} /> Restore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}