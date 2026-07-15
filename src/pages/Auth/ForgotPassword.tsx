import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast('Password reset link sent to your email', 'success');
  };

  return (
    <>
      <Helmet>
        <title>Reset Password — Xorvin</title>
      </Helmet>
      
      <div className="glass-card rounded-3xl p-8 sm:p-10 w-full border border-white/10 shadow-glow-sm">
        <Link to="/auth/login" className="text-white/40 hover:text-white flex items-center gap-2 text-sm font-medium mb-6 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
        
        <div className="mb-8">
          <h1 className="heading-sm text-white mb-2">Reset Password</h1>
          <p className="text-white/60 text-sm font-inter">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-dark pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2">
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center p-6 bg-xorvin-primary/10 rounded-xl border border-xorvin-primary/20">
            <h3 className="font-bold text-white mb-2">Check your email</h3>
            <p className="text-sm text-white/70">
              We've sent a password reset link to <br /><span className="font-semibold text-white">{email}</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
