import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { staggerContainer, staggerItem } from '@/animations/variants';

// Animated particle canvas
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 123, 255, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(48, 213, 255, ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" className="absolute inset-0 w-full h-full" />;
}

// Floating geometric shapes
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-32 top-1/4 w-96 h-96 rounded-full border border-xorvin-primary/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-20 top-1/4 w-64 h-64 rounded-full border border-xorvin-accent/10"
      />
      {/* Floating cubes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          className="absolute w-8 h-8 border border-xorvin-primary/20 rounded-lg"
          style={{
            left: `${10 + i * 18}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: 'rgba(0, 123, 255, 0.03)',
          }}
        />
      ))}
      {/* Gradient blobs */}
      <div className="absolute -left-40 top-1/3 w-96 h-96 bg-xorvin-primary/8 rounded-full blur-[100px]" />
      <div className="absolute -right-40 bottom-1/3 w-80 h-80 bg-xorvin-accent/6 rounded-full blur-[80px]" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007BFF' stroke-width='0.5'/%3E%3C/svg%3E\")", backgroundSize: '60px 60px' }}
      />
    </div>
  );
}

const STATS = [
  { value: '2026',  label: 'Founded'       },
  { value: '1',     label: 'Live Event'    },
  { value: '100%',  label: 'Free to Join' },
  { value: '🌍',    label: 'Global'       },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-xorvin-dark"
      aria-label="Hero section"
    >
      <ParticleCanvas />
      <FloatingShapes />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient" style={{ background: 'radial-gradient(ellipse at center, rgba(0,123,255,0.08) 0%, transparent 70%)' }} />

      <div className="container-xorvin relative z-10 pt-24 pb-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={staggerItem} className="mb-6">
            <span className="badge-primary">
              <Zap className="w-3 h-3" /> World's Premier Tech Community
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={staggerItem} className="heading-xl mb-4 font-space-grotesk">
            <span className="gradient-text glow-text">XORVIN</span>
          </motion.h1>

          <motion.p variants={staggerItem} className="text-xl md:text-2xl text-white/70 font-inter mb-3">
            Global Technology Community
          </motion.p>

          {/* Tagline */}
          <motion.div variants={staggerItem} className="mb-8 flex flex-wrap items-center justify-center gap-2 text-base md:text-lg font-space-grotesk">
            {['Innovate.', 'Compete.', 'Elevate.'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                className={i === 1 ? 'gradient-text font-bold' : 'text-white/80'}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          <motion.p variants={staggerItem} className="text-white/50 text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-inter">
            Empowering innovators through technology, collaboration, and competition. Join a growing global community of builders and creators.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/auth/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Join Community
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="secondary" leftIcon={<Play className="w-4 h-4" />}>
                Explore Events
              </Button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
          >
            {STATS.map(stat => (
              <div key={stat.label} className="glass-card rounded-2xl p-4 text-center group hover:border-xorvin-primary/30 transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold font-space-grotesk gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-white/50 font-inter">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — animated line only, no text */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        aria-hidden
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}
