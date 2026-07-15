import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export default function AdminContactMessagesPage() {
  return (
    <>
      <Helmet><title>Contact Messages — Xorvin Admin</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk text-white">Inbox</h1>
            <p className="text-white/50 mt-1">Manage community contact messages.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden p-8 text-center">
          <Mail className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Inbox Empty</h3>
          <p className="text-white/50">
            You have no new messages from the contact form.
          </p>
        </div>
      </div>
    </>
  );
}
