import React, { useState } from 'react';
import { SEO } from '@/components/atoms/SEO';
import { Search, ShieldAlert, ShieldCheck, Award, User, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'react-router-dom';

interface VerifiedCertificate {
  id: string;
  verification_code: string;
  type: string;
  issued_at: string;
  profiles: { name: string; email: string; avatar?: string };
  events: { title: string; start_date?: string };
}

export default function VerifyCertificatePage() {
  const [searchParams] = useSearchParams();
  const [certCode, setCertCode] = useState(searchParams.get('code') ?? '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = certCode.trim();
    if (!code) return;

    setStatus('loading');
    setCertificate(null);

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('id, verification_code, type, issued_at, profiles:user_id(name, email, avatar), events:event_id(title, start_date)')
        .eq('verification_code', code)
        .single();

      if (error || !data) {
        setStatus('invalid');
      } else {
        setCertificate(data as unknown as VerifiedCertificate);
        setStatus('valid');
      }
    } catch {
      setStatus('invalid');
    }
  };

  const typeLabel: Record<string, string> = {
    participation: 'Certificate of Participation',
    winner: 'Certificate of Excellence (Winner)',
    mentor: 'Certificate of Mentorship',
    organizer: 'Certificate of Appreciation (Organizer)',
  };

  return (
    <>
      <SEO
        title="Verify Certificate"
        description="Instantly verify the authenticity of any Xorvin certificate by entering the unique verification code."
      />

      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen flex items-center">
        <div className="container-xorvin max-w-2xl text-center">
          {/* Hero */}
          <div className="w-16 h-16 mx-auto mb-6 bg-xorvin-primary/10 rounded-2xl border border-xorvin-primary/20 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-xorvin-accent" />
          </div>
          <h1 className="heading-md text-white mb-4">
            Verify <span className="gradient-text">Certificate</span>
          </h1>
          <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
            Enter the unique verification code found at the bottom of any Xorvin certificate to confirm its authenticity.
          </p>

          {/* Search form */}
          <form onSubmit={handleVerify} className="glass-card p-2 rounded-2xl flex items-center mb-8 gap-2">
            <Search className="w-5 h-5 text-white/40 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="e.g. XRVN-2026-ABCDEF12"
              className="flex-1 bg-transparent border-none text-white px-3 py-3 focus:outline-none placeholder:text-white/30 font-mono text-sm"
              value={certCode}
              onChange={e => {
                setCertCode(e.target.value);
                setStatus('idle');
              }}
              aria-label="Certificate verification code"
            />
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify'}
            </Button>
          </form>

          {/* Results */}
          {status === 'valid' && certificate && (
            <div className="glass-card bg-green-500/5 border-green-500/30 p-8 rounded-2xl text-left space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-green-400 text-lg">Authentic Certificate</h3>
                  <p className="text-white/60 text-sm">This certificate was officially issued by Xorvin.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <User className="w-4 h-4 text-xorvin-accent shrink-0" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Recipient</p>
                    <p className="text-white font-medium">{certificate.profiles?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Award className="w-4 h-4 text-yellow-400 shrink-0" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Certificate Type</p>
                    <p className="text-white font-medium capitalize">{typeLabel[certificate.type] ?? certificate.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Event</p>
                    <p className="text-white font-medium">{certificate.events?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Issued On</p>
                    <p className="text-white font-medium">
                      {new Date(certificate.issued_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <p className="text-xs text-white/40 font-mono">Verification Code:</p>
                <code className="text-xs text-xorvin-accent bg-xorvin-primary/10 px-2 py-1 rounded">{certificate.verification_code}</code>
              </div>
            </div>
          )}

          {status === 'invalid' && (
            <div className="glass-card bg-red-500/5 border-red-500/30 p-8 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-red-400" />
              <h3 className="font-bold text-lg text-red-400 mb-2">Certificate Not Found</h3>
              <p className="text-white/60 text-sm">
                No certificate matches the code <code className="font-mono text-white/80 bg-white/10 px-1 rounded">{certCode}</code>.
                Please double-check the code and try again.
              </p>
            </div>
          )}

          {/* Help text */}
          <p className="mt-8 text-xs text-white/30">
            If you believe this certificate is authentic but the code is not verifying, please contact{' '}
            <a href="mailto:official.xorvin@gmail.com" className="text-xorvin-accent hover:underline">official.xorvin@gmail.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
