"use client";
import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[200px] relative w-full">
      <div className="absolute w-32 h-32 bg-[#d0bcff]/10 blur-[40px] rounded-full animate-pulse pointer-events-none" />

      <div className="relative flex items-center font-mono text-2xl md:text-3xl font-bold z-10 select-none">
        <span className="text-white/40">&lt;</span>
        <span className="runit-loader-text bg-clip-text text-transparent bg-gradient-to-r from-[#d0bcff] via-[#a078ff] to-[#ae05c6]">
          LOADING
        </span>
        <span className="text-white/40">/&gt;</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .runit-loader-text {
          display: inline-flex;
          overflow: hidden;
          letter-spacing: -1em;
          animation: code-reveal 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite alternate;
        }

        @keyframes code-reveal {
          0%, 100% {
            opacity: 0.3;
            letter-spacing: -1em;
            filter: blur(4px);
          }
          50% {
            opacity: 1;
            letter-spacing: 0.1em;
            filter: blur(0px);
          }
        }
      `}} />
    </div>
  );
}