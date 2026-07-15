import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/atoms/Button';
import { motion } from 'framer-motion';

export default function ProgramsPage() {
  return (
    <>
      <Helmet>
        <title>Special Programs — Xorvin</title>
      </Helmet>
      <section className="pt-32 pb-20 bg-xorvin-dark relative min-h-screen">
        <div className="container-xorvin text-center">
          <span className="badge-primary mb-4 inline-block">🚀 Accelerator</span>
          <h1 className="heading-lg text-white mb-4">Incubation & <span className="gradient-text">Programs</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg mb-12">
            Long-term initiatives designed to take your skills and startups to the next level.
          </p>
          <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto">
            <h2 className="heading-sm text-white mb-4">Xorvin Startup Incubator</h2>
            <p className="text-white/60 mb-8 font-inter">
              A 12-week intensive program for early-stage tech startups. Receive mentorship, $50k in credits, and a chance to pitch to global investors.
            </p>
            <Button size="lg">Applications Open Soon</Button>
          </div>
        </div>
      </section>
    </>
  );
}
