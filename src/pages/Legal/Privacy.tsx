import React from 'react';
import { Helmet } from 'react-helmet-async';

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Helmet><title>{`${title} — Xorvin`}</title></Helmet>
      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-3xl">
          <h1 className="heading-lg text-white mb-4">{title}</h1>
          <p className="text-white/40 text-sm mb-10">Last updated: July 2026</p>
          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-8 rounded-2xl">
      <h2 className="text-xl font-bold font-space-grotesk text-white mb-4">{heading}</h2>
      <div className="text-white/60 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <Section heading="1. Information We Collect">
        <p>We collect information you provide directly to us when you create an account, register for events, or contact us. This includes your name, email address, and profile information.</p>
        <p>We also collect information automatically when you use our services, including log data, device information, and cookies to improve your experience.</p>
      </Section>
      <Section heading="2. How We Use Your Information">
        <p>We use the information we collect to operate, maintain, and improve our services, process your event registrations, send you notifications about events and community updates, and personalize your experience on the platform.</p>
      </Section>
      <Section heading="3. Information Sharing">
        <p>We do not sell or rent your personal information to third parties. We may share your information with event partners (such as sponsors) only with your explicit consent during registration.</p>
      </Section>
      <Section heading="4. Data Retention">
        <p>We retain your personal information for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at privacy@xorvin.com.</p>
      </Section>
      <Section heading="5. Contact Us">
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@xorvin.com" className="text-xorvin-accent hover:underline">privacy@xorvin.com</a>.</p>
      </Section>
    </LegalLayout>
  );
}
