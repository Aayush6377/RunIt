import Link from "next/link";
import { Globe } from "lucide-react";
import Logo from "@/components/ui/Logo";

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
  return (
    <footer className="w-full bg-[#0f0d15] border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Status */}
        <div className="flex flex-col gap-4">
          <Logo className="scale-90 origin-left" />
          <p className="text-on-surface-variant leading-relaxed max-w-xs text-sm mt-2">
            Zero friction coding for the modern web. Write, execute, and share snippets instantly.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-xs font-code text-on-surface-variant">System Status: Operational</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-on-background mb-2">Product</h4>
          <Link href="/playground" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Playground</Link>
          <Link href="/dashboard" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
          <Link href="/#features" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Features</Link>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-on-background mb-2">Built With</h4>
          <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Next.js 15</a>
          <a href="https://monaco-editor.vercel.app/" target="_blank" rel="noreferrer" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Monaco Editor</a>
          <a href="https://github.com/engineer-man/piston" target="_blank" rel="noreferrer" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Piston Execution API</a>
        </div>

        {/* Connect & Creator */}
        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-on-background mb-2">Connect</h4>
          <div className="flex gap-3 mt-1">
            <a 
              href="https://github.com/Aayush6377" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-surface-variant/50 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" 
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/aayush-kukreja-b5885324a" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-surface-variant/50 text-on-surface-variant hover:text-[#0a66c2] hover:bg-[#0a66c2]/10 transition-colors" 
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a 
              href="https://aayush-kukreja-portfolio.vercel.app/" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-surface-variant/50 text-on-surface-variant hover:text-success hover:bg-success/10 transition-colors" 
              aria-label="Portfolio"
            >
              <Globe size={20} />
            </a>
          </div>
          <p className="text-xs text-on-surface-variant mt-4 max-w-[200px] leading-relaxed">
            Designed & built by Aayush Kukreja
          </p>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant/60">
        <span>© {new Date().getFullYear()} RunIt. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}