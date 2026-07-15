import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { ToastContainer } from '@/components/molecules/ToastContainer';
import { CookieBanner } from '@/components/molecules/CookieBanner';
import { ScrollProgress, BackToTop } from '@/components/molecules/ScrollProgress';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <CookieBanner />
      <BackToTop />
    </div>
  );
}
