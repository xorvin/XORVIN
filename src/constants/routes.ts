// ============================================================
// XORVIN — Application Routes
// ============================================================

export const ROUTES = {
  HOME:               '/',
  ABOUT:              '/about',
  COMMUNITY:          '/community',
  COMPETITIONS:       '/competitions',
  HACKATHONS:         '/hackathons',
  EVENTS:             '/events',
  EVENT_DETAIL:       '/events/:slug',
  WORKSHOPS:          '/workshops',
  PROGRAMS:           '/programs',
  CAMPUS_AMBASSADOR:  '/campus-ambassador',
  PARTNERS:           '/partners',
  BLOG:               '/blog',
  BLOG_POST:          '/blog/:slug',
  GALLERY:            '/gallery',
  LEADERBOARD:        '/leaderboard',
  CERTIFICATES:       '/certificates',
  CERTIFICATE_VERIFY: '/certificates/verify/:id',
  FAQ:                '/faq',
  CONTACT:            '/contact',
  PRIVACY:            '/privacy',
  TERMS:              '/terms',
  CODE_OF_CONDUCT:    '/code-of-conduct',

  // Auth
  LOGIN:            '/auth/login',
  REGISTER:         '/auth/register',
  FORGOT_PASSWORD:  '/auth/forgot-password',

  // Admin
  ADMIN:                  '/admin',
  ADMIN_DASHBOARD:        '/admin/dashboard',
  ADMIN_EVENTS:           '/admin/events',
  ADMIN_BLOGS:            '/admin/blogs',
  ADMIN_USERS:            '/admin/users',
  ADMIN_CERTIFICATES:     '/admin/certificates',
  ADMIN_LEADERBOARD:      '/admin/leaderboard',
  ADMIN_ANNOUNCEMENTS:    '/admin/announcements',
  ADMIN_GALLERY:          '/admin/gallery',

  // Utility
  NOT_FOUND: '/404',
  OFFLINE:   '/offline',
} as const;
