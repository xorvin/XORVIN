import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '@/constants/config';
import { useToast } from '@/contexts/ToastContext';

const FOOTER_LINKS = {
  Community: [
    { label: 'About Xorvin',      href: '/about'             },
    { label: 'Community Hub',     href: '/community'         },
    { label: 'Campus Ambassador', href: '/campus-ambassador' },
    { label: 'Blog',              href: '/blog'              },
    { label: 'Gallery',           href: '/gallery'           },
  ],
  'Compete & Learn': [
    { label: 'Events',        href: '/events'       },
    { label: 'Hackathons',    href: '/hackathons'   },
    { label: 'Competitions',  href: '/competitions' },
    { label: 'Workshops',     href: '/workshops'    },
    { label: 'Programs',      href: '/programs'     },
  ],
  Resources: [
    { label: 'Leaderboard',   href: '/leaderboard'  },
    { label: 'Certificates',  href: '/certificates' },
    { label: 'Partners',      href: '/partners'     },
    { label: 'FAQ',           href: '/faq'          },
    { label: 'Contact',       href: '/contact'      },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy'          },
    { label: 'Terms of Service', href: '/terms'            },
    { label: 'Code of Conduct',  href: '/code-of-conduct'  },
  ],
};

// SVG Brand Icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: <TwitterIcon />,   href: APP_CONFIG.social.twitter,   label: 'Twitter / X'  },
  { icon: <GitHubIcon />,    href: APP_CONFIG.social.github,    label: 'GitHub'       },
  { icon: <LinkedInIcon />,  href: APP_CONFIG.social.linkedin,  label: 'LinkedIn'     },
  { icon: <InstagramIcon />, href: APP_CONFIG.social.instagram, label: 'Instagram'    },
  { icon: <DiscordIcon />,   href: APP_CONFIG.social.discord,   label: 'Discord'      },
];


export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast('Successfully subscribed to the Xorvin newsletter! 🎉', 'success');
    setEmail('');
  };

  return (
    <footer className="relative border-t border-white/5 bg-xorvin-dark overflow-hidden" role="contentinfo">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-xorvin-primary/5 blur-[100px] pointer-events-none" />

      <div className="container-xorvin py-16 relative">
        {/* Newsletter */}
        <div className="glass-card rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-space-grotesk text-white mb-1">Stay in the loop</h3>
            <p className="text-white/60 text-sm">Get the latest events, competitions, and tech news delivered to your inbox.</p>
          </div>
          {subscribed ? (
            <p className="text-xorvin-accent font-semibold text-sm flex items-center gap-2">✓ You're subscribed!</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full md:w-auto min-w-[320px]">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-dark flex-1 text-sm py-2.5"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap" aria-label="Subscribe">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img 
                src="/logo.png" 
                alt="Xorvin Logo" 
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span style={{fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.05em'}} className="text-xl text-white uppercase">
                XORVIN
              </span>
            </Link>
            <p className="text-sm text-white/50 mb-5 leading-relaxed max-w-xs">
              {APP_CONFIG.mission}
            </p>
            <div className="flex items-center gap-1 text-xs text-white/40 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>India — Global Community</span>
            </div>
            <a href={`mailto:${APP_CONFIG.email}`} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-xorvin-accent transition-colors">
              <Mail className="w-3.5 h-3.5" /> {APP_CONFIG.email}
            </a>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Xorvin. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-xorvin-accent hover:border-xorvin-accent/30 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
