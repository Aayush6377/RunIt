"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EnhancedLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <motion.div
        className="flex items-center gap-4 group"
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {/* Terminal Icon Box */}
        <motion.div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-surface-variant/20 border border-white/10 backdrop-blur-md overflow-hidden transition-colors duration-500 group-hover:bg-surface-variant/40 group-hover:border-primary/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          {/* Radar Sweep Background Glow */}
          <motion.div
            className="absolute inset-[-50%] z-0 opacity-30"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 340deg, var(--color-primary) 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner ambient glow */}
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500 z-0 blur-xl" />

          {/* Sequential Terminal Dots */}
          <div className="absolute top-2 left-2.5 flex gap-[3px] z-20">
            {[
              { color: "bg-red-500", delay: 0 },
              { color: "bg-yellow-500", delay: 0.1 },
              { color: "bg-green-500", delay: 0.2 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${dot.color} opacity-40`}
                variants={{
                  hover: { opacity: 1, scale: 1.2 },
                }}
                transition={{ duration: 0.2, delay: dot.delay }}
              />
            ))}
          </div>

          {/* The Morphing Icon */}
          <div className="relative z-10 w-6 h-6 mt-1 ml-1 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* The Prompt Arrow '>' */}
              <motion.path
                d="M8 4L16 12L8 20"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  initial: { x: -2, fill: "rgba(208,188,255,0)" },
                  hover: { x: 2, fill: "rgba(208,188,255,0.2)" },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              {/* The Terminal Underscore '_' that snaps into a closing line */}
              <motion.path
                d="M8 20L16 20"
                stroke="var(--color-success)"
                strokeWidth="2.5"
                strokeLinecap="round"
                variants={{
                  initial: { x: 4, y: 0, opacity: 1, pathLength: 1 },
                  hover: { x: 0, y: -8, opacity: 0, pathLength: 0 },
                }}
                transition={{ duration: 0.3 }}
              />
              {/* The Closing line of the Play Button that appears */}
              <motion.path
                d="M8 4V20"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                variants={{
                  initial: { opacity: 0, pathLength: 0 },
                  hover: { opacity: 1, pathLength: 1 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
              />
            </svg>
          </div>
        </motion.div>

        <div className="flex items-center text-3xl font-heading font-bold tracking-tight">
          
          {/* The Execution Prefix (./) that slides out on hover */}
          <motion.span
            className="text-primary flex items-center overflow-hidden whitespace-nowrap"
            variants={{
              initial: { width: 0, opacity: 0 },
              // Explicitly telling Framer to return to 0 width smoothly when hover ends
              animate: { 
                width: 0, 
                opacity: 0,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              },
              hover: { 
                width: 26, 
                opacity: 1,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              },
            }}
          >
            <span className="text-success opacity-80 pr-1">./</span>
          </motion.span>

          <span className="text-on-background transition-colors duration-300 group-hover:text-white">
            Run
          </span>

          {/* "It" Typing Effect */}
          <span className="text-primary ml-1.5 flex items-center">
            {["I", "t"].map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  initial: { display: "none", opacity: 0 },
                  animate: {
                    display: "inline-block",
                    opacity: 1,
                    transition: { delay: 0.8 + i * 0.15 },
                  },
                  hover: { display: "inline-block", opacity: 1 },
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>

          <motion.span
            className="h-7 bg-primary ml-1 rounded-sm inline-block shadow-[0_0_8px_var(--color-primary)]"
            variants={{
              initial: { width: "3px", opacity: 0 },
              animate: {
                width: "3px",
                opacity: [1, 0, 1],
                transition: {
                  opacity: { duration: 0.8, repeat: Infinity },
                },
              },
              hover: {
                width: "12px",
                opacity: 1,
                backgroundColor: "var(--color-success)",
                boxShadow: "0 0 12px var(--color-success)",
                transition: { type: "spring", stiffness: 500, damping: 30 },
              },
            }}
          />
        </div>
      </motion.div>
    </Link>
  );
}