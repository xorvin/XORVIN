import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  destructive = false
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-xorvin-dark border border-white/10 p-6 rounded-2xl shadow-2xl z-[101] outline-none">
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-full ${destructive ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <Dialog.Title className="text-xl font-bold font-space-grotesk text-white mb-2">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-white/60 text-sm leading-relaxed">
                {description}
              </Dialog.Description>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <Dialog.Close asChild>
              <button 
                type="button"
                className="px-4 py-2 rounded-lg font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                disabled={isLoading}
              >
                {cancelText}
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={() => {
                onConfirm();
              }}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                destructive 
                  ? 'bg-red-500 hover:bg-red-600 disabled:bg-red-500/50' 
                  : 'bg-xorvin-accent hover:brightness-110 disabled:opacity-50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : confirmText}
            </button>
          </div>
          
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
