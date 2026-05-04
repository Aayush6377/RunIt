"use client";
import { motion } from "framer-motion";
import { Terminal, Code2, Cpu, Database, Braces, Layers, GitBranch, Blocks } from "lucide-react";

export default function PlaygroundBackground() {
  const floatingIcons = [
    { Icon: Code2, top: "15%", left: "8%", delay: 0, duration: 6, size: 48 },
    { Icon: Terminal, top: "60%", left: "12%", delay: 2, duration: 8, size: 64 },
    { Icon: Braces, top: "25%", left: "85%", delay: 1, duration: 7, size: 56 },
    { Icon: GitBranch, top: "75%", left: "82%", delay: 3, duration: 9, size: 42 },
    { Icon: Database, top: "45%", left: "92%", delay: 1.5, duration: 6.5, size: 36 },
    { Icon: Cpu, top: "85%", left: "45%", delay: 4, duration: 7.5, size: 48 },
    { Icon: Layers, top: "10%", left: "55%", delay: 2.5, duration: 8, size: 40 },
    { Icon: Blocks, top: "40%", left: "4%", delay: 3.5, duration: 7, size: 32 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      
      {/* Floating Code Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-white/10"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon size={item.size} strokeWidth={1.5} />
        </motion.div>
      ))}
      
    </div>
  );
}