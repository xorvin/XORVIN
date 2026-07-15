import React, { Suspense } from 'react';
import { SEO } from '@/components/atoms/SEO';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUpModule from 'react-countup';
const CountUp = (CountUpModule as any).default || CountUpModule;
import { ArrowRight, Star, Globe, Trophy, Users, Calendar, BookOpen } from 'lucide-react';
import { HeroSection } from '@/components/organisms/HeroSection';
import { TechScroller } from '@/components/organisms/TechScroller';
import { EventCard } from '@/components/molecules/EventCard';
import { BlogCard } from '@/components/molecules/BlogCard';
import { Button } from '@/components/atoms/Button';
import { useEvents } from '@/hooks/useEvents';
import { useBlogs } from '@/hooks/useBlogs';
import { CORE_VALUES, HOME_STATS } from '@/constants/config';
import { staggerContainer, staggerItem, fadeInUp } from '@/animations/variants';
import { APP_CONFIG } from '@/constants/config';

// Section heading helper
function SectionHeading({ badge, title, subtitle }: { badge: string; title: React.ReactNode; subtitle?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <span className="badge-primary mb-4 inline-block">{badge}</span>
      <h2 className="heading-md text-white mb-3">{title}</h2>
      {subtitle && <p className="text-white/60 max-w-2xl mx-auto font-inter">{subtitle}</p>}
    </motion.div>
  );
}

// Animated stats section
function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const icons: Record<string, React.ReactNode> = {
    Users:     <Users className="w-6 h-6" />,
    Calendar:  <Calendar className="w-6 h-6" />,
    Trophy:    <Trophy className="w-6 h-6" />,
    BookOpen:  <BookOpen className="w-6 h-6" />,
    Globe:     <Globe className="w-6 h-6" />,
    Handshake: <Star className="w-6 h-6" />,
  };

  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-xorvin-dark to-xorvin-bg" aria-label="Community statistics">
      <div className="container-xorvin">
        <SectionHeading badge="📊 By the Numbers" title={<>Xorvin in <span className="gradient-text">Numbers</span></>} subtitle="A global movement of builders, hackers, and innovators." />
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {HOME_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="glass-card rounded-2xl p-6 text-center group hover:border-xorvin-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-xorvin-primary/10 flex items-center justify-center mx-auto mb-3 text-xorvin-accent group-hover:bg-xorvin-primary/20 transition-colors">
                {icons[stat.icon] ?? <Star className="w-6 h-6" />}
              </div>
              <div className="text-3xl font-bold font-space-grotesk gradient-text">
                {inView ? (
                  <CountUp end={stat.value} duration={2.5} separator="," />
                ) : 0}
                {stat.suffix}
              </div>
              <p className="text-xs text-white/50 mt-1 font-inter">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Values section
function ValuesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section ref={ref} className="section-padding" aria-label="Core values">
      <div className="container-xorvin">
        <SectionHeading badge="💡 Why Xorvin" title={<>Built on <span className="gradient-text">Strong Values</span></>} subtitle="Everything we do is guided by principles that put community first." />
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {CORE_VALUES.map(v => (
            <motion.div key={v.title} variants={staggerItem} className="xorvin-card group">
              <span className="text-3xl mb-4 block">{v.icon}</span>
              <h3 className="text-lg font-bold font-space-grotesk text-white mb-2 group-hover:text-xorvin-accent transition-colors">{v.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed font-inter">{v.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Featured events
function FeaturedEvents() {
  const { data: events = [] } = useEvents();
  const upcoming = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-xorvin-bg to-xorvin-dark" aria-label="Featured events">
      <div className="container-xorvin">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <span className="badge-primary mb-3 inline-block">🏆 Upcoming Events</span>
            <h2 className="heading-md text-white">Don't Miss What's <span className="gradient-text">Next</span></h2>
          </div>
          <Link to="/events">
            <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>View All Events</Button>
          </Link>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {upcoming.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials
function TestimonialsSection() {
  return (
    <section className="section-padding" aria-label="Testimonials">
      <div className="container-xorvin">
        <SectionHeading badge="💬 Community Love" title={<>What Our <span className="gradient-text">Members Say</span></>} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {false ? (
            [].map((t: any, i: number) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="xorvin-card flex flex-col"
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-5 flex-1 italic font-inter">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role} at {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-12 glass-card rounded-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-xorvin-primary/10 flex items-center justify-center mx-auto mb-4 text-xorvin-accent">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">Community Voices</h3>
              <p className="text-white/60 font-inter max-w-md mx-auto">
                Testimonials will appear here after our upcoming community events conclude. Join us and be the first to share your experience!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Partners
function PartnersSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-xorvin-dark to-xorvin-bg" aria-label="Partners">
      <div className="container-xorvin">
        <SectionHeading badge="🤝 Partners" title={<>Backed by <span className="gradient-text">Industry Leaders</span></>} subtitle="Working with the world's most innovative companies." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {false ? (
            [].map((p: any, i: number) => (
              <motion.a
                key={p.id}
                href={p.website}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 flex items-center justify-center hover:border-xorvin-primary/30 transition-all duration-300 group"
              >
                <img src={p.logo} alt={p.name} className="h-10 object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 md:col-span-4 text-center py-12 glass-card rounded-2xl border-dashed border-2 border-xorvin-primary/20 hover:border-xorvin-primary/50 transition-colors"
            >
              <h3 className="text-xl font-bold font-space-grotesk text-white mb-3">Become a Founding Partner</h3>
              <p className="text-white/60 font-inter max-w-lg mx-auto mb-6">
                We are actively seeking visionary organizations to collaborate with us. Support the next generation of innovators and build your brand presence globally.
              </p>
              <Link to="/contact">
                <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Contact to Collaborate</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Latest Blog
function BlogPreviewSection() {
  const { data: blogs = [] } = useBlogs();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  return (
    <section ref={ref} className="section-padding" aria-label="Latest articles">
      <div className="container-xorvin">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <span className="badge-primary mb-3 inline-block">📝 Latest Articles</span>
            <h2 className="heading-md text-white">From the <span className="gradient-text">Xorvin Blog</span></h2>
          </div>
          <Link to="/blog"><Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>All Articles</Button></Link>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogs.slice(0, 3).map(post => <BlogCard key={post.id} post={post} />)}
        </motion.div>
      </div>
    </section>
  );
}

// CTA Banner
function CTABanner() {
  return (
    <section className="section-padding" aria-label="Call to action">
      <div className="container-xorvin">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-card rounded-3xl p-12 text-center overflow-hidden"
        >
          {/* Glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-xorvin-primary/10 to-xorvin-accent/5 rounded-3xl" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-xorvin-primary/15 rounded-full blur-[100px]" />
          <div className="relative">
            <h2 className="heading-md text-white mb-4">Ready to <span className="gradient-text">Elevate</span> Your Journey?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto font-inter">
              Join thousands of innovators who are shaping the future of technology through Xorvin.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/auth/register"><Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>Join for Free</Button></Link>
              <Link to="/events"><Button size="lg" variant="secondary">Browse Events</Button></Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Xorvin — Innovate. Compete. Elevate." 
        description={APP_CONFIG.description}
      />

      <HeroSection />
      <TechScroller />
      <ValuesSection />
      <FeaturedEvents />
      <TestimonialsSection />
      <PartnersSection />
      <BlogPreviewSection />
      <CTABanner />
    </>
  );
}
