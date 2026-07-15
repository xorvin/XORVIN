import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useToast } from '@/contexts/ToastContext';
import { APP_CONFIG } from '@/constants/config';
import { useSubmitContact } from '@/hooks/useContact';

export default function ContactPage() {
  const [formData, setFormData] = useState<{name: string, email: string, subject: string, message: string, type: 'general' | 'partnership' | 'sponsorship' | 'media' | 'support'}>({ name: '', email: '', subject: '', message: '', type: 'general' });
  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast('Please fill out all required fields', 'error');
      return;
    }
    try {
      await submitContact.mutateAsync(formData);
      toast('Message sent! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      toast(message, 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Xorvin</title>
      </Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin max-w-5xl">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4 inline-block">📞 Get in Touch</span>
            <h1 className="heading-lg text-white mb-4">Contact <span className="gradient-text">Xorvin</span></h1>
            <p className="text-white/60 text-lg">Have a question or want to partner with us? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Email Us</h3>
                  <p className="text-sm text-white/60 mb-2">For general inquiries and partnerships.</p>
                  <a href={`mailto:${APP_CONFIG.email}`} className="text-xorvin-primary hover:underline">{APP_CONFIG.email}</a>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Community Discord</h3>
                  <p className="text-sm text-white/60 mb-2">Get quick help from the community.</p>
                  <a href={APP_CONFIG.social.discord} target="_blank" rel="noreferrer" className="text-xorvin-primary hover:underline">Join our server</a>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-xorvin-primary/10 flex items-center justify-center text-xorvin-accent shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Global Presence</h3>
                  <p className="text-sm text-white/60">Xorvin operates globally across 68+ countries with local chapters in major tech hubs.</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-dark w-full"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="input-dark w-full"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="input-dark w-full"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5 ml-1">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="input-dark w-full min-h-[120px] resize-y"
                    placeholder="Your message here..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={submitContact.isPending}
                  leftIcon={submitContact.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                >
                  {submitContact.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
