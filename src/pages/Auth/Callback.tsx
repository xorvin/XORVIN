import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

export default function CallbackPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (user.role === 'admin' || user.role === 'moderator') navigate('/admin/dashboard', { replace: true });
        else navigate('/profile', { replace: true });
      } else {
        navigate('/auth/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <>
      <Helmet><title>Authenticating... — Xorvin</title></Helmet>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 border-2 border-xorvin-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/60 text-sm">Completing sign in...</p>
      </div>
    </>
  );
}
