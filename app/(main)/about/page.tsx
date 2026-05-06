"use client";
import { GithubIcon } from "@/components/ui/Icons";
import { GITHUB_LINK, LINKEDIN_LINK, PORTFOLIO_LINK } from "@/lib/constants";
import { motion, Variants } from "framer-motion";
import { Globe, Code2, Terminal, Cpu, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const LinkedinIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100 } 
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-6 relative z-20 min-h-screen flex flex-col items-center justify-center">
      
      {/* Background Glows specific to this page */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d0bcff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20 text-[#d0bcff] text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Portfolio Project
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Behind <span className="text-[#d0bcff]">RunIt</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            RunIt is a high-performance, real-time code playground and collaboration platform built to demonstrate advanced full-stack capabilities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* The Creator Card */}
          <motion.div variants={itemVariants} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Terminal size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">The Developer</h2>
            <p className="text-[#d0bcff] font-medium mb-6 relative z-10">Aayush Kukreja • MERN Stack Developer</p>
            
            <p className="text-white/60 text-sm leading-relaxed mb-8 relative z-10">
              I built RunIt to challenge myself with complex architectural patterns, secure authentication flows, and building a flawless, glassmorphic user interface. I specialize in React, Next.js, Node.js, and TypeScript.
            </p>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
              <a 
                href={GITHUB_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl transition-all group/btn"
              >
                <GithubIcon size={24} className="text-white/50 group-hover/btn:text-white transition-colors" />
                <span className="text-xs font-bold text-white/50 group-hover/btn:text-white transition-colors">GitHub</span>
              </a>
              
              <a 
                href={LINKEDIN_LINK}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all group/btn"
              >
                <LinkedinIcon size={24} className="text-white/50 group-hover/btn:text-blue-400 transition-colors" />
                <span className="text-xs font-bold text-white/50 group-hover/btn:text-blue-400 transition-colors">LinkedIn</span>
              </a>

              <a 
                href={PORTFOLIO_LINK}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-[#d0bcff]/10 border border-white/5 hover:border-[#d0bcff]/30 rounded-2xl transition-all group/btn"
              >
                <Globe size={24} className="text-white/50 group-hover/btn:text-[#d0bcff] transition-colors" />
                <span className="text-xs font-bold text-white/50 group-hover/btn:text-[#d0bcff] transition-colors">Portfolio</span>
              </a>
            </div>
          </motion.div>

          {/* The Tech Stack Card */}
          <motion.div variants={itemVariants} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-3xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><Code2 size={20} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Frontend Architecture</h3>
                    <p className="text-xs text-white/40">Next.js 15, TypeScript, Tailwind CSS, Zustand, Framer Motion</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="p-2 bg-green-500/10 rounded-xl text-green-400"><Terminal size={20} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Backend Systems</h3>
                    <p className="text-xs text-white/40">Next.js API Routes, NextAuth.js, Cloudinary</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400"><Cpu size={20} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Database & ORM</h3>
                    <p className="text-xs text-white/40">PostgreSQL, Prisma ORM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <Link 
                href="/playground"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] rounded-xl font-bold transition-all shadow-lg active:scale-95"
              >
                Test the Playground <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}