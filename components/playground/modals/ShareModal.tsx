"use client";
import { Share2, Copy, Globe, Eye, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export default function ShareModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { snippetId, visibility, setVisibility } = usePlaygroundStore();
  const [shareTokenUrl, setShareTokenUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const generateShareLink = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/snippets/share`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snippetId })
    });
      const data = await res.json();
      if (data.success && data.data.shareToken) {
        setShareTokenUrl(`${window.location.origin}/share/${data.data.shareToken}`);
        toast.success("Share link generated!");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to generate share link.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f0d15] border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Share2 size={20} className="text-[#d0bcff]" /> Share Snippet</h2>
        <p className="text-sm text-white/50 mb-6">Manage visibility and generate secure share links.</p>

        {visibility === "PRIVATE" ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-400 font-medium">This snippet is private.</p>
            <p className="text-xs text-white/60 mt-1">Change visibility in settings to Public or Unlisted to share it.</p>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-xs text-white/50 mb-2">Shareable Link</label>
            {!shareTokenUrl ? (
              <button onClick={generateShareLink} disabled={isGenerating} className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white p-3 rounded-lg text-sm transition-colors disabled:opacity-50">
                {isGenerating ? "Generating..." : "Generate Secure Link"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input readOnly value={shareTokenUrl} className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white/80 outline-none" />
                <button 
                  onClick={() => { navigator.clipboard.writeText(shareTokenUrl); toast.success("Copied to clipboard"); }} 
                  className="bg-[#d0bcff] text-[#23005c] p-3 rounded-lg hover:bg-[#b59cfc] transition-colors"
                ><Copy size={18} /></button>
              </div>
            )}
          </div>
        )}
        <button onClick={onClose} className="w-full py-2.5 rounded-lg font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">Close</button>
      </div>
    </div>
  );
}