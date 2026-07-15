import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Xorvin</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-xorvin-dark relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-xorvin-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <div className="text-[120px] font-bold font-space-grotesk gradient-text leading-none mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold font-space-grotesk text-white mb-4">
            Lost in Cyberspace
          </h1>
          <p className="text-white/60 font-inter mb-10 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" leftIcon={<Home className="w-5 h-5" />}>
                Back to Home
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="secondary" leftIcon={<Search className="w-5 h-5" />}>
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
