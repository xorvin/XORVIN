import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('xorvin-cookie-consent'));

  const accept = () => {
    localStorage.setItem('xorvin-cookie-consent', 'accepted');
    setVisible(false);
  };
  const decline = () => {
    localStorage.setItem('xorvin-cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[9998]"
        >
          <div className="glass-strong rounded-2xl p-5 border border-xorvin-primary/20 shadow-glow-sm">
            <div className="flex items-start gap-3">
              <Cookie className="w-5 h-5 text-xorvin-accent mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-1">We use cookies</p>
                <p className="text-xs text-white/60 mb-4">
                  We use cookies to enhance your experience, analyze traffic, and personalize content. See our{' '}
                  <a href="/privacy" className="text-xorvin-accent hover:underline">Privacy Policy</a>.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={accept} className="flex-1">Accept All</Button>
                  <Button size="sm" variant="secondary" onClick={decline}>Decline</Button>
                </div>
              </div>
              <button onClick={decline} className="text-white/40 hover:text-white transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
