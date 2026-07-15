import React from 'react';
import { Helmet } from 'react-helmet-async';

import { motion } from 'framer-motion';

export default function PartnersPage() {
  const partners: any[] = [];
  return (
    <>
      <Helmet>
        <title>Our Partners — Xorvin</title>
      </Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin text-center">
          <span className="badge-primary mb-4 inline-block">🤝 Partnerships</span>
          <h1 className="heading-lg text-white mb-4">Our <span className="gradient-text">Partners</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg mb-12">
            We collaborate with industry leaders to provide the best resources, tools, and opportunities for our community.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, i) => (
              <motion.a 
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-8 rounded-2xl flex items-center justify-center hover:border-xorvin-primary/40 transition-colors group h-32"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-12 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity" 
                />
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
