#!/usr/bin/env node
/**
 * XORVIN — Per-Page Database Connection Checker
 * Tests Supabase connectivity for every route/page in the application.
 *
 * Usage: npm run check:db
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Load .env ────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(ROOT, '.env');
  const vars = {};
  if (!existsSync(envPath)) {
    console.error('❌ .env file not found. Copy .env.example to .env and fill in Supabase credentials.');
    process.exit(1);
  }
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('your-project')) {
  console.error('❌ VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Page → Query mapping ─────────────────────────────────────────────────────
const PAGE_CHECKS = [
  // Public pages
  { route: '/', page: 'Home', tables: [], note: 'Uses static sample data (no DB)' },
  { route: '/about', page: 'About', tables: [], note: 'Static content' },
  { route: '/events', page: 'Events', tables: ['events'], query: () => supabase.from('events').select('id', { count: 'exact', head: true }) },
  { route: '/events/:slug', page: 'EventDetail', tables: ['events'], query: () => supabase.from('events').select('slug').limit(1) },
  { route: '/competitions', page: 'Competitions', tables: [], note: 'Uses SAMPLE_EVENTS (no DB)' },
  { route: '/hackathons', page: 'Hackathons', tables: [], note: 'Uses SAMPLE_EVENTS (no DB)' },
  { route: '/workshops', page: 'Workshops', tables: [], note: 'Uses SAMPLE_EVENTS (no DB)' },
  { route: '/programs', page: 'Programs', tables: [], note: 'Static content' },
  { route: '/community', page: 'Community', tables: [], note: 'Static content' },
  { route: '/campus-ambassador', page: 'CampusAmbassador', tables: [], note: 'Static content' },
  { route: '/partners', page: 'Partners', tables: [], note: 'Static content' },
  { route: '/gallery', page: 'Gallery', tables: ['gallery'], query: () => supabase.from('gallery').select('id', { count: 'exact', head: true }), note: 'Page uses SAMPLE_GALLERY; service queries gallery table' },
  { route: '/blog', page: 'Blog', tables: ['blogs'], query: () => supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('is_published', true), note: 'Page uses SAMPLE_BLOGS; service queries blogs table' },
  { route: '/blog/:slug', page: 'BlogDetail', tables: ['blogs'], query: () => supabase.from('blogs').select('slug').limit(1), note: 'Page uses SAMPLE_BLOGS' },
  { route: '/leaderboard', page: 'Leaderboard', tables: ['profiles'], query: () => supabase.from('profiles').select('id, points').order('points', { ascending: false }).limit(5), note: 'Page uses SAMPLE_LEADERBOARD' },
  { route: '/certificates', page: 'Certificates', tables: ['certificates'], query: () => supabase.from('certificates').select('id', { count: 'exact', head: true }) },
  { route: '/certificates/verify', page: 'Verify', tables: ['certificates'], query: () => supabase.from('certificates').select('id').limit(1) },
  { route: '/faq', page: 'FAQ', tables: ['faqs'], query: () => supabase.from('faqs').select('id', { count: 'exact', head: true }).eq('is_active', true), note: 'Page uses hardcoded FAQs' },
  { route: '/contact', page: 'Contact', tables: ['contact_messages'], query: () => supabase.from('contact_messages').select('id', { count: 'exact', head: true }), note: 'Page does not call contactService yet' },

  // Legal
  { route: '/privacy', page: 'Privacy', tables: [], note: 'Static content' },
  { route: '/terms', page: 'Terms', tables: [], note: 'Static content' },
  { route: '/code-of-conduct', page: 'CodeOfConduct', tables: [], note: 'Static content' },

  // Profile (auth required for full access)
  { route: '/profile', page: 'Profile', tables: ['event_registrations', 'profiles'], query: () => supabase.from('event_registrations').select('id', { count: 'exact', head: true }) },
  { route: '/profile/edit', page: 'EditProfile', tables: ['profiles'], query: () => supabase.from('profiles').select('id').limit(1) },
  { route: '/profile/settings', page: 'Settings', tables: [], note: 'Uses supabase.auth.updateUser (auth API)' },

  // Auth
  { route: '/auth/login', page: 'Login', tables: ['profiles'], query: () => supabase.from('profiles').select('id').limit(1), note: 'Also uses supabase.auth.signInWithPassword' },
  { route: '/auth/register', page: 'Register', tables: [], note: 'Uses supabase.auth.signUp' },
  { route: '/auth/forgot-password', page: 'ForgotPassword', tables: [], note: 'Uses supabase.auth.resetPasswordForEmail' },
  { route: '/auth/callback', page: 'Callback', tables: [], note: 'Uses supabase.auth.getSession' },

  // Super Admin
  { route: '/super-admin', page: 'SuperAdminDashboard', tables: ['profiles', 'events', 'blogs', 'audit_logs'], query: () => supabase.from('audit_logs').select('id', { count: 'exact', head: true }) },

  // Admin
  { route: '/admin', page: 'AdminDashboard', tables: [], note: 'Uses SAMPLE_EVENTS/SAMPLE_BLOGS (no live DB)' },
  { route: '/admin/events', page: 'AdminEvents', tables: ['events'], query: () => supabase.from('events').select('id', { count: 'exact', head: true }), note: 'Page uses SAMPLE_EVENTS' },
  { route: '/admin/users', page: 'UsersManagement', tables: ['profiles', 'audit_logs'], query: () => supabase.from('profiles').select('id, name, role').limit(5) },
  { route: '/admin/blogs', page: 'BlogsManagement', tables: ['blogs'], query: () => supabase.from('blogs').select('id, title').limit(5) },
  { route: '/admin/certificates', page: 'CertificatesManagement', tables: ['certificates', 'events', 'profiles'], query: () => supabase.from('certificates').select('id').limit(1) },
  { route: '/admin/announcements', page: 'AnnouncementsManagement', tables: ['announcements'], query: () => supabase.from('announcements').select('id', { count: 'exact', head: true }) },
  { route: '/admin/gallery', page: 'GalleryManagement', tables: ['gallery_items'], query: () => supabase.from('gallery_items').select('id', { count: 'exact', head: true }) },
  { route: '/admin/contact', page: 'ContactMessages', tables: ['contact_messages'], query: () => supabase.from('contact_messages').select('id', { count: 'exact', head: true }) },
  { route: '/admin/reports', page: 'ReportsManagement', tables: ['reports'], query: () => supabase.from('reports').select('id', { count: 'exact', head: true }) },
  { route: '/admin/leaderboard', page: 'LeaderboardManagement', tables: ['profiles'], query: () => supabase.from('profiles').select('id, points').order('points', { ascending: false }).limit(5) },

  // Moderator
  { route: '/moderator', page: 'ModeratorDashboard', tables: ['reports', 'comments'], query: () => supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending') },

  // Event Manager
  { route: '/events/manage', page: 'EventManagerDashboard', tables: ['events'], query: () => supabase.from('events').select('id, title').limit(5) },
  { route: '/events/manage/new', page: 'EventWizard (new)', tables: ['events'], query: () => supabase.from('events').select('id').limit(1) },
  { route: '/events/manage/:id/registrations', page: 'Registrations', tables: ['events', 'event_registrations'], query: () => supabase.from('event_registrations').select('id', { count: 'exact', head: true }) },

  // Content Manager
  { route: '/content', page: 'ContentManagerDashboard', tables: ['blogs'], query: () => supabase.from('blogs').select('id, title').limit(5) },
  { route: '/content/blogs/new', page: 'BlogEditor (new)', tables: ['blogs'], query: () => supabase.from('blogs').select('id').limit(1) },

  // Interviewer
  { route: '/interviewer', page: 'InterviewerDashboard', tables: ['interviews'], query: () => supabase.from('interviews').select('id', { count: 'exact', head: true }) },
  { route: '/interviewer/schedule', page: 'ScheduleInterview', tables: ['profiles', 'events', 'interviews'], query: () => supabase.from('interviews').select('id').limit(1) },
  { route: '/interviewer/candidates', page: 'CandidateDatabase', tables: ['profiles', 'interviews'], query: () => supabase.from('profiles').select('id, name').limit(5) },

  // Judge
  { route: '/judge', page: 'JudgeDashboard', tables: ['events', 'submissions'], query: () => supabase.from('submissions').select('id', { count: 'exact', head: true }) },

  // Ambassador
  { route: '/ambassador', page: 'AmbassadorDashboard', tables: ['ambassadors', 'referrals', 'events'], query: () => supabase.from('ambassadors').select('id', { count: 'exact', head: true }) },

  // Mentor
  { route: '/mentor', page: 'MentorDashboard', tables: ['mentor_sessions', 'mentor_resources', 'learning_plans', 'assignments'], query: () => supabase.from('mentor_sessions').select('id', { count: 'exact', head: true }) },

  // Shared components
  { route: '(component)', page: 'CommandPalette', tables: ['profiles', 'events', 'blogs'], query: () => supabase.from('events').select('slug, title').limit(1) },
  { route: '(component)', page: 'NotificationBell', tables: ['notifications'], query: () => supabase.from('notifications').select('id', { count: 'exact', head: true }) },
];

// ─── Run checks ───────────────────────────────────────────────────────────────
async function checkConnection() {
  console.log('\n🔌 XORVIN Database Connection Check');
  console.log('═'.repeat(70));
  console.log(`URL: ${SUPABASE_URL}\n`);

  // Base connectivity
  const { error: pingError } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
  if (pingError) {
    console.error(`❌ Base connection FAILED: ${pingError.message}`);
    console.error('   Check VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and that migrations are applied.\n');
    process.exit(1);
  }
  console.log('✅ Base Supabase connection OK\n');

  const results = { pass: 0, fail: 0, skip: 0, warn: 0 };
  const failures = [];
  const warnings = [];

  console.log('Page/Route'.padEnd(35) + 'Tables'.padEnd(28) + 'Status');
  console.log('─'.repeat(70));

  for (const check of PAGE_CHECKS) {
    const tables = check.tables.length ? check.tables.join(', ') : '(none)';
    let status, icon;

    if (!check.query) {
      status = 'SKIP';
      icon = '⏭️ ';
      results.skip++;
      if (check.note) warnings.push({ page: check.page, note: check.note });
    } else {
      try {
        const { error } = await check.query();
        if (error) {
          status = `FAIL: ${error.message}`;
          icon = '❌';
          results.fail++;
          failures.push({ route: check.route, page: check.page, tables: check.tables, error: error.message });
        } else {
          status = 'OK';
          icon = '✅';
          results.pass++;
          if (check.note) {
            results.warn++;
            warnings.push({ page: check.page, note: check.note });
          }
        }
      } catch (e) {
        status = `FAIL: ${e.message}`;
        icon = '❌';
        results.fail++;
        failures.push({ route: check.route, page: check.page, tables: check.tables, error: e.message });
      }
    }

    console.log(`${icon} ${check.page.padEnd(33)} ${tables.padEnd(28)} ${status}`);
  }

  // Auth API check
  console.log('─'.repeat(70));
  const { error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.log(`❌ Auth API`.padEnd(36) + '(auth)'.padEnd(28) + `FAIL: ${authError.message}`);
    results.fail++;
  } else {
    console.log(`✅ Auth API`.padEnd(36) + '(auth)'.padEnd(28) + 'OK');
    results.pass++;
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log(`SUMMARY: ${results.pass} passed | ${results.fail} failed | ${results.skip} skipped (no DB)`);
  if (warnings.length) {
    console.log(`\n⚠️  Pages with services available but using sample/static data (${warnings.length}):`);
    for (const w of warnings) console.log(`   • ${w.page}: ${w.note}`);
  }
  if (failures.length) {
    console.log('\n❌ FAILURES:');
    for (const f of failures) {
      console.log(`   • [${f.route}] ${f.page} → tables: ${f.tables.join(', ')}`);
      console.log(`     Error: ${f.error}`);
    }
    process.exit(1);
  }
  console.log('\n✅ All database-connected pages passed!\n');
}

checkConnection().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
