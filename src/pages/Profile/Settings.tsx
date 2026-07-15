import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Bell, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/atoms/Button';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import * as Tabs from '@radix-ui/react-tabs';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [notifPrefs, setNotifPrefs] = useState({
    events: true,
    interviews: true,
    certificates: true,
    mentions: true,
    newsletters: false,
    reminders: true,
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast('Passwords do not match.', 'error');
      return;
    }
    if (passwordForm.newPass.length < 8) {
      toast('Password must be at least 8 characters.', 'error');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPass });
    if (error) {
      toast(error.message, 'error');
    } else {
      toast('Password updated successfully!', 'success');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    }
  };

  const handleDeleteAccount = async () => {
    // In production, this would call a Supabase Edge Function to delete auth user
    toast('Account deletion request submitted. You will receive an email confirmation.', 'success');
    setDeleteConfirm(false);
  };

  return (
    <>
      <Helmet><title>Settings — Xorvin Profile</title></Helmet>

      <section className="pt-32 pb-20 bg-xorvin-dark min-h-screen">
        <div className="container-xorvin max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-space-grotesk text-white">Account Settings</h1>
            <p className="text-white/50 mt-2">Manage your security, notifications, and privacy preferences.</p>
          </div>

          <Tabs.Root defaultValue="security">
            <Tabs.List className="flex gap-2 border-b border-white/10 mb-8 pb-px overflow-x-auto">
              {['security', 'notifications', 'privacy', 'danger'].map(tab => (
                <Tabs.Trigger key={tab} value={tab}
                  className={`px-4 py-3 text-sm font-medium outline-none capitalize transition-colors whitespace-nowrap ${
                    tab === 'danger'
                      ? 'text-red-400/60 hover:text-red-400 data-[state=active]:text-red-400 data-[state=active]:border-b-2 data-[state=active]:border-red-400'
                      : 'text-white/40 hover:text-white/80 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white'
                  }`}>
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* Security */}
            <Tabs.Content value="security" className="outline-none space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-white mb-1 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-400" /> Change Password</h3>
                <p className="text-sm text-white/50 mb-6">Use a strong password of at least 8 characters.</p>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="New password"
                      className="input-dark w-full pr-10"
                      value={passwordForm.newPass}
                      onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="input-dark w-full"
                    value={passwordForm.confirm}
                    onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                  />
                  <Button type="submit" leftIcon={<Shield className="w-4 h-4" />}>Update Password</Button>
                </form>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-white mb-1">Account Information</h3>
                <p className="text-sm text-white/50 mb-4">Your account details and authentication method.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-white/60">Email</span>
                    <span className="text-sm text-white font-mono">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-white/60">Role</span>
                    <span className="text-sm text-white capitalize">{user?.role}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-white/60">Account Status</span>
                    <span className="flex items-center gap-1.5 text-sm text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            {/* Notifications */}
            <Tabs.Content value="notifications" className="outline-none">
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-5 h-5 text-xorvin-accent" />
                  <h3 className="font-bold text-white">Notification Preferences</h3>
                </div>
                {Object.entries(notifPrefs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white capitalize">{key.replace('_', ' ')}</p>
                      <p className="text-xs text-white/40">
                        {key === 'events' ? 'Event registrations and updates' :
                         key === 'interviews' ? 'Interview schedules and feedback' :
                         key === 'certificates' ? 'Certificate availability' :
                         key === 'mentions' ? 'When someone mentions you' :
                         key === 'newsletters' ? 'Weekly platform newsletter' :
                         'Session and deadline reminders'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifPrefs(p => ({ ...p, [key]: !value }))}
                      className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-xorvin-primary' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
                <Button onClick={() => toast('Notification preferences saved!', 'success')} className="mt-4">Save Preferences</Button>
              </div>
            </Tabs.Content>

            {/* Privacy */}
            <Tabs.Content value="privacy" className="outline-none space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-white mb-4">Privacy Settings</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Show Profile Publicly', key: 'publicProfile', desc: 'Allow others to view your full profile' },
                    { label: 'Show in Leaderboard', key: 'showInLeaderboard', desc: 'Appear in public leaderboard rankings' },
                    { label: 'Allow Mentor Requests', key: 'allowMentorRequests', desc: 'Allow mentors to contact you' },
                  ].map(setting => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{setting.label}</p>
                        <p className="text-xs text-white/40">{setting.desc}</p>
                      </div>
                      <button className="w-11 h-6 bg-xorvin-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            {/* Danger Zone */}
            <Tabs.Content value="danger" className="outline-none">
              <div className="border border-red-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="font-bold text-red-400">Danger Zone</h3>
                </div>
                <p className="text-sm text-white/60">
                  These actions are permanent and cannot be undone. Please proceed with caution.
                </p>
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <div>
                      <p className="font-medium text-white">Delete Account</p>
                      <p className="text-xs text-white/40">Permanently delete your account and all associated data.</p>
                    </div>
                    <Button
                      onClick={() => setDeleteConfirm(true)}
                      className="bg-red-500 hover:bg-red-600 text-white border-none"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </section>

      <ConfirmDialog
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        title="Delete Account Permanently"
        description="This will permanently delete your account, all your certificates, badges, and event history. This action cannot be undone. Are you absolutely sure?"
        confirmText="Yes, Delete My Account"
        destructive
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
