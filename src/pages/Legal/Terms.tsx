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
          <div className="space-y-6">
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

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <Section heading="1. Acceptance of Terms">
        <p>By accessing or using Xorvin's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.</p>
      </Section>
      <Section heading="2. User Accounts">
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.</p>
        <p>You must provide accurate, complete, and current information when creating an account. False or misleading information will result in account termination.</p>
      </Section>
      <Section heading="3. Community Standards">
        <p>Users must treat all community members with respect. Harassment, discrimination, or abusive behavior of any kind is strictly prohibited and will result in immediate account termination.</p>
      </Section>
      <Section heading="4. Intellectual Property">
        <p>The Xorvin platform, including its design, code, and content, is owned by Xorvin and protected by intellectual property laws. You may not copy or distribute any part of the platform without written permission.</p>
      </Section>
      <Section heading="5. Limitation of Liability">
        <p>Xorvin is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
      </Section>
    </LegalLayout>
  );
}
