"use client";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [particles, setParticles] = useState<{ id: number; x: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newParticles = [...Array(6)].map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}vw`,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#15121b]">
      
      {/* 1. The Deep Ambient Texture */}
      <img 
        alt="ambient digital void" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrxEkJbXd__r-lciycbwP5k-iFGWFfk88XCXzc6WHvNTphVSq_RVdaWMy27JKqnNzZ4HysRdAJDZdH9Ua-hQZojXlXehIFLATwAnYthYem3LqWW3REGk0f1HRnxCaB8OLikDUE0aI1UZw7qhWC5xjDB7QyI2hWjdZHTE-tzKxRUHfZ1VPOvxtDe5YBu9kvn5gTW9tnQn6HdBZR4WhhZM6NZNwkv2ssKuW8XodEywuUkJ8dcJYcpskkiIbWiAEq9ePj6uPwPqOiAUbQ"
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen pointer-events-none blur-[100px]"
      />

      {/* 2. Subtle Tech Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
        }}
      />

      {/* Floating Particles (Safe from Hydration Error) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-[#d0bcff] rounded-full opacity-20"
            initial={{ y: "100vh", x: particle.x }}
            animate={{ 
              y: "-10vh",
              opacity: [0, 0.3, 0] 
            }}
            transition={{ 
              duration: particle.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: particle.delay 
            }}
          />
        ))}
      </div>

      {/* Refined Animated Glowing Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.12, 0.18, 0.12],
            x: [0, 20, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] left-[10%] w-[60vw] h-[60vw] bg-[#d0bcff]/20 rounded-full blur-[140px]"
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.1, 0.2, 0.1],
            x: [0, -30, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[15%] right-[5%] w-[50vw] h-[50vw] bg-[#ae05c6]/15 rounded-full blur-[120px]"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 scale-125"
        >
          <Logo />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}