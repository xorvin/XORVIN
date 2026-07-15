-- ==============================================================================
-- XORVIN — Enterprise RBAC Schema (Part 2: Tables & Seeds)
-- Run this ONLY AFTER you have successfully run Part 1.
-- ==============================================================================

-- ─── 2. EXTEND PROFILES TABLE ─────────────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS twitter TEXT,
  ADD COLUMN IF NOT EXISTS portfolio TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',       -- active | suspended | banned
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS experience TEXT,                    -- beginner | intermediate | advanced
  ADD COLUMN IF NOT EXISTS skills TEXT[],
  ADD COLUMN IF NOT EXISTS banned_until TIMESTAMPTZ;

-- ─── 3. PERMISSIONS REGISTRY ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permissions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,    -- e.g. "events:create"
  description TEXT,
  module      TEXT NOT NULL            -- e.g. "events", "users", "content"
);

-- ─── 4. ROLE TO PERMISSION MAPPING ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS role_permissions (
  role          user_role NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- ─── 5. AUDIT LOGS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,       -- e.g. "user.role_change", "event.delete"
  target_type TEXT,                -- e.g. "user", "event", "blog"
  target_id   TEXT,
  metadata    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. NOTIFICATIONS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type       TEXT NOT NULL,        -- "certificate_ready" | "event_registered" | etc.
  title      TEXT NOT NULL,
  body       TEXT,
  link       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. COMMENTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL,       -- "blog" | "event"
  target_id   UUID NOT NULL,
  content     TEXT NOT NULL,
  is_flagged  BOOLEAN DEFAULT FALSE,
  flagged_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. REPORTS / MODERATION QUEUE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL,       -- "comment" | "user" | "event" | "blog"
  target_id   TEXT NOT NULL,
  reason      TEXT NOT NULL,
  status      TEXT DEFAULT 'pending',  -- pending | reviewed | dismissed
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. INTERVIEWS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interviews (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interviewer_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_id         UUID REFERENCES events(id) ON DELETE SET NULL,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status           TEXT DEFAULT 'scheduled',  -- scheduled | completed | cancelled | no_show
  meeting_link     TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 10. INTERVIEW FEEDBACK ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_feedback (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id          UUID REFERENCES interviews(id) ON DELETE CASCADE UNIQUE NOT NULL,
  technical_score       INTEGER CHECK (technical_score BETWEEN 1 AND 10),
  communication_score   INTEGER CHECK (communication_score BETWEEN 1 AND 10),
  problem_solving_score INTEGER CHECK (problem_solving_score BETWEEN 1 AND 10),
  overall_score         INTEGER CHECK (overall_score BETWEEN 1 AND 10),
  recommendation        TEXT,      -- "hire" | "reject" | "hold"
  comments              TEXT,
  submitted_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 11. CAMPUS AMBASSADORS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ambassadors (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  college        TEXT NOT NULL,
  city           TEXT,
  referral_code  TEXT UNIQUE NOT NULL,
  referral_count INTEGER DEFAULT 0,
  promo_kit_url  TEXT,
  status         TEXT DEFAULT 'active',  -- active | inactive | suspended
  joined_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 12. MENTOR SESSIONS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id        UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id        UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  topic            TEXT NOT NULL,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  status           TEXT DEFAULT 'scheduled',  -- scheduled | completed | cancelled
  notes            TEXT,
  recording_url    TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 13. BOOKMARKS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL,       -- "blog" | "event"
  target_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- ─── 14. USER BADGES ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_key TEXT NOT NULL,         -- "first_event" | "hackathon_winner" | "top_10" | etc.
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_key)
);

-- ==============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- ─── PERMISSIONS TABLES ───────────────────────────────────────────────────────
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Super admins manage permissions" ON permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read role permissions" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "Super admins manage role permissions" ON role_permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts notifications" ON notifications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users mark own as read" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ─── COMMENTS ─────────────────────────────────────────────────────────────────
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments public read" ON comments FOR SELECT USING (true);
CREATE POLICY "Auth users can comment" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);
CREATE POLICY "Users edit own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Moderators and authors delete comments" ON comments
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator'))
  );

-- ─── REPORTS ──────────────────────────────────────────────────────────────────
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can submit reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Moderators manage all reports" ON reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator'))
  );

-- ─── INTERVIEWS ───────────────────────────────────────────────────────────────
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Interview participants see own" ON interviews
  FOR SELECT USING (
    auth.uid() = interviewer_id OR
    auth.uid() = candidate_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
CREATE POLICY "Interviewers can create interviews" ON interviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'interviewer'))
  );
CREATE POLICY "Interviewers can update own" ON interviews
  FOR UPDATE USING (
    auth.uid() = interviewer_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- ─── INTERVIEW FEEDBACK ───────────────────────────────────────────────────────
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Interviewers submit own feedback" ON interview_feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_id AND interviews.interviewer_id = auth.uid()
    )
  );
CREATE POLICY "Admins and interviewers read feedback" ON interview_feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'interviewer'))
  );

-- ─── AMBASSADORS ──────────────────────────────────────────────────────────────
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ambassadors see own record" ON ambassadors
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
CREATE POLICY "Admins manage ambassadors" ON ambassadors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
CREATE POLICY "Ambassadors update own" ON ambassadors
  FOR UPDATE USING (auth.uid() = user_id);

-- ─── MENTOR SESSIONS ──────────────────────────────────────────────────────────
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors and mentees see own sessions" ON mentor_sessions
  FOR SELECT USING (
    auth.uid() = mentor_id OR
    auth.uid() = mentee_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
CREATE POLICY "Mentors create sessions" ON mentor_sessions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'mentor'))
  );
CREATE POLICY "Mentors update own sessions" ON mentor_sessions
  FOR UPDATE USING (
    auth.uid() = mentor_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- ─── BOOKMARKS ────────────────────────────────────────────────────────────────
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- ─── USER BADGES ──────────────────────────────────────────────────────────────
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges public read" ON user_badges FOR SELECT USING (true);
CREATE POLICY "System awards badges" ON user_badges
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- ==============================================================================
-- SEED: PERMISSIONS REGISTRY
-- All permission keys used by the RBAC system
-- ==============================================================================

INSERT INTO permissions (key, description, module) VALUES
  -- Platform
  ('platform:super_manage',    'Full platform control',                         'platform'),
  -- Users
  ('users:read',               'View user list',                                 'users'),
  ('users:create',             'Create new users',                               'users'),
  ('users:update',             'Edit any user profile',                          'users'),
  ('users:delete',             'Permanently delete users',                       'users'),
  ('users:ban',                'Permanently ban users',                          'users'),
  ('users:ban_temp',           'Temporarily suspend users',                      'users'),
  ('users:role_change',        'Change user roles',                              'users'),
  -- Events
  ('events:read',              'View events',                                    'events'),
  ('events:create',            'Create new events',                              'events'),
  ('events:update',            'Edit events',                                    'events'),
  ('events:delete',            'Delete events',                                  'events'),
  ('events:approve',           'Approve or reject events',                       'events'),
  ('events:manage_registrations','Manage participant registrations',             'events'),
  ('events:export',            'Export participant data as CSV',                 'events'),
  -- Content
  ('blogs:read',               'View all blogs including drafts',                'content'),
  ('blogs:create',             'Write new blog articles',                        'content'),
  ('blogs:update',             'Edit blogs',                                     'content'),
  ('blogs:delete',             'Delete blogs',                                   'content'),
  ('blogs:publish',            'Publish or unpublish blogs',                     'content'),
  ('gallery:approve',          'Approve gallery image submissions',              'content'),
  ('faqs:manage',              'Create, edit, delete FAQs',                      'content'),
  ('newsletters:manage',       'Manage newsletter campaigns',                    'content'),
  ('banners:manage',           'Manage homepage banners',                        'content'),
  -- Moderation
  ('reports:read',             'View moderation reports',                        'moderation'),
  ('reports:manage',           'Review and action reports',                      'moderation'),
  ('comments:delete',          'Delete any comment',                             'moderation'),
  -- Certificates
  ('certificates:generate',    'Issue certificates to participants',             'certificates'),
  ('certificates:read',        'View certificate records',                       'certificates'),
  -- Interviews
  ('interviews:schedule',      'Schedule new interviews',                        'interviews'),
  ('interviews:conduct',       'Access interview session tools',                 'interviews'),
  ('interviews:feedback',      'Submit interview evaluation forms',              'interviews'),
  -- Judging
  ('submissions:score',        'Score hackathon/competition submissions',        'judging'),
  ('rankings:publish',         'Publish final competition rankings',             'judging'),
  -- Ambassador
  ('ambassador:view_dashboard','Access campus ambassador dashboard',             'ambassador'),
  ('ambassador:generate_referral','Generate referral links',                    'ambassador'),
  -- Mentor
  ('mentor:host_sessions',     'Create and host mentorship sessions',            'mentor'),
  ('mentor:publish_resources', 'Publish learning resources',                    'mentor'),
  -- Audit & Settings
  ('audit_logs:read',          'View system audit logs',                         'system'),
  ('settings:manage_website',  'Edit global website settings',                  'system'),
  ('settings:manage_seo',      'Edit SEO configuration',                        'system'),
  ('analytics:read',           'View platform analytics',                       'system')
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- SEED: ROLE → PERMISSION ASSIGNMENTS
-- ==============================================================================

-- Helper function to assign permissions to a role
CREATE OR REPLACE FUNCTION assign_permissions(p_role user_role, p_keys TEXT[])
RETURNS void AS $$
BEGIN
  INSERT INTO role_permissions (role, permission_id)
  SELECT p_role, id FROM permissions WHERE key = ANY(p_keys)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- SUPER ADMIN: All permissions
SELECT assign_permissions('super_admin', ARRAY[
  'platform:super_manage',
  'users:read','users:create','users:update','users:delete','users:ban','users:ban_temp','users:role_change',
  'events:read','events:create','events:update','events:delete','events:approve','events:manage_registrations','events:export',
  'blogs:read','blogs:create','blogs:update','blogs:delete','blogs:publish',
  'gallery:approve','faqs:manage','newsletters:manage','banners:manage',
  'reports:read','reports:manage','comments:delete',
  'certificates:generate','certificates:read',
  'interviews:schedule','interviews:conduct','interviews:feedback',
  'submissions:score','rankings:publish',
  'ambassador:view_dashboard','ambassador:generate_referral',
  'mentor:host_sessions','mentor:publish_resources',
  'audit_logs:read','settings:manage_website','settings:manage_seo','analytics:read'
]);

-- ADMIN: Platform management (no super_manage, no perm editing)
SELECT assign_permissions('admin', ARRAY[
  'users:read','users:update','users:ban','users:ban_temp','users:role_change',
  'events:read','events:create','events:update','events:delete','events:approve','events:manage_registrations','events:export',
  'blogs:read','blogs:create','blogs:update','blogs:delete','blogs:publish',
  'gallery:approve','faqs:manage','newsletters:manage','banners:manage',
  'reports:read','reports:manage','comments:delete',
  'certificates:generate','certificates:read',
  'interviews:schedule','interviews:conduct','interviews:feedback',
  'submissions:score','rankings:publish',
  'ambassador:view_dashboard',
  'mentor:host_sessions',
  'audit_logs:read','analytics:read'
]);

-- MODERATOR: Community management only
SELECT assign_permissions('moderator', ARRAY[
  'users:read','users:ban_temp',
  'reports:read','reports:manage','comments:delete',
  'gallery:approve','faqs:manage',
  'blogs:read',
  'events:read'
]);

-- EVENT MANAGER: Event-focused management
SELECT assign_permissions('event_manager', ARRAY[
  'events:read','events:create','events:update','events:delete',
  'events:manage_registrations','events:export',
  'certificates:generate','certificates:read'
]);

-- CONTENT MANAGER: All content operations
SELECT assign_permissions('content_manager', ARRAY[
  'blogs:read','blogs:create','blogs:update','blogs:delete','blogs:publish',
  'faqs:manage','newsletters:manage','banners:manage',
  'gallery:approve'
]);

-- INTERVIEWER: Interview management
SELECT assign_permissions('interviewer', ARRAY[
  'interviews:schedule','interviews:conduct','interviews:feedback',
  'certificates:generate','certificates:read'
]);

-- JUDGE: Hackathon scoring
SELECT assign_permissions('judge', ARRAY[
  'submissions:score','rankings:publish',
  'events:read'
]);

-- AMBASSADOR: Campus ambassador features
SELECT assign_permissions('ambassador', ARRAY[
  'ambassador:view_dashboard','ambassador:generate_referral'
]);

-- MENTOR: Mentorship features
SELECT assign_permissions('mentor', ARRAY[
  'mentor:host_sessions','mentor:publish_resources'
]);

-- MEMBER: Standard user
SELECT assign_permissions('member', ARRAY[
  'events:read','blogs:read','certificates:read'
]);

-- GUEST: Public access only
SELECT assign_permissions('guest', ARRAY[
  'events:read','blogs:read'
]);

-- Clean up helper function after use
DROP FUNCTION assign_permissions;
