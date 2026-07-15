import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error:   <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
  info:    <Info className="w-5 h-5 text-xorvin-accent" />,
};

const borderColors = {
  success: 'border-green-500/30',
  error:   'border-red-500/30',
  warning: 'border-yellow-500/30',
  info:    'border-xorvin-accent/30',
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none" role="alert" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto flex items-center gap-3 glass-strong rounded-xl px-4 py-3 border ${borderColors[t.type]} shadow-glass min-w-[280px] max-w-sm`}
          >
            {icons[t.type]}
            <p className="text-sm text-white/90 flex-1 font-inter">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-white/40 hover:text-white transition-colors ml-2" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
