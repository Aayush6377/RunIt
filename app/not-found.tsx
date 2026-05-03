"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Home,
} from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setMounted(true);
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#d0bcff]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ae05c6]/30 to-transparent" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Error Code with Glitch Effect */}
        <div className="mb-12 relative inline-block">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[120px] md:text-[200px] font-mono font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#d0bcff] via-[#a078ff] to-[#ae05c6] select-none"
          >
            404
          </motion.h1>
          
          <motion.div 
            animate={{ opacity: [0, 1, 0], x: [-2, 2, -2] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 text-[120px] md:text-[200px] font-mono font-bold leading-none tracking-tighter text-[#ae05c6]/30 blur-[2px] pointer-events-none select-none"
          >
            404
          </motion.div>
        </div>

        {/* System Status Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#15121b] border border-white/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#ae05c6] animate-ping" />
            <span className="font-mono text-[10px] text-[#fbabff] tracking-[0.2em] uppercase">
              System.Exception: Route_Not_Defined
            </span>
          </div>
        </div>

        {/* Technical Traceback Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#15121b]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-left shadow-2xl border-l-4 border-l-[#ae05c6] mb-10"
        >
          <div className="flex items-center gap-2 mb-4 opacity-40">
            <Terminal size={14} />
            <span className="font-mono text-xs uppercase tracking-widest">Runtime_Logs // Stdout</span>
          </div>

          <div className="space-y-2 font-mono text-sm md:text-base text-[#d0bcff]/90">
            <p className="flex gap-3">
              <span className="text-[#ae05c6] shrink-0 font-bold">&gt;</span>
              <span>RECURSION_LIMIT_EXCEEDED: Source tree traversal failed.</span>
            </p>
            <p className="flex gap-3 text-white/40 text-xs">
              <span className="shrink-0">at</span>
              <span>RunIt.Core.Navigation.ResolveRoute(path: window.location.href)</span>
            </p>
            <p className="flex gap-3 text-white/40 text-xs">
              <span className="shrink-0">at</span>
              <span>RunIt.Engine.Middleware.Panic(errorCode: 404)</span>
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-4 opacity-40 font-mono text-[10px] uppercase tracking-tighter">
            <div>Timestamp: {mounted ? timestamp : "INITIALIZING..."}</div>
            <div className="text-right">Node_Env: Production</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-[#d0bcff] text-[#23005c] font-bold rounded-xl transition-all hover:bg-[#b59cfc] active:scale-95 shadow-[0_0_20px_rgba(208,188,255,0.3)] flex items-center justify-center gap-2 group"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}