import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrollY } from '@/hooks/useScrollProgress';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 50 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #007BFF, #30D5FF)',
        boxShadow: '0 0 10px #007BFF',
      }}
      aria-hidden
    />
  );
}

export function BackToTop() {
  const scrollY = useScrollY();
  const visible = scrollY > 400;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.button
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 w-11 h-11 glass-strong rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:border-xorvin-primary/40 hover:shadow-glow-sm transition-all duration-300 z-50"
      aria-label="Back to top"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
}
