import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';
import { Award, Plus, Mail, Download, QrCode, Copy, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import * as Dialog from '@radix-ui/react-dialog';
import QRCode from 'qrcode';
import { APP_CONFIG } from '@/constants/config';

// Generates a QR code data URL for the verification page URL
async function generateQrDataUrl(verificationCode: string): Promise<string> {
  const url = `${APP_CONFIG.url}/certificates/verify?code=${verificationCode}`;
  return QRCode.toDataURL(url, { width: 200, margin: 2, color: { dark: '#007BFF', light: '#0b1626' } });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors" title="Copy code">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function CertificatesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ user_email: '', event_id: '', type: 'participation' });
  const [qrModal, setQrModal] = useState<{ code: string; qrUrl: string; name: string } | null>(null);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['admin-certificates'],
    queryFn: async () => {
      const { data } = await supabase
        .from('certificates')
        .select('*, profiles:user_id(name, email), events:event_id(title)')
        .order('issued_at', { ascending: false });
      return data || [];
    }
  });

  const { data: events = [] } = useQuery({
    queryKey: ['admin-events-list'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('id, title').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const issueMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: userData, error: userError } = await supabase
        .from('profiles').select('id').eq('email', data.user_email).single();
      if (userError || !userData) throw new Error('User not found with this email address');

      const { error } = await supabase.from('certificates').insert([{
        user_id: userData.id,
        event_id: data.event_id,
        type: data.type,
      }]);

      if (error) {
        if (error.code === '23505') throw new Error('Certificate already issued for this user/event/type combination');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      toast('Certificate issued successfully!', 'success');
      setIsModalOpen(false);
      setFormData({ user_email: '', event_id: '', type: 'participation' });
    },
    onError: (err: any) => toast(err.message, 'error')
  });

  const handleShowQR = useCallback(async (cert: any) => {
    if (!cert.verification_code) {
      toast('This certificate has no verification code. Please re-issue it.', 'warning');
      return;
    }
    const qrUrl = await generateQrDataUrl(cert.verification_code);
    setQrModal({ code: cert.verification_code, qrUrl, name: cert.profiles?.name ?? 'Recipient' });
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    issueMutation.mutate(formData);
  };

  const typeColors: Record<string, string> = {
    winner: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    mentor: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    organizer: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    participation: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  return (
    <>
      <Helmet><title>Certificates — Xorvin Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader title="Certificates" subtitle="Issue and manage digital certificates for event participants." />
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Issue Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60 text-sm font-medium">Total Issued</h3>
            <Award className="w-4 h-4 text-xorvin-accent" />
          </div>
          <p className="text-3xl font-bold font-space-grotesk text-white">{certificates.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60 text-sm font-medium">Winners</h3>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold font-space-grotesk text-white">
            {certificates.filter((c: any) => c.type === 'winner').length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60 text-sm font-medium">Verified Codes</h3>
            <QrCode className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-3xl font-bold font-space-grotesk text-white">
            {certificates.filter((c: any) => !!c.verification_code).length}
          </p>
        </div>
      </div>

      <DataTable
        data={certificates}
        searchField="profiles.name"
        emptyMessage={isLoading ? 'Loading certificates...' : 'No certificates issued yet.'}
        columns={[
          {
            key: 'user', header: 'Recipient', render: (row) => (
              <div>
                <p className="font-medium text-white">{row.profiles?.name}</p>
                <p className="text-xs text-white/50">{row.profiles?.email}</p>
              </div>
            )
          },
          { key: 'event', header: 'Event', render: (row) => <span className="text-sm text-white/80">{row.events?.title}</span> },
          {
            key: 'type', header: 'Type', sortable: true, render: (row) => (
              <span className={`px-2 py-1 rounded text-xs border uppercase tracking-wider font-semibold ${typeColors[row.type] ?? 'bg-white/10 border-white/20 text-white/60'}`}>
                {row.type}
              </span>
            )
          },
          {
            key: 'verification_code', header: 'Verification Code', render: (row) => (
              row.verification_code ? (
                <div className="flex items-center gap-1.5">
                  <code className="text-xs text-xorvin-accent font-mono bg-xorvin-primary/10 px-2 py-1 rounded">
                    {row.verification_code}
                  </code>
                  <CopyButton text={row.verification_code} />
                </div>
              ) : <span className="text-xs text-white/30 italic">No code</span>
            )
          },
          {
            key: 'issued_at', header: 'Issued On', sortable: true, render: (row) => (
              <span className="text-white/60 text-sm">
                {new Date(row.issued_at).toLocaleDateString('en-IN')}
              </span>
            )
          },
          {
            key: 'actions', header: '', render: (row) => (
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleShowQR(row)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-xorvin-accent transition-colors"
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
                  title="Email Certificate"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  className="p-2 bg-xorvin-primary/10 hover:bg-xorvin-primary/20 rounded-lg text-xorvin-primary transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )
          }
        ]}
      />

      {/* Issue Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-xorvin-dark border border-white/10 rounded-2xl p-6 z-50 shadow-2xl focus:outline-none">
            <Dialog.Title className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-xorvin-accent" />
              Issue New Certificate
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Recipient Email</label>
                <input
                  type="email" required
                  value={formData.user_email}
                  onChange={e => setFormData({ ...formData, user_email: e.target.value })}
                  className="input-dark w-full"
                  placeholder="participant@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Select Event</label>
                <select
                  required value={formData.event_id}
                  onChange={e => setFormData({ ...formData, event_id: e.target.value })}
                  className="input-dark w-full"
                >
                  <option value="" disabled>Select an event...</option>
                  {(events as any[]).map((ev: any) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Certificate Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="input-dark w-full"
                >
                  <option value="participation">Participation</option>
                  <option value="winner">Winner</option>
                  <option value="mentor">Mentor</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={issueMutation.isPending}>
                  {issueMutation.isPending ? 'Issuing...' : 'Issue Certificate'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* QR Code Modal */}
      <Dialog.Root open={!!qrModal} onOpenChange={() => setQrModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-xorvin-dark border border-white/10 rounded-2xl p-8 z-50 shadow-2xl text-center focus:outline-none">
            <Dialog.Title className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-xorvin-accent" />
              Certificate QR Code
            </Dialog.Title>
            <p className="text-sm text-white/50 mb-6">{qrModal?.name}</p>

            {qrModal?.qrUrl && (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={qrModal.qrUrl}
                  alt="QR Code"
                  className="w-48 h-48 rounded-xl border border-white/10"
                />
                <div className="flex items-center gap-2">
                  <code className="text-sm text-xorvin-accent font-mono bg-xorvin-primary/10 px-3 py-1 rounded-lg">
                    {qrModal.code}
                  </code>
                  <CopyButton text={qrModal.code} />
                </div>

                <a
                  href={qrModal.qrUrl}
                  download={`${qrModal.code}-qr.png`}
                  className="btn-ghost text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download QR
                </a>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
