"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react"; // Real Auth APIs
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import Logo from "@/components/ui/Logo";
import { 
  Menu, X, Code2, LayoutDashboard, 
  Sparkles, LogOut, LogIn, User 
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
        { name: "Playground", href: "/playground", icon: Code2 },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ]
    : [
        { name: "Playground", href: "/playground", icon: Code2 },
        { name: "Features", href: "/#features", icon: Sparkles },
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
                pathname === link.href ? "text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <link.icon size={16} className={pathname === link.href ? "text-primary" : "group-hover:text-primary transition-colors"} />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full border border-primary/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                )}
                <span className="text-sm font-medium text-white mr-1">
                  {user.name?.split(" ")[0]}
                </span>
              </div>
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
                className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-primary text-[#23005c] px-5 py-2.5 rounded-lg hover:bg-[#b59cfc] transition-all duration-300 font-bold text-sm shadow-[0_0_15px_rgba(208,188,255,0.2)] hover:shadow-[0_0_25px_rgba(208,188,255,0.4)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors z-50"
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
            className="md:hidden border-b border-white/10 bg-[#0f0d15]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-white font-medium"
                >
                  <link.icon size={20} className="text-primary" />
                  {link.name}
                </Link>
              ))}

              <div className="h-px w-full bg-white/10 my-2" />

              {isAuthenticated && user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full bg-primary/10" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <User size={14} className="text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.name}</span>
                      <span className="text-xs text-on-surface-variant">{user.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-red-400/10 text-red-400 font-medium"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-white/5 text-white font-medium"
                  >
                    <User size={18} /> Sign In
                  </Link>
                  <Link 
                    href="/register"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-primary text-[#23005c] font-bold"
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