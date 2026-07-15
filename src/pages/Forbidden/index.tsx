import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_DASHBOARD, ROLE_LABELS } from '@/constants/permissions';
import { Button } from '@/components/atoms/Button';

export default function ForbiddenPage() {
  const { user } = useAuth();
  const dashboard = user?.role ? ROLE_DASHBOARD[user.role] : '/';
  const roleLabel = user?.role ? ROLE_LABELS[user.role] : 'Guest';

  return (
    <>
      <Helmet>
        <title>403 — Access Denied | Xorvin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-xorvin-dark flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-xorvin-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md w-full"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8"
          >
            <ShieldOff className="w-12 h-12 text-red-400" />
          </motion.div>

          {/* Error code */}
          <p className="text-7xl font-black text-white/5 mb-2 select-none" aria-hidden>403</p>

          <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-white/50 mb-2 leading-relaxed">
            You don't have permission to view this page.
          </p>
          {user && (
            <p className="text-sm text-white/30 mb-8">
              Your current role is{' '}
              <span className="text-xorvin-accent font-medium">{roleLabel}</span>.
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={dashboard}>
              <Button leftIcon={<Home className="w-4 h-4" />}>
                Go to My Dashboard
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
