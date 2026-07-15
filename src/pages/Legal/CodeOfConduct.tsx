import React from 'react';
import { Helmet } from 'react-helmet-async';

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-8 rounded-2xl">
      <h2 className="text-xl font-bold font-space-grotesk text-white mb-4">{heading}</h2>
      <div className="text-white/60 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function CodeOfConductPage() {
  return (
    <>
      <Helmet><title>Code of Conduct — Xorvin</title></Helmet>
      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-3xl">
          <h1 className="heading-lg text-white mb-4">Code of Conduct</h1>
          <p className="text-white/40 text-sm mb-10">Last updated: July 2026</p>

          <div className="glass-card p-8 rounded-2xl mb-6 border border-xorvin-primary/20">
            <p className="text-white/80 leading-relaxed italic">
              "Xorvin is dedicated to providing a harassment-free experience for everyone, regardless of gender, sexual orientation, disability, physical appearance, body size, race, or religion."
            </p>
          </div>

          <div className="space-y-6">
            <Section heading="Our Standards">
              <p>Examples of behavior that contributes to a positive environment include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Using welcoming and inclusive language</li>
                <li>Being respectful of differing viewpoints and experiences</li>
                <li>Gracefully accepting constructive criticism</li>
                <li>Focusing on what is best for the community</li>
                <li>Showing empathy towards other community members</li>
              </ul>
            </Section>

            <Section heading="Unacceptable Behavior">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Harassment, intimidation, or discrimination in any form</li>
                <li>Sharing others' private information without explicit consent</li>
                <li>Publishing offensive, obscene, or otherwise inappropriate content</li>
                <li>Deliberate disruption of talks, presentations, or events</li>
                <li>Use of sexualized language or imagery</li>
              </ul>
            </Section>

            <Section heading="Enforcement">
              <p>Community moderators are responsible for clarifying and enforcing our standards of acceptable behavior. They have the right to remove, edit, or reject comments, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct.</p>
              <p>Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community team at <a href="mailto:conduct@xorvin.com" className="text-xorvin-accent hover:underline">conduct@xorvin.com</a>.</p>
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}
