"use client";
import React, { useState, useEffect } from "react";
import { X, Folder, Sparkles } from "lucide-react";

interface SaveSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  isLoading: boolean;
}

export default function SaveSnippetModal({ isOpen, onClose, onSave, isLoading }: SaveSnippetModalProps) {
  const [inputTitle, setInputTitle] = useState("");

  useEffect(() => {
    if (isOpen) setInputTitle("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim() || isLoading) return;
    onSave(inputTitle.trim());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Mac Window Container */}
      <div 
        className="w-full max-w-md bg-[#110e15] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Mac-Style Header */}
        <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] shadow-sm" />
          </div>
          
          <h3 className="font-semibold text-white/90 flex items-center gap-1.5 text-xs absolute left-1/2 -translate-x-1/2">
            <Folder size={14} className="text-[#d0bcff]" /> 
            Save Project
          </h3>

          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="text-white/40 hover:text-white transition-colors p-1 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#d0bcff]/10 flex items-center justify-center mx-auto mb-3 border border-[#d0bcff]/20">
              <Sparkles size={20} className="text-[#d0bcff]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Name Your Snippet</h2>
            <p className="text-xs text-white/50 px-4">
              Give your project a descriptive title. This is separate from your actual file name (like main.py).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 block">
                Project Title
              </label>
              <input 
                autoFocus
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="e.g. Next.js Auth Wrapper"
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#d0bcff]/50 transition-colors shadow-inner placeholder:text-white/20"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!inputTitle.trim() || isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-[#23005c] bg-[#d0bcff] hover:bg-[#b59cfc] transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Snippet"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}