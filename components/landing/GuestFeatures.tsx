"use client";
import { motion } from "framer-motion";
import { Code2, Sparkles, ImageDown, Link as LinkIcon } from "lucide-react";

export default function GuestFeatures() {
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
    <section id="features" className="w-full py-20 flex flex-col gap-10">
      <div>
        <h2 className="font-heading text-4xl font-bold text-on-background">The Playground</h2>
        <p className="text-lg text-on-surface-variant mt-2">Powerful tools available instantly, no sign-in required.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={item} className="glass rounded-xl p-8 flex flex-col gap-4 card-pattern">
          <Code2 size={40} className="text-primary mb-2" />
          <h3 className="font-heading text-2xl font-semibold">Multi-Language Editor</h3>
          <p className="text-on-surface-variant">Switch seamlessly between JS, Python, Rust, C++, and Java. Batteries included.</p>
        </motion.div>

        <motion.div variants={item} className="glass rounded-xl p-8 flex flex-col gap-4 card-pattern relative overflow-hidden">
          <Sparkles size={40} className="text-tertiary mb-2" />
          <h3 className="font-heading text-2xl font-semibold">AI Code Assistant</h3>
          <p className="text-on-surface-variant">Highlight any block of code to instantly get explanations, refactoring, or bug fixes.</p>
        </motion.div>

        <motion.div variants={item} className="glass rounded-xl p-8 flex flex-col gap-4 card-pattern">
          <ImageDown size={40} className="text-secondary mb-2" />
          <h3 className="font-heading text-2xl font-semibold">Beautiful Exports</h3>
          <p className="text-on-surface-variant">Export stunning, Carbon-style images of your code for presentations or social media.</p>
        </motion.div>

        <motion.div variants={item} className="glass rounded-xl p-8 flex flex-col gap-4 card-pattern">
          <LinkIcon size={40} className="text-success mb-2" />
          <h3 className="font-heading text-2xl font-semibold">Frictionless Sharing</h3>
          <p className="text-on-surface-variant">Generate unlisted links instantly. Perfect for quick collaboration or asking questions.</p>
        </motion.div>
      </motion.div>
    </section>
  );
}