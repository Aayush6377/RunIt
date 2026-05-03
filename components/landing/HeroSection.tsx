"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code2 } from "lucide-react";
import Link from "next/link";
import { codeSnippets } from "@/lib/contants";

export default function HeroSection() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [phase, setPhase] = useState<"typing" | "running" | "done">("typing");

  // The Typewriter Effect Logic
  useEffect(() => {
    const currentSnippet = codeSnippets[snippetIndex];
    let timeout: NodeJS.Timeout;

    if (phase === "typing") {
      // Type next character
      if (displayedCode.length < currentSnippet.code.length) {
        timeout = setTimeout(() => {
          setDisplayedCode(currentSnippet.code.slice(0, displayedCode.length + 1));
        }, 30); // Typing speed
      } else {
        timeout = setTimeout(() => setPhase("running"), 600);
      }
    } else if (phase === "running") {
      timeout = setTimeout(() => setPhase("done"), 2000);
    } else if (phase === "done") {
      setDisplayedCode("");
      setPhase("typing");
      setSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedCode, phase, snippetIndex]);

  const currentSnippet = codeSnippets[snippetIndex];

  return (
    <section className="w-full py-20 md:py-32 flex flex-col lg:flex-row items-center gap-12">
      {/* Copy & CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-start gap-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-2">
          <Code2 size={16} /> Support for 40+ Languages
        </div>
        
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-on-background leading-tight">
          Write, Run, and Share <br /> <span className="text-primary">Instantly.</span>
        </h1>
        
        <p className="text-lg text-on-surface-variant max-w-xl">
          RunIt is an ultra-fast, multi-language coding playground. Test algorithms, share snippets, and execute code directly in your browser with zero friction.
        </p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <Link 
            href="/playground"
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg hover:bg-primary-fixed transition-all duration-300 shadow-[0_0_20px_rgba(208,188,255,0.3)] hover:shadow-[0_0_30px_rgba(208,188,255,0.5)] font-bold text-lg hover:-translate-y-1"
          >
            Start Coding Free
          </Link>
        </div>
      </motion.div>

      {/* Animated Editor */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 w-full relative max-w-xl mx-auto lg:mx-0"
      >
        <div className="glass rounded-xl p-4 shadow-2xl relative group card-pattern overflow-hidden h-[340px] flex flex-col">
          
          {/* Editor Header */}
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
              <div className="text-xs font-code text-on-surface-variant/70 flex gap-2">
                <span className="bg-surface-variant px-2 py-1 rounded text-primary">{currentSnippet.file}</span>
              </div>
            </div>
            
            <button 
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-all duration-300 ${
                phase === "running" || phase === "done" 
                  ? "bg-success/20 text-success shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-105" 
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Play size={16} fill="currentColor" /> {phase === "typing" ? "Run Code" : "Running..."}
            </button>
          </div>
          
          {/* Code Area */}
          <div className="flex-grow overflow-hidden relative">
            <pre className="font-code text-sm text-on-background p-2 leading-relaxed">
              {displayedCode}
              <span className="inline-block w-2 h-4 bg-primary align-middle ml-1 animate-blink"></span>
            </pre>
          </div>

          {/* Terminal Output */}
          <div className="mt-auto pt-3 border-t border-white/10 bg-[#0f0d15] -mx-4 -mb-4 p-4 font-code text-xs h-[80px] shrink-0">
            <AnimatePresence mode="wait">
              {phase === "running" || phase === "done" ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-1"
                >
                  <span className="text-on-surface-variant/50">{currentSnippet.command}</span>
                  <span className="text-success font-medium">{currentSnippet.output}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-on-surface-variant/40 flex items-center gap-2"
                >
                  <span className="animate-pulse">&gt; Waiting for execution...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </section>
  );
}