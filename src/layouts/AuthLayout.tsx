import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ToastContainer } from '@/components/molecules/ToastContainer';
import { ROLE_DASHBOARD } from '@/constants/permissions';

export function AuthLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
        <div className="w-8 h-8 border-2 border-xorvin-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const dest = ROLE_DASHBOARD[user.role] ?? '/profile';
    return <Navigate to={dest} replace />;
  }

  return (
    <div className="min-h-screen flex bg-xorvin-dark relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-xorvin-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-xorvin-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Xorvin Logo" 
            className="h-8 w-auto object-contain" 
          />
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
}
