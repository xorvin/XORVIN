import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/atoms/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const { loginWithGoogle, loginWithGitHub, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 8) {
      toast('Password must be at least 8 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: name }
        }
      });
      if (error) throw error;
      
      if (data.user && data.session === null) {
        toast('Registration successful! Please check your email.', 'success');
        // Do not redirect, instead show an alert or update state (handled below)
        setIsVerificationRequired(true);
      } else {
        toast('Account created successfully!', 'success');
        navigate('/');
      }
    } catch (error: any) {
      toast(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // If verification is required, show a success screen instead of the form
  if (isVerificationRequired) {
    return (
      <>
        <Helmet><title>Check Your Email — Xorvin</title></Helmet>
        <div className="glass-card rounded-3xl p-8 sm:p-10 w-full border border-white/10 text-center">
          <div className="w-16 h-16 bg-xorvin-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-xorvin-accent" />
          </div>
          <h2 className="heading-sm text-white mb-4">Check your email</h2>
          <p className="text-white/70 mb-8 font-inter">
            We've sent a verification link to <span className="text-white font-semibold">{email}</span>. 
            Please click the link to activate your account.
          </p>
          <Button variant="secondary" onClick={() => navigate('/auth/login')} className="w-full">
            Back to Login
          </Button>
        </div>
      </>
    );
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithGitHub();
      toast('Successfully joined!', 'success');
      navigate('/');
    } catch (error) {
      toast('OAuth registration failed', 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Join Xorvin — Global Tech Community</title>
      </Helmet>
      
      <div className="glass-card rounded-3xl p-8 sm:p-10 w-full border border-white/10 shadow-glow-sm">
        <div className="text-center mb-8">
          <h1 className="heading-sm text-white mb-2">Create Account</h1>
          <p className="text-white/60 text-sm font-inter">Join 47,000+ tech innovators worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-dark pl-10"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
          
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-dark pl-10"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={loading || isLoading}>
            Join Community
          </Button>
        </form>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <span className="relative px-4 text-xs bg-[#0b1626] text-white/40 uppercase tracking-wider">Or join with</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="secondary" onClick={() => handleOAuth('google')} className="!text-sm" disabled={isLoading}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Google
          </Button>
          <Button variant="secondary" onClick={() => handleOAuth('github')} className="!text-sm" disabled={isLoading}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-white/60">
          Already have an account? <Link to="/auth/login" className="text-xorvin-accent hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </>
  );
}
