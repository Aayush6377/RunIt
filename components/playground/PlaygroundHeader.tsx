"use client";
import { 
  Play, Save, GitCommit, Copy, Download, Share2, 
  Settings, Loader2, Check, Lock, Globe, Eye, History, FilePlus
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePlaygroundStore, GLOT_LANGUAGES } from "@/store/usePlaygroundStore";
import { useAuthStore } from "@/store/useAuthStore";
import ShareModal from "./modals/ShareModal";
import CommitModal from "./modals/CommitModal";
import ConfirmModal from "../ui/ConfirmModal"; 

export default function PlaygroundHeader() {
  const { isAuthenticated } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [newSnippetModalOpen, setNewSnippetModalOpen] = useState(false);

  const { 
    snippetId, selectedLanguage, setLanguage, fileName, setFileName, 
    code, userInput, setOutput, isExecuting, setIsExecuting,
    isSettingsOpen, setIsSettingsOpen, isHistoryOpen, setIsHistoryOpen, visibility,
    resetPlayground // Import the reset function
  } = usePlaygroundStore();

  const currentLang = GLOT_LANGUAGES.find(l => l.id === selectedLanguage);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (snippetId) return toast.warning("Language is locked once a snippet is saved.");
    setLanguage(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${currentLang?.extension || "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const handleSave = async () => {
    if (!isAuthenticated) return toast.info("Please log in to save snippets.");
    setIsSaving(true);
    try {
      const res = await fetch(snippetId ? `/api/snippets/${snippetId}` : `/api/snippets`, {
        method: snippetId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: fileName, content: code, language: selectedLanguage.toUpperCase() })
      });
      const data = await res.json();
      
      if (data.success) {
        if (!snippetId && data.data.id) usePlaygroundStore.getState().setSnippetId(data.data.id);
        toast.success("Snippet saved!");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewSnippet = () => {
    resetPlayground();
    setNewSnippetModalOpen(false);
    toast.success("Started a new snippet!");
  };

  const handleRun = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        body: JSON.stringify({ language: selectedLanguage, fileName: `${fileName}.${currentLang?.extension}`, content: code, stdin: userInput })
      });
      const data = await res.json();
      setOutput(data.stdout || data.stderr || data.error || "No output");
    } catch {
      toast.error("Execution failed. Check connection.");
    } finally {
      setIsExecuting(false);
    }
  };

  const VisIcon = visibility === "PRIVATE" ? Lock : visibility === "PUBLIC" ? Globe : Eye;

  return (
    <>
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
      <CommitModal isOpen={commitModalOpen} onClose={() => setCommitModalOpen(false)} />
      
      {/* Confirm Modal for New Snippet */}
      <ConfirmModal 
        isOpen={newSnippetModalOpen} 
        onClose={() => setNewSnippetModalOpen(false)}
        onConfirm={handleNewSnippet}
        title="Start New Snippet?"
        message="Are you sure you want to start a new snippet? Any unsaved changes in your current code will be lost."
        type="warning"
        cancelText="Cancel"
        confirmText="Yes, Start Fresh"
      />

      <div className="h-14 bg-[#0a0a0f] border-b border-white/10 flex items-center justify-between px-2 sm:px-4 shrink-0 overflow-x-auto no-scrollbar">
        
        {/* Left Area */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {snippetId && (
            <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className={`p-1.5 sm:p-2 rounded transition-colors ${isHistoryOpen ? 'text-[#d0bcff] bg-[#d0bcff]/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`} title="Revision History">
              <History size={18} />
            </button>
          )}

          <div className="flex items-center bg-white/5 border border-white/10 rounded px-2 py-1 focus-within:border-[#d0bcff]/50">
            <input value={fileName} onChange={(e) => setFileName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))} className="bg-transparent text-xs sm:text-sm font-mono text-white outline-none w-16 sm:w-24 text-right" />
            <span className="text-xs sm:text-sm font-mono text-[#d0bcff]/60">.{currentLang?.extension}</span>
          </div>
          
          <select value={selectedLanguage} onChange={handleLanguageChange} className={`bg-transparent text-xs sm:text-sm font-mono outline-none cursor-pointer capitalize ${snippetId ? 'text-white/30' : 'text-white/80'}`}>
            {GLOT_LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-[#0f0d15]">{l.label}</option>)}
          </select>

          {snippetId && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-white/50">
              <VisIcon size={12} /> <span className="hidden md:inline">{visibility}</span>
            </div>
          )}
        </div>

        {/* Right Area */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-4">
          
          <button onClick={handleCopy} className="p-1.5 sm:p-2 text-white/40 hover:text-white rounded hover:bg-white/5" title="Copy Code">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          <button onClick={handleDownload} className="p-1.5 sm:p-2 text-white/40 hover:text-white rounded hover:bg-white/5" title="Download Code">
            <Download size={16} />
          </button>
          
          <div className="h-4 w-px bg-white/10 mx-1 sm:mx-2" />

          {isAuthenticated && (
            <>
              {/* New Snippet Button */}
              <button onClick={() => setNewSnippetModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white px-2 py-1.5 rounded hover:bg-white/5">
                <FilePlus size={16} /> <span className="hidden md:inline">New</span>
              </button>

              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white px-2 py-1.5 rounded hover:bg-white/5">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} <span className="hidden md:inline">Save</span>
              </button>
              
              <button onClick={() => snippetId ? setShareModalOpen(true) : toast.warning("Save snippet first!")} className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white px-2 py-1.5 rounded hover:bg-white/5">
                <Share2 size={16} /> <span className="hidden md:inline">Share</span>
              </button>
              
              <button onClick={() => snippetId ? setCommitModalOpen(true) : toast.warning("Save snippet first!")} className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-[#d0bcff] px-2 py-1.5 rounded hover:bg-[#d0bcff]/10">
                <GitCommit size={16} /> <span className="hidden lg:inline">Commit</span>
              </button>
            </>
          )}

          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-1.5 sm:p-2 transition-colors rounded ml-1 ${isSettingsOpen ? 'text-[#d0bcff] bg-[#d0bcff]/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Settings size={18} />
          </button>

          <button disabled={isExecuting} onClick={handleRun} className="h-8 sm:h-9 bg-[#d0bcff] text-[#23005c] px-4 sm:px-6 rounded-lg flex items-center gap-2 font-bold text-xs disabled:opacity-50 ml-1 sm:ml-2">
            {isExecuting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />} {isExecuting ? "RUNNING" : "RUN"}
          </button>
        </div>
      </div>
    </>
  );
}