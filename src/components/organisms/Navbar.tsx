import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Sun, Moon, User, LogOut, ChevronDown, ExternalLink } from 'lucide-react';
import { useScrollY } from '@/hooks/useScrollProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/atoms/Button';
import { CommandPalette } from '@/components/molecules/CommandPalette';
import { NotificationBell } from '@/components/molecules/NotificationBell';

const NAV_ITEMS = [
  { label: 'About',        href: '/about'            },
  { label: 'Community',    href: '/community'        },
  {
    label: 'Compete',
    href: '#',
    children: [
      { label: 'All Events',      href: '/events'       },
      { label: 'Hackathons',      href: '/hackathons'   },
      { label: 'Competitions',    href: '/competitions' },
      { label: 'CTF',             href: '/competitions' },
    ],
  },
  {
    label: 'Learn',
    href: '#',
    children: [
      { label: 'Workshops',       href: '/workshops'   },
      { label: 'Programs',        href: '/programs'    },
      { label: 'Blog',            href: '/blog'        },
      { label: 'Bootcamps',       href: '/programs'    },
    ],
  },
  { label: 'Leaderboard',  href: '/leaderboard'      },
  { label: 'Partners',     href: '/partners'         },
];

export function Navbar() {
  const scrollY = useScrollY();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const isScrolled = scrollY > 20;

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-white/5 shadow-glass' : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-xorvin">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Xorvin Home">
              <img 
                src="/logo.png" 
                alt="Xorvin Logo" 
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span style={{fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.05em'}} className="text-xl text-white uppercase">
                XORVIN
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="btn-ghost flex items-center gap-1 text-sm">
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-48 glass-strong rounded-xl border border-white/10 shadow-glass overflow-hidden"
                        >
                          {item.children.map(child => (
                            <NavLink
                              key={child.label}
                              to={child.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      `btn-ghost text-sm neon-underline ${isActive ? 'text-xorvin-accent' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <CommandPalette />
              
              {/* Search (Mobile) */}
              <button
                onClick={() => setSearchOpen(s => !s)}
                className="btn-ghost p-2 md:hidden"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle Removed */}

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  <div className="relative group hidden md:block">
                    <button className="flex items-center gap-2 btn-ghost p-1.5">
                    <img src={user?.avatar} alt={user?.name} className="w-7 h-7 rounded-full object-cover border border-xorvin-primary/30" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl border border-white/10 shadow-glass overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                      <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-xorvin-accent hover:bg-white/5 transition-colors">
                        <ExternalLink className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/certificates" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" /> My Certificates
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                  <Link to="/auth/register"><Button size="sm">Join Free</Button></Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden btn-ghost p-2"
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/5 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="container-xorvin py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search events, hackathons, blogs..."
                    className="input-dark pl-10 pr-20 py-2.5 text-sm"
                    autoFocus
                    aria-label="Search"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-3 py-1 text-xs rounded-lg">
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-xorvin-dark/90 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 glass-strong border-l border-white/10 flex flex-col">
              <div className="h-16 flex items-center px-6 border-b border-white/5">
                <span className="font-space-grotesk font-bold text-xl gradient-text">Menu</span>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {NAV_ITEMS.map(item => (
                  <React.Fragment key={item.label}>
                    {item.children ? (
                      <>
                        <p className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">{item.label}</p>
                        {item.children.map(child => (
                          <NavLink
                            key={child.label}
                            to={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `block px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive ? 'bg-xorvin-primary/20 text-xorvin-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </>
                    ) : (
                      <NavLink
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive ? 'bg-xorvin-primary/20 text-xorvin-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </React.Fragment>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button variant="danger" onClick={() => { logout(); setMobileOpen(false); }}>Sign Out</Button>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/auth/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Join Free</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
