import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Calendar, FileText, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    enabled: debouncedQuery.length > 2,
    queryFn: async () => {
      const searchTerm = `%${debouncedQuery}%`;
      
      const [users, events, blogs] = await Promise.all([
        supabase.from('profiles').select('id, name, username').ilike('name', searchTerm).limit(3),
        supabase.from('events').select('slug, title').ilike('title', searchTerm).limit(3),
        supabase.from('blogs').select('slug, title').ilike('title', searchTerm).limit(3)
      ]);

      const results = [];
      
      if (events.data) {
        results.push(...events.data.map(e => ({
          id: `e-${e.slug}`, type: 'Event', title: e.title, 
          icon: <Calendar className="w-4 h-4 text-xorvin-primary" />, 
          action: `/events/${e.slug}`
        })));
      }
      
      if (blogs.data) {
        results.push(...blogs.data.map(b => ({
          id: `b-${b.slug}`, type: 'Blog', title: b.title, 
          icon: <FileText className="w-4 h-4 text-green-400" />, 
          action: `/blog/${b.slug}`
        })));
      }
      
      if (users.data) {
        results.push(...users.data.map(u => ({
          id: `u-${u.id}`, type: 'User', title: u.name, 
          icon: <User className="w-4 h-4 text-purple-400" />, 
          action: `/profile` // Ideally would link to a public profile page if it existed
        })));
      }

      return results;
    }
  });

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono border border-white/10">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-xorvin-dark/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 glass-card"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-white/50 shrink-0" />
                <input
                  type="text"
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-white/40 ml-3 text-lg outline-none"
                  placeholder="Search events, blogs, users..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono border border-white/10 text-white/40">ESC</kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {query.length <= 2 && (
                  <div className="p-4 text-center text-white/40 text-sm">
                    Type at least 3 characters to search...
                  </div>
                )}
                
                {isLoading && debouncedQuery.length > 2 && (
                  <div className="p-4 text-center text-white/40 text-sm flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                    Searching...
                  </div>
                )}

                {debouncedQuery.length > 2 && !isLoading && (!searchResults || searchResults.length === 0) && (
                  <div className="p-4 text-center text-white/40 text-sm">
                    No results found for "{debouncedQuery}"
                  </div>
                )}

                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => runCommand(result.action)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group outline-none focus:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                            {result.icon}
                          </div>
                          <div className="text-left">
                            <p className="text-white text-sm font-medium">{result.title}</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider">{result.type}</p>
                          </div>
                        </div>
                        <Command className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-white/5 bg-white/5 flex gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-black/40 rounded border border-white/10">Tab</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-black/40 rounded border border-white/10">Enter</kbd> to select</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
