import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, Trophy, Globe, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const PERKS = [
  { icon: <Trophy />, title: 'Exclusive Swag', desc: 'Get official Xorvin merch and limited edition items.' },
  { icon: <Target />, title: 'Leadership', desc: 'Lead tech initiatives on your campus and build your resume.' },
  { icon: <Globe />, title: 'Network', desc: 'Connect with other ambassadors and industry professionals.' },
  { icon: <GraduationCap />, title: 'Mentorship', desc: 'Receive direct mentorship from Xorvin core team members.' },
];

export default function CampusAmbassadorPage() {
  return (
    <>
      <Helmet>
        <title>Campus Ambassador Program — Xorvin</title>
      </Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin text-center relative z-10">
          <span className="badge-primary mb-4 inline-block">🎓 Campus Ambassador Program</span>
          <h1 className="heading-lg text-white mb-4">Lead Your <span className="gradient-text">Campus</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg mb-8">
            Become the face of Xorvin at your university. Build communities, host events, and accelerate your tech career.
          </p>
          <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>Apply Now</Button>
        </div>
      </section>

      <section className="py-20 bg-xorvin-dark border-t border-white/5">
        <div className="container-xorvin">
          <div className="text-center mb-12">
            <h2 className="heading-md text-white">Why Join the Program?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((perk, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent mx-auto mb-4 group-hover:bg-xorvin-primary/20 transition-colors">
                  {perk.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{perk.title}</h3>
                <p className="text-sm text-white/60">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
