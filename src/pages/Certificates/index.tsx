import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Link } from 'react-router-dom';

export default function CertificatesPage() {
  return (
    <>
      <Helmet>
        <title>Certificates — Xorvin</title>
      </Helmet>
      
      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-4xl text-center">
          <span className="badge-primary mb-4 inline-block">🏅 Achievements</span>
          <h1 className="heading-lg text-white mb-4">Your <span className="gradient-text">Certificates</span></h1>
          <p className="text-white/60 text-lg mb-12">View, download, and verify your official Xorvin event certificates.</p>

          <div className="glass-card p-12 rounded-3xl mb-8">
            <Award className="w-16 h-16 text-xorvin-primary/20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to view certificates</h2>
            <p className="text-white/50 mb-6">You need to be logged in to access your personal certificates.</p>
            <Link to="/auth/login"><Button>Sign In</Button></Link>
          </div>

          <div className="glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left border-xorvin-primary/20">
            <div>
              <h3 className="font-bold text-white mb-1 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-xorvin-accent" /> Verify a Certificate</h3>
              <p className="text-sm text-white/60">Employers can verify the authenticity of any Xorvin certificate using its unique ID.</p>
            </div>
            <Link to="/certificates/verify">
              <Button variant="secondary" leftIcon={<Search className="w-4 h-4" />}>Verify Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
