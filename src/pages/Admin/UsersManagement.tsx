import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, User as UserIcon, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DataTable } from '@/components/molecules/DataTable';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ROLE_COLORS, ROLE_LABELS } from '@/constants/permissions';
import type { UserRole } from '@/types';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; userId: string | null; action: 'suspend' | 'activate' }>({ open: false, userId: null, action: 'suspend' });

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      
      // Also log the action
      await supabase.from('audit_logs').insert({
        action: `user.${status === 'suspended' ? 'suspend' : 'activate'}`,
        target_type: 'user',
        target_id: id,
      });
    },
    onSuccess: () => {
      toast('User status updated successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSuspendDialog({ open: false, userId: null, action: 'suspend' });
    },
    onError: (err: any) => {
      toast(err.message || 'Failed to update user status.', 'error');
      setSuspendDialog({ open: false, userId: null, action: 'suspend' });
    }
  });

  const handleToggleStatus = () => {
    if (suspendDialog.userId) {
      toggleStatusMutation.mutate({
        id: suspendDialog.userId,
        status: suspendDialog.action === 'suspend' ? 'suspended' : 'active'
      });
    }
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {row.avatar_url ? (
            <img src={row.avatar_url} alt={row.username} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
          <div>
            <p className="font-medium text-white text-sm">{row.name}</p>
            <p className="text-xs text-white/40">@{row.username}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row: any) => {
        const roleStr = row.role as UserRole;
        const colorClass = ROLE_COLORS[roleStr] || 'bg-white/10 text-white/60';
        const label = ROLE_LABELS[roleStr] || roleStr;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>
            {label}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${row.status === 'suspended' ? 'bg-red-500' : 'bg-green-500'}`} />
          <span className="text-xs text-white/60 capitalize">{row.status || 'Active'}</span>
        </div>
      )
    },
    {
      key: 'points',
      header: 'Points',
      sortable: true,
      render: (row: any) => (
        <span className="font-semibold text-xorvin-accent">{row.points || 0}</span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (row: any) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" className="w-48 bg-xorvin-dark border border-white/10 rounded-xl p-1 shadow-xl z-50">
              <DropdownMenu.Item className="text-sm text-white/80 px-3 py-2 rounded-lg hover:bg-white/10 outline-none cursor-pointer flex items-center gap-2">
                <Shield className="w-4 h-4" /> Change Role
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
              {row.status === 'suspended' ? (
                <DropdownMenu.Item 
                  onClick={() => setSuspendDialog({ open: true, userId: row.id, action: 'activate' })}
                  className="text-sm text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/10 outline-none cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Reactivate Account
                </DropdownMenu.Item>
              ) : (
                <DropdownMenu.Item 
                  onClick={() => setSuspendDialog({ open: true, userId: row.id, action: 'suspend' })}
                  className="text-sm text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 outline-none cursor-pointer flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" /> Suspend Account
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )
    }
  ];

  return (
    <>
      <Helmet><title>Manage Users — Xorvin Admin</title></Helmet>

      <PageHeader 
        title="User Management" 
        subtitle={`Managing ${users?.length || 0} registered members across the platform.`}
      />

      <DataTable 
        data={users || []} 
        columns={columns}
        searchable={true}
        searchField="name"
        emptyMessage={isLoading ? "Loading users..." : "No users found"}
      />

      <ConfirmDialog 
        open={suspendDialog.open}
        onOpenChange={(open) => !open && setSuspendDialog({ open: false, userId: null, action: 'suspend' })}
        title={suspendDialog.action === 'suspend' ? "Suspend User Account" : "Reactivate User Account"}
        description={
          suspendDialog.action === 'suspend' 
            ? "Are you sure you want to suspend this user? They will immediately lose access to the platform until an administrator reactivates their account."
            : "Are you sure you want to reactivate this user? They will regain full access to the platform."
        }
        confirmText={suspendDialog.action === 'suspend' ? "Suspend User" : "Reactivate User"}
        destructive={suspendDialog.action === 'suspend'}
        onConfirm={handleToggleStatus}
        isLoading={toggleStatusMutation.isPending}
      />
    </>
  );
}
