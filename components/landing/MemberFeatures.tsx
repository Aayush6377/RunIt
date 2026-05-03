"use client";
import { motion } from "framer-motion";
import { History, LayoutDashboard, Lock, Network, Search, GitCommit, GitMerge } from "lucide-react";

export default function MemberFeatures() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="w-full py-20 flex flex-col gap-10">
      <div>
        <h2 className="font-heading text-4xl font-bold text-on-background">Member Features</h2>
        <p className="text-lg text-on-surface-variant mt-2">Unlock the full potential with a free account.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Time Travel (Spans 2 columns) */}
        <motion.div variants={item} className="md:col-span-2 glass rounded-xl p-8 flex flex-col gap-6 card-pattern">
          <div className="flex items-center gap-4">
            <History size={32} className="text-primary" />
            <h3 className="font-heading text-2xl font-semibold">Time Travel History</h3>
          </div>
          <p className="text-on-surface-variant max-w-xl">Never lose a working state. Scrub through an automatic timeline of your code's evolution.</p>
          
          {/* Timeline UI Mockup */}
          <div className="w-full bg-[#211e27] rounded-lg p-6 border border-white/5 mt-auto">
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full h-1.5 bg-surface-variant rounded-full relative mt-8">
                <div className="absolute left-0 w-[60%] h-full bg-primary rounded-full"></div>
                <div className="absolute left-[60%] w-4 h-4 bg-primary rounded-full top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(208,188,255,0.4)] border-2 border-white cursor-pointer"></div>
              </div>
              <div className="flex justify-between text-[10px] font-code text-on-surface-variant/60 uppercase tracking-wider mt-2">
                <span>v0.4.2 - 10:42</span>
                <span className="text-primary font-bold">v0.5.1 - ACTIVE</span>
                <span>HEAD</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cloud Dashboard */}
        <motion.div variants={item} className="glass rounded-xl p-8 flex flex-col gap-4 card-pattern">
          <LayoutDashboard size={32} className="text-tertiary mb-2" />
          <h3 className="font-heading text-2xl font-semibold">Cloud Dashboard</h3>
          <p className="text-on-surface-variant">Manage your snippets with advanced search, tags, and sorting.</p>
          <div className="mt-auto bg-[#211e27] p-3 rounded-lg border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Search size={16} /> Find snippet...
            </div>
          </div>
        </motion.div>

        {/* Privacy Controls */}
        <motion.div variants={item} className="glass rounded-xl p-8 flex flex-col gap-4 card-pattern">
          <Lock size={32} className="text-error mb-2" />
          <h3 className="font-heading text-2xl font-semibold">Granular Privacy</h3>
          <p className="text-on-surface-variant">Control exactly who sees your code.</p>
          <div className="flex flex-col gap-2 mt-auto">
            <span className="px-3 py-1.5 bg-success/10 text-success rounded-md text-sm font-medium border border-success/20 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success"></span> Public</span>
            <span className="px-3 py-1.5 bg-surface-variant text-on-background rounded-md text-sm font-medium border border-white/10 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-on-surface-variant"></span> Unlisted</span>
            <span className="px-3 py-1.5 bg-error/10 text-error rounded-md text-sm font-medium border border-error/20 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-error"></span> Private</span>
          </div>
        </motion.div>

        {/* Ecosystem (Spans 2 columns) */}
        <motion.div variants={item} className="md:col-span-2 glass rounded-xl p-8 flex flex-col gap-4 card-pattern">
          <div className="flex items-center gap-4 mb-2">
            <Network size={32} className="text-primary" />
            <h3 className="font-heading text-2xl font-semibold">Connected Ecosystem</h3>
          </div>
          <p className="text-on-surface-variant max-w-xl">Push directly to GitHub Gists, embed in Notion, and share links that generate rich, syntax-highlighted Open Graph previews.</p>
          <div className="mt-auto pt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-[#211e27] flex items-center justify-center"><GitCommit size={14} className="text-on-surface-variant" /></div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center"><GitMerge size={14} className="text-primary" /></div>
            </div>
            <div className="flex-grow h-px bg-white/5 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-success"></div>
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-primary/40 to-success w-full -translate-x-1/2"></div>
            </div>
            <div className="font-code text-[10px] text-on-surface-variant/40 bg-[#211e27] px-2 py-1 rounded border border-white/5">#f2a9d1</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}