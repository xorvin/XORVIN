import React from 'react';
import { SEO } from '@/components/atoms/SEO';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Eye, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CORE_VALUES, ABOUT_TIMELINE } from '@/constants/config';

import { Button } from '@/components/atoms/Button';
import { staggerContainer, staggerItem } from '@/animations/variants';

function PageHero({ title, subtitle, badge }: { title: React.ReactNode; subtitle: string; badge: string }) {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-xorvin-dark to-xorvin-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-xorvin-primary/8 rounded-full blur-[120px]" />
      <div className="container-xorvin relative text-center">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="badge-primary mb-4 inline-block">{badge}</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heading-lg text-white mb-4">{title}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/60 max-w-2xl mx-auto font-inter text-lg">{subtitle}</motion.p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const speakers: any[] = [];

  return (
    <>
      <SEO 
        title="About Xorvin" 
        description="Learn about Xorvin — the world's premier global technology community. Our mission, vision, values, and story."
      />

      <PageHero badge="🌍 About Xorvin" title={<>Our <span className="gradient-text">Story</span> & Mission</>} subtitle="We believe the best technology emerges when brilliant minds collaborate, compete, and support each other without borders." />

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-xorvin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {[
              { icon: <Target className="w-7 h-7 text-xorvin-primary" />, label: 'Our Mission', text: 'Empowering innovators through technology, collaboration, and competition. We create spaces where people at all levels can grow, connect, and build a better digital world.' },
              { icon: <Eye className="w-7 h-7 text-xorvin-accent" />, label: 'Our Vision', text: "To build the world's most trusted technology community — a place where every aspiring technologist finds the resources, mentorship, and opportunities they need to thrive." },
            ].map(item => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8">
                <div className="w-14 h-14 rounded-2xl bg-xorvin-primary/10 flex items-center justify-center mb-5">{item.icon}</div>
                <h2 className="text-2xl font-bold font-space-grotesk text-white mb-3">{item.label}</h2>
                <p className="text-white/60 leading-relaxed font-inter">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="badge-primary mb-3 inline-block">💡 Values</span>
              <h2 className="heading-md text-white">What We <span className="gradient-text">Stand For</span></h2>
            </div>
            <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CORE_VALUES.map(v => (
                <motion.div key={v.title} variants={staggerItem} className="xorvin-card group">
                  <span className="text-3xl mb-3 block">{v.icon}</span>
                  <h3 className="text-lg font-bold font-space-grotesk text-white mb-2 group-hover:text-xorvin-accent transition-colors">{v.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed font-inter">{v.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="mb-20">
            <div className="text-center mb-10">
              <span className="badge-primary mb-3 inline-block">📅 History</span>
              <h2 className="heading-md text-white">Our <span className="gradient-text">Journey</span></h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-xorvin-primary via-xorvin-accent to-transparent" />
              {ABOUT_TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} pl-12 md:pl-0`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass-card rounded-xl p-5">
                      <span className="badge-accent mb-2 inline-block">{item.year}</span>
                      <h3 className="text-lg font-bold font-space-grotesk text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/60 font-inter">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-xorvin-primary to-xorvin-accent flex items-center justify-center text-xs font-bold text-white shadow-glow-sm flex-shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <div className="text-center mb-10">
              <span className="badge-primary mb-3 inline-block">👥 Team</span>
              <h2 className="heading-md text-white">Meet Our <span className="gradient-text">Speakers & Mentors</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {speakers.map((speaker, i) => (
                <motion.div key={speaker.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6 text-center group hover:border-xorvin-primary/30 transition-all duration-300">
                  <img src={speaker.avatar} alt={speaker.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-xorvin-primary/20 group-hover:border-xorvin-accent/40 transition-colors" />
                  <h3 className="font-bold font-space-grotesk text-white mb-0.5">{speaker.name}</h3>
                  <p className="text-xs text-xorvin-accent mb-1">{speaker.title}</p>
                  <p className="text-xs text-white/40">{speaker.company}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
            <h2 className="heading-sm text-white mb-4">Want to Be Part of the Story?</h2>
            <p className="text-white/60 mb-6 font-inter">Join 47,000+ members writing the next chapter of tech history.</p>
            <Link to="/auth/register"><Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>Join Xorvin Today</Button></Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
