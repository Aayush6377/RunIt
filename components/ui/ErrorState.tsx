"use client";
import React from "react";
import { AlertTriangle, Home, ChevronLeft, Terminal } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: "error" | "access" | "expired";
}

export default function ErrorState({ 
  title = "Snippet Not Found", 
  message = "This snippet may have been deleted, set to private, or the link has expired.",
  type = "error"
}: ErrorStateProps) {
  
  const isAccessDenied = type === "access";

  return (
    <div className="w-full h-screen bg-[#050505] flex items-center justify-center text-white p-6 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d0bcff]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-[#110e15] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Mac-style Window Header */}
          <div className="h-11 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
            <div className="ml-2 flex items-center gap-1.5 opacity-30">
              <Terminal size={12} />
              <span className="text-[10px] font-mono uppercase tracking-widest">system_error.log</span>
            </div>
          </div>

          <div className="p-8 sm:p-12 text-center">
            {/* Visual Icon */}
            <div className="relative inline-flex mb-8">
              <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center rotate-3">
                <AlertTriangle size={40} className="text-red-400 -rotate-3" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#d0bcff]/20 border border-[#d0bcff]/30 flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-[#d0bcff]">!</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              {isAccessDenied ? "Access Denied" : title}
            </h1>
            
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-10 max-w-sm mx-auto">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/playground" 
                className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(208,188,255,0.15)] active:scale-95"
              >
                Go to Playground
                <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              <Link 
                href="/" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                <Home size={16} />
                Home
              </Link>
            </div>
          </div>

          {/* Footer Details */}
          <div className="bg-black/20 border-t border-white/5 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] text-white/20 font-mono">STATUS_CODE: 404_NOT_FOUND</span>
            <span className="text-[10px] text-white/20 font-mono tracking-tighter">RUNIT_V2.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}