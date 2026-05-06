"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import Logo from "@/components/ui/Logo";
import { 
  Menu, X, Code2, LayoutDashboard, 
  Sparkles, LogOut, LogIn, User, 
  FolderCode, Mail, Info
} from "lucide-react";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { resetPlayground } = usePlaygroundStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  const handleSignOut = async () => {
    clearAuth();
    resetPlayground();
    await signOut({ callbackUrl: "/" });
  };

  const navLinks = isAuthenticated
    ? [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Playground", href: "/playground", icon: Code2 },
        { name: "Snippets", href: "/snippets", icon: FolderCode },
        { name: "Invitations", href: "/invitations", icon: Mail },
      ]
    : [
        { name: "Playground", href: "/playground", icon: Code2 },
        { name: "Features", href: "/#features", icon: Sparkles },
        { name: "About", href: "/about", icon: Info },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#0f0d15]/80 backdrop-blur-xl border-b border-white/10 shadow-lg" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        <Logo className="scale-90 md:scale-100" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors group ${
                pathname.startsWith(link.href) && link.href !== "/" ? "text-[#d0bcff]" : "text-on-surface-variant hover:text-[#d0bcff]"
              }`}
            >
              <link.icon size={16} className={pathname.startsWith(link.href) && link.href !== "/" ? "text-[#d0bcff]" : "group-hover:text-[#d0bcff] transition-colors"} />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* Clickable Profile Badge */}
              <Link 
                href="/profile"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors group"
              >
                <img 
                  src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-full border border-[#d0bcff]/20 bg-[#d0bcff]/10 group-hover:border-[#d0bcff]/50 transition-colors"
                />
                <span className="text-sm font-medium text-white mr-1 group-hover:text-[#d0bcff] transition-colors">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>

              <button 
                onClick={handleSignOut}
                className="p-2 text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-[#d0bcff] transition-colors"
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-[#d0bcff] text-[#23005c] px-5 py-2.5 rounded-lg hover:bg-[#b59cfc] transition-all duration-300 font-bold text-sm shadow-[0_0_15px_rgba(208,188,255,0.2)] hover:shadow-[0_0_25px_rgba(208,188,255,0.4)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-on-surface-variant hover:text-[#d0bcff] transition-colors z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#0f0d15]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                    pathname.startsWith(link.href) && link.href !== "/" 
                      ? "bg-[#d0bcff]/10 text-[#d0bcff]" 
                      : "hover:bg-white/5 text-white"
                  }`}
                >
                  <link.icon size={20} className={pathname.startsWith(link.href) && link.href !== "/" ? "text-[#d0bcff]" : "text-white/50"} />
                  {link.name}
                </Link>
              ))}

              <div className="h-px w-full bg-white/10 my-2" />

              {isAuthenticated && user ? (
                <div className="flex flex-col gap-4">
                  {/* Clickable Mobile Profile Badge */}
                  <Link 
                    href="/profile"
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors"
                  >
                    <img 
                      src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.name}</span>
                      <span className="text-xs text-on-surface-variant">View Profile</span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 font-medium transition-colors"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    <User size={18} /> Sign In
                  </Link>
                  <Link 
                    href="/register"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] font-bold transition-colors"
                  >
                    <Code2 size={18} /> Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}