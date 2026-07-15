import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DataTable } from '@/components/molecules/DataTable';
import { Trophy, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function LeaderboardManagement() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-leaderboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, email, points, role, joined_at, avatar')
        .order('points', { ascending: false })
        .limit(100);
      return data || [];
    }
  });

  return (
    <>
      <Helmet><title>Leaderboard Management — Xorvin Admin</title></Helmet>
      
      <div className="mb-8">
        <PageHeader 
          title="Global Leaderboard" 
          subtitle="View top platform users based on accumulated XP points."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {users.slice(0, 3).map((u: any, index: number) => (
          <div key={u.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className={`absolute top-0 w-full h-1 ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'}`} />
            
            <div className="relative mb-3 mt-2">
              <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=0b1626&color=30D5FF`} alt={u.name} className="w-20 h-20 rounded-full border-4 border-xorvin-dark shadow-xl" />
              <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-xorvin-dark ${
                index === 0 ? 'bg-yellow-400 text-yellow-900' : index === 1 ? 'bg-gray-300 text-gray-800' : 'bg-amber-600 text-amber-100'
              }`}>
                #{index + 1}
              </div>
            </div>
            
            <h3 className="text-white font-bold text-lg mt-2">{u.name}</h3>
            <p className="text-white/50 text-xs">{u.email}</p>
            <div className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Star className="w-3.5 h-3.5 text-xorvin-accent" />
              <span className="text-sm font-medium text-white">{u.points || 0} XP</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <DataTable 
          data={users}
          searchField="name"
          emptyMessage={isLoading ? "Loading leaderboard..." : "No users found."}
          columns={[
            { key: 'rank', header: 'Rank', render: (_, index) => (
              <span className={`font-mono font-bold ${index < 3 ? 'text-xorvin-accent text-lg' : 'text-white/40'}`}>
                #{index + 1}
              </span>
            )},
            { key: 'user', header: 'User', render: (row) => (
              <div className="flex items-center gap-3">
                <img src={row.avatar || `https://ui-avatars.com/api/?name=${row.name}&background=0b1626&color=30D5FF`} className="w-8 h-8 rounded-full" alt="" />
                <div>
                  <p className="font-medium text-white">{row.name}</p>
                  <p className="text-xs text-white/50">{row.email}</p>
                </div>
              </div>
            )},
            { key: 'role', header: 'Role', sortable: true, render: (row) => <span className="text-xs text-white/60 capitalize">{row.role}</span> },
            { key: 'points', header: 'XP Points', sortable: true, render: (row) => (
              <div className="flex items-center gap-1.5 text-xorvin-accent font-medium">
                {row.points || 0}
              </div>
            )},
            { key: 'joined', header: 'Joined', sortable: true, render: (row) => <span className="text-white/40 text-sm">{new Date(row.joined_at).toLocaleDateString()}</span> },
          ]}
        />
      </div>
    </>
  );
}
