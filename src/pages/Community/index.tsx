import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Globe, Zap, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Link } from 'react-router-dom';

const COMMUNITY_FEATURES = [
  { icon: <MessageSquare />, title: 'Global Discord', desc: 'Join 40k+ members in our active Discord server to discuss tech, find team members, and get help.' },
  { icon: <Globe />, title: 'Local Chapters', desc: 'Connect with developers in your city through Xorvin local chapters and meetups.' },
  { icon: <Zap />, title: 'Open Source', desc: 'Contribute to community-driven open source projects and build your portfolio.' },
  { icon: <Heart />, title: 'Mentorship', desc: 'Get paired with industry veterans to guide your career and technical growth.' },
];

export default function CommunityPage() {
  return (
    <>
      <Helmet>
        <title>Community Hub — Xorvin</title>
      </Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-30 pointer-events-none" />
        <div className="container-xorvin relative z-10 text-center">
          <span className="badge-primary mb-4 inline-block">🤝 Community Hub</span>
          <h1 className="heading-lg text-white mb-4">You Belong <span className="gradient-text">Here</span></h1>
          <p className="text-white/60 max-w-2xl mx-auto font-inter text-lg mb-8">
            Connect, collaborate, and grow with a global network of ambitious technologists.
          </p>
          <a href="https://discord.gg/ac4tZhjDW" target="_blank" rel="noreferrer">
            <Button size="lg" leftIcon={<MessageSquare className="w-5 h-5" />}>Join the Discord</Button>
          </a>
        </div>
      </section>

      <section className="py-20 bg-xorvin-dark">
        <div className="container-xorvin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMMUNITY_FEATURES.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl group hover:border-xorvin-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent mb-4 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">{feat.title}</h3>
                <p className="text-white/60 font-inter">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
