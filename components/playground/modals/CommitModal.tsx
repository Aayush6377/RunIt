"use client";
import { GitCommit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import Modal from "@/components/ui/Modal";

export default function CommitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { snippetId, code } = usePlaygroundStore();
  const [message, setMessage] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  const handleCommit = async () => {
    if (!message.trim()) return toast.warning("Please enter a commit message.");
    setIsCommitting(true);
    try {
      const res = await fetch(`/api/snippets/${snippetId}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: code, message })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Code committed to history!");
        setMessage("");
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to commit code.");
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Commit Code">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <GitCommit size={20} className="text-[#d0bcff]" /> Commit Code
        </h2>
        <p className="text-sm text-white/50 mb-6">
          Save a snapshot of your current code to the revision history.
        </p>
        
        <input 
          autoFocus 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Fixed logic error in loop" 
          className="w-full bg-black/50 border border-white/10 focus:border-[#d0bcff]/50 rounded-lg p-3 text-sm text-white outline-none mb-6 transition-colors" 
        />
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 rounded-lg font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCommit} 
            disabled={isCommitting} 
            className="flex-1 py-2.5 rounded-lg font-medium bg-[#d0bcff] text-[#23005c] hover:bg-[#b59cfc] transition-colors disabled:opacity-50"
          >
            {isCommitting ? "Committing..." : "Commit"}
          </button>
        </div>
      </div>
    </Modal>
  );
}