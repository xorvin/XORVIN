import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    category: 'General',
    items: [
      { q: 'What is Xorvin?', a: 'Xorvin is a global technology community focused on bringing together developers, designers, and innovators through hackathons, competitions, and collaborative projects.' },
      { q: 'Is it free to join?', a: 'Yes! Basic membership is completely free and gives you access to the community Discord, most events, and learning resources.' },
      { q: 'Who can participate in events?', a: 'Anyone with an interest in technology can participate. We have events tailored for beginners, intermediates, and advanced professionals.' }
    ]
  },
  {
    category: 'Events & Competitions',
    items: [
      { q: 'How do I register for a hackathon?', a: 'You can browse upcoming events on the Events page. Once you find an event, click "Register" and fill out the required team or individual details.' },
      { q: 'Are events virtual or in-person?', a: 'We host both! Check the specific event details to see if it is hosted online, in a specific city, or hybrid.' }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>('General-0');

  return (
    <>
      <Helmet>
        <title>FAQ — Xorvin</title>
      </Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin max-w-3xl">
          <div className="text-center mb-12">
            <span className="badge-primary mb-4 inline-block">🤔 Support</span>
            <h1 className="heading-lg text-white mb-4">Frequently Asked <span className="gradient-text">Questions</span></h1>
          </div>

          <div className="space-y-12">
            {FAQS.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-bold font-space-grotesk text-xorvin-accent mb-6">{section.category}</h2>
                <div className="space-y-4">
                  {section.items.map((item, i) => {
                    const id = `${section.category}-${i}`;
                    const isOpen = openIndex === id;
                    
                    return (
                      <div key={id} className="glass-card rounded-xl overflow-hidden">
                        <button 
                          onClick={() => setOpenIndex(isOpen ? null : id)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="font-semibold text-white">{item.q}</span>
                          <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 text-white/60 font-inter">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
