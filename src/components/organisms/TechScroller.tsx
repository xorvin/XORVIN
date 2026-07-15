import React from 'react';
import { TECH_DOMAINS } from '@/constants/config';

export function TechScroller() {
  const items = [...TECH_DOMAINS, ...TECH_DOMAINS]; // double for seamless loop

  return (
    <section className="py-8 border-y border-white/5 bg-xorvin-dark/50 overflow-hidden" aria-label="Technology domains">
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-xorvin-dark to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-xorvin-dark to-transparent z-10 pointer-events-none" />

        {/* Scrolling row 1 */}
        <div className="flex animate-marquee whitespace-nowrap mb-4">
          {items.map((domain, i) => (
            <div
              key={`${domain.id}-${i}`}
              className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mx-2 text-sm font-medium text-white/70 hover:text-white hover:border-xorvin-primary/30 transition-colors cursor-default flex-shrink-0"
            >
              <span className="text-base">{domain.icon}</span>
              <span className="font-inter">{domain.name}</span>
            </div>
          ))}
        </div>

        {/* Scrolling row 2 (reverse) */}
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...items].reverse().map((domain, i) => (
            <div
              key={`rev-${domain.id}-${i}`}
              className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mx-2 text-sm font-medium text-white/60 hover:text-white transition-colors cursor-default flex-shrink-0"
              style={{ borderColor: `${domain.color}20` }}
            >
              <span className="text-base">{domain.icon}</span>
              <span className="font-inter">{domain.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
