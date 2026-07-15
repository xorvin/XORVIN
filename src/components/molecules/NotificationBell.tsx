import React, { useState } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/atoms/Button';

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost p-2 relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-xorvin-dark"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-strong border border-white/10 rounded-2xl shadow-glass overflow-hidden z-50 flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Notifications 
                {unreadCount > 0 && <span className="bg-xorvin-primary/20 text-xorvin-accent px-2 py-0.5 rounded-full text-xs">{unreadCount} new</span>}
              </h3>
              {unreadCount > 0 && (
                <button onClick={() => markAllRead()} className="text-xs flex items-center gap-1 text-white/50 hover:text-white transition-colors">
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/50 text-sm flex flex-col items-center gap-2">
                  <Bell className="w-8 h-8 text-white/20" />
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => !n.is_read && markAsRead(n.id)}
                      className={`p-4 hover:bg-white/5 transition-colors group ${!n.is_read ? 'bg-xorvin-primary/5' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className={`text-sm leading-tight ${!n.is_read ? 'text-white font-semibold' : 'text-white/80'}`}>{n.title}</h4>
                        {!n.is_read && <span className="w-2 h-2 bg-xorvin-primary rounded-full mt-1 shrink-0"></span>}
                      </div>
                      {n.body && <p className="text-xs text-white/60 mb-2 leading-relaxed">{n.body}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-white/40">{new Date(n.created_at).toLocaleString()}</p>
                        {n.link && (
                          <Link to={n.link} onClick={() => setIsOpen(false)} className="text-xs text-xorvin-accent hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/5 bg-black/20 text-center shrink-0">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="text-xs text-white/60 hover:text-white transition-colors">
                Notification Settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
