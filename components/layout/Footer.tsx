"use client";
import Link from "next/link";
import { Globe } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { GITHUB_LINK, LINKEDIN_LINK, PORTFOLIO_LINK } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Footer() {
  const { isAuthenticated } = useAuthStore();

  const navLinks = isAuthenticated
    ? [
        { name: "Playground", href: "/playground" },
        { name: "Snippets", href: "/snippets" },
        { name: "About", href: "/about" },
      ]
    : [
        { name: "Playground", href: "/playground" },
        { name: "Features", href: "/#features" },
        { name: "About", href: "/about" },
      ];

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 mt-auto relative z-20">
      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-center sm:text-left">
        
        {/* Brand & Status */}
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <Logo className="scale-90 origin-center sm:origin-left" />
          <p className="text-white/50 leading-relaxed max-w-[250px] text-sm mt-2">
            Zero friction coding for the modern web. Write, execute, and share snippets instantly.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">System Status: Operational</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-2 tracking-wide text-sm uppercase">Product</h4>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm text-white/50 hover:text-[#d0bcff] transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-2 tracking-wide text-sm uppercase">Built With</h4>
          <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="text-sm text-white/50 hover:text-[#d0bcff] transition-colors">Next.js 15</a>
          <a href="https://monaco-editor.vercel.app/" target="_blank" rel="noreferrer" className="text-sm text-white/50 hover:text-[#d0bcff] transition-colors">Monaco Editor</a>
          <a href="https://glot.io/" target="_blank" rel="noreferrer" className="text-sm text-white/50 hover:text-[#d0bcff] transition-colors">Glot API</a>
        </div>

        {/* Connect & Creator */}
        <div className="flex flex-col gap-3 items-center sm:items-start">
          <h4 className="font-bold text-white mb-2 tracking-wide text-sm uppercase">Connect</h4>
          <div className="flex gap-3 mt-1">
            <a 
              href={GITHUB_LINK} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all active:scale-95" 
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a 
              href={LINKEDIN_LINK}
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-xl bg-white/5 text-white/50 hover:text-[#0a66c2] hover:bg-[#0a66c2]/10 border border-white/5 hover:border-[#0a66c2]/20 transition-all active:scale-95" 
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a 
              href={PORTFOLIO_LINK} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-xl bg-white/5 text-white/50 hover:text-[#d0bcff] hover:bg-[#d0bcff]/10 border border-white/5 hover:border-[#d0bcff]/20 transition-all active:scale-95" 
              aria-label="Portfolio"
            >
              <Globe size={18} />
            </a>
          </div>
          <p className="text-xs text-white/40 mt-4 leading-relaxed">
            Designed & built by <span className="text-[#d0bcff] font-medium">Aayush Kukreja</span>
          </p>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-white/40">
        <span>© {new Date().getFullYear()} RunIt. All rights reserved.</span>
      </div>
    </footer>
  );
}