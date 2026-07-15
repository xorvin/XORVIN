-- ==============================================================================
-- XORVIN — Complete Database Schema, Seeds & Application Queries
-- Generated: 2026-07-12
-- Run order: Schema (001-006) → Seeds → Event updates (007)
-- ==============================================================================


-- ==============================================================================
-- MIGRATION: 001_initial_schema.sql
-- ==============================================================================

-- ==============================================================================
-- XORVIN â€” Enterprise Supabase Schema
-- ==============================================================================

-- â”€â”€â”€ 1. ENUMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'member', 'ambassador');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE event_category AS ENUM ('hackathon', 'competition', 'workshop', 'conference', 'bootcamp', 'ctf', 'ai-challenge', 'startup', 'open-source');
CREATE TYPE certificate_type AS ENUM ('participation', 'winner', 'speaker', 'volunteer', 'completion');
CREATE TYPE announcement_type AS ENUM ('info', 'warning', 'success', 'event');

-- â”€â”€â”€ 2. PROFILES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'member'::user_role NOT NULL,
  bio TEXT,
  college TEXT,
  country TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  portfolio TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  wins INTEGER DEFAULT 0 NOT NULL,
  events_participated INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 3. EVENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  category event_category NOT NULL,
  status event_status DEFAULT 'upcoming'::event_status NOT NULL,
  cover_image TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  venue TEXT,
  is_virtual BOOLEAN DEFAULT TRUE NOT NULL,
  max_participants INTEGER,
  registered_count INTEGER DEFAULT 0 NOT NULL,
  prize_pool TEXT,
  organizer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 4. EVENT REGISTRATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' NOT NULL, -- registered, waitlisted, cancelled
  registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- â”€â”€â”€ 5. BLOGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  read_time INTEGER DEFAULT 5 NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 6. CERTIFICATES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  type certificate_type NOT NULL,
  rank INTEGER,
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 7. ANNOUNCEMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type announcement_type DEFAULT 'info'::announcement_type NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 8. CONTACT MESSAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 9. GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto Create Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Prevent auth signup failure if profile creation fails
  -- auth.service.ts will handle creating the profile on first login
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User can update own, Admin can do anything
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Public read, Admin write
CREATE POLICY "Events are viewable by everyone." ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events." ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Registrations: Users can read own, Users can insert own, Admin write
CREATE POLICY "Users view own registrations." ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register." ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel registration." ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Blogs: Public read if published, Admin write
CREATE POLICY "Published blogs viewable by everyone." ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage blogs." ON blogs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Certificates: Public read (for verification), Admin write
CREATE POLICY "Certificates are viewable by everyone." ON certificates FOR SELECT USING (true);
CREATE POLICY "Admins can issue certificates." ON certificates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin'))
);

-- Announcements: Public read, Admin write
CREATE POLICY "Announcements are viewable by everyone." ON announcements FOR SELECT USING (true);

-- Contact Messages: Anyone can insert, Admin can read/manage
CREATE POLICY "Anyone can send a contact message." ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages." ON contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Gallery: Public read, Admin write
CREATE POLICY "Gallery viewable by everyone." ON gallery FOR SELECT USING (true);

-- ==============================================================================
-- MIGRATION: 002_cms_settings.sql
-- ==============================================================================

-- ==============================================================================
-- XORVIN â€” Enterprise Supabase Schema - CMS & Settings
-- ==============================================================================

-- â”€â”€â”€ 1. WEBSITE SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 2. FAQS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- â”€â”€â”€ 3. TECHNOLOGY CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE technology_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL
);

-- â”€â”€â”€ 4. CORE VALUES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE core_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- â”€â”€â”€ 5. NAVIGATION LINKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE navigation_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_external BOOLEAN DEFAULT FALSE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  parent_id UUID REFERENCES navigation_links(id) ON DELETE CASCADE
);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at
    BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_links ENABLE ROW LEVEL SECURITY;

-- Public read, Admin write
CREATE POLICY "Website settings are viewable by everyone." ON website_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage website settings." ON website_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "FAQs are viewable by everyone." ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage FAQs." ON faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "Technology categories are viewable by everyone." ON technology_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage technology categories." ON technology_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "Core values are viewable by everyone." ON core_values FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage core values." ON core_values FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "Navigation links are viewable by everyone." ON navigation_links FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage navigation links." ON navigation_links FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- ==============================================================================
-- MIGRATION: 003_rbac_schema.sql
-- ==============================================================================

-- ==============================================================================
-- XORVIN â€” Enterprise RBAC Schema (Part 1: Enums)
-- Run this script first, BEFORE Part 2.
-- PostgreSQL requires new enum values to be committed before they can be used.
-- ==============================================================================

-- Add new roles to the existing user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'event_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'interviewer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'judge';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'mentor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'guest';

-- End of Part 1. Run this now, then proceed to run Part 2.

-- ==============================================================================
-- MIGRATION: 004_rbac_schema_part2.sql
-- ==============================================================================

-- ==============================================================================
-- XORVIN â€” Enterprise RBAC Schema (Part 2: Tables & Seeds)
-- Run this ONLY AFTER you have successfully run Part 1.
-- ==============================================================================

-- â”€â”€â”€ 2. EXTEND PROFILES TABLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS twitter TEXT,
  ADD COLUMN IF NOT EXISTS portfolio TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',       -- active | suspended | banned
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS experience TEXT,                    -- beginner | intermediate | advanced
  ADD COLUMN IF NOT EXISTS skills TEXT[],
  ADD COLUMN IF NOT EXISTS banned_until TIMESTAMPTZ;

-- â”€â”€â”€ 3. PERMISSIONS REGISTRY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS permissions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,    -- e.g. "events:create"
  description TEXT,
  module      TEXT NOT NULL            -- e.g. "events", "users", "content"
);

-- â”€â”€â”€ 4. ROLE TO PERMISSION MAPPING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS role_permissions (
  role          user_role NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- â”€â”€â”€ 5. AUDIT LOGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 6. NOTIFICATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 7. COMMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 8. REPORTS / MODERATION QUEUE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 9. INTERVIEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 10. INTERVIEW FEEDBACK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 11. CAMPUS AMBASSADORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 12. MENTOR SESSIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ 13. BOOKMARKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL,       -- "blog" | "event"
  target_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- â”€â”€â”€ 14. USER BADGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ PERMISSIONS TABLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ AUDIT LOGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- â”€â”€â”€ NOTIFICATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts notifications" ON notifications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users mark own as read" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- â”€â”€â”€ COMMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ REPORTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can submit reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Moderators manage all reports" ON reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator'))
  );

-- â”€â”€â”€ INTERVIEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ INTERVIEW FEEDBACK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ AMBASSADORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ MENTOR SESSIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ BOOKMARKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- â”€â”€â”€ USER BADGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
-- SEED: ROLE â†’ PERMISSION ASSIGNMENTS
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

-- ==============================================================================
-- MIGRATION: 005_phase2_schema.sql
-- ==============================================================================

-- ==============================================================================
-- XORVIN â€” Phase 2 Schema: Judge Submissions, Mentor Resources, Gamification
-- Run AFTER 004_rbac_schema_part2.sql
-- ==============================================================================

-- â”€â”€â”€ 1. SUBMISSIONS (for Judge scoring) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS submissions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id        UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  team_name       TEXT NOT NULL,
  project_title   TEXT NOT NULL,
  description     TEXT,
  demo_url        TEXT,
  repo_url        TEXT,
  presentation_url TEXT,
  technologies    TEXT[],
  submitted_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  submitted_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_finalist     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 2. EVALUATIONS (judge scores per submission) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS evaluations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id   UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  judge_id        UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  innovation      INTEGER CHECK (innovation BETWEEN 1 AND 10),
  technical       INTEGER CHECK (technical BETWEEN 1 AND 10),
  presentation    INTEGER CHECK (presentation BETWEEN 1 AND 10),
  impact          INTEGER CHECK (impact BETWEEN 1 AND 10),
  overall         INTEGER CHECK (overall BETWEEN 1 AND 10),
  comments        TEXT,
  is_approved     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(submission_id, judge_id)
);

-- â”€â”€â”€ 3. MENTOR RESOURCES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS mentor_resources (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  url         TEXT NOT NULL,
  resource_type TEXT DEFAULT 'link', -- link | pdf | video | github
  is_public   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 4. LEARNING PLANS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS learning_plans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  goals       TEXT[],
  status      TEXT DEFAULT 'active', -- active | completed | paused
  due_date    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 5. ASSIGNMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS assignments (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id         UUID REFERENCES learning_plans(id) ON DELETE CASCADE,
  mentor_id       UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id       UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  due_date        TIMESTAMPTZ,
  status          TEXT DEFAULT 'pending', -- pending | submitted | reviewed
  submission_url  TEXT,
  grade           INTEGER,
  feedback        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 6. INTERVIEW NOTES (rich notes per session) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS interview_notes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id  UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  content       TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(interview_id)
);

-- â”€â”€â”€ 7. ACTIVITY LOG (member activity timeline) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action      TEXT NOT NULL, -- "registered_event" | "earned_badge" | "completed_session" | etc.
  target_type TEXT,
  target_id   TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 8. XP TRANSACTIONS (gamification) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS xp_transactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount      INTEGER NOT NULL,
  reason      TEXT NOT NULL,
  source_type TEXT, -- "event" | "badge" | "interview" | "referral" | "session"
  source_id   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 9. AMBASSADOR REFERRAL TRACKING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS referrals (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  converted     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Submissions public read" ON submissions FOR SELECT USING (true);
CREATE POLICY "Auth users can submit" ON submissions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Judges and admins manage submissions" ON submissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'judge'))
  );

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Judges see own evaluations" ON evaluations
  FOR SELECT USING (
    auth.uid() = judge_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
CREATE POLICY "Judges submit evaluations" ON evaluations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'judge'))
  );
CREATE POLICY "Judges update own evaluations" ON evaluations
  FOR UPDATE USING (auth.uid() = judge_id);

ALTER TABLE mentor_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public resources are readable" ON mentor_resources
  FOR SELECT USING (is_public = true OR auth.uid() = mentor_id);
CREATE POLICY "Mentors manage own resources" ON mentor_resources
  FOR ALL USING (auth.uid() = mentor_id);

ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors and mentees see own plans" ON learning_plans
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY "Mentors create plans" ON learning_plans
  FOR INSERT WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "Mentors update plans" ON learning_plans
  FOR UPDATE USING (auth.uid() = mentor_id);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors and mentees see own assignments" ON assignments
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY "Mentors create assignments" ON assignments
  FOR INSERT WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "Anyone involved can update" ON assignments
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Interviewers see own notes" ON interview_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM interviews WHERE interviews.id = interview_id AND interviews.interviewer_id = auth.uid()
    ) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
CREATE POLICY "Interviewers manage notes" ON interview_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM interviews WHERE interviews.id = interview_id AND interviews.interviewer_id = auth.uid()
    )
  );

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own activity" ON activity_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts activity" ON activity_log
  FOR INSERT WITH CHECK (true);

ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own XP" ON xp_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts XP" ON xp_transactions
  FOR INSERT WITH CHECK (true);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ambassadors see own referrals" ON referrals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM ambassadors WHERE ambassadors.id = ambassador_id AND ambassadors.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
CREATE POLICY "System inserts referrals" ON referrals
  FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- HELPER: Auto-update evaluations updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_evaluations_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations FOR EACH ROW EXECUTE FUNCTION update_evaluations_updated_at();

-- ==============================================================================
-- MIGRATION: 006_phase3_schema.sql
-- ==============================================================================

-- ==============================================================================
-- XORVIN â€” Enterprise Schema (Phase 3: Admin & Super Admin)
-- Adds Announcements, Gallery Items, Certificates, and Moderation Reports
-- ==============================================================================

-- â”€â”€â”€ 1. ANNOUNCEMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS announcements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  type        TEXT DEFAULT 'info',       -- info | warning | success | alert
  is_active   BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 2. GALLERY ITEMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS gallery_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT NOT NULL,
  category    TEXT DEFAULT 'general',    -- general | hackathons | workshops | community
  status      TEXT DEFAULT 'pending',    -- pending | approved | rejected
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- â”€â”€â”€ 3. CERTIFICATES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CREATE TABLE IF NOT EXISTS certificates (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id          UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  type              TEXT NOT NULL,             -- participation | winner | mentor | organizer
  issued_by         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  pdf_url           TEXT,
  -- Human-readable unique verification code: XRVN-YYYY-XXXXXXXX
  verification_code TEXT UNIQUE DEFAULT (
    'XRVN-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8))
  ),
  issued_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id, type)
);

-- ==============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- ANNOUNCEMENTS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Announcements public read" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator'))
);

-- GALLERY ITEMS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery public read approved" ON gallery_items FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can upload gallery items" ON gallery_items FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Admins manage gallery items" ON gallery_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator', 'content_manager'))
);

-- CERTIFICATES
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all certificates" ON certificates FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'event_manager'))
);
CREATE POLICY "Admins issue certificates" ON certificates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'event_manager'))
);

-- ==============================================================================
-- MIGRATION: 007_seed_events.sql
-- ==============================================================================

-- Update the Unstop event
UPDATE public.events 
SET status = 'completed'::event_status, 
    registered_count = 1,
    description = 'Registration closed. Round 1 also completed.
    
Link: https://unstop.com/p/xorvin-tech-challenge-2026-xorvin-1710595'
WHERE slug = 'xorvin-tech-challenge-2026';

-- Insert the HackerRank event
INSERT INTO public.events (
  slug, title, subtitle, description, category, status, cover_image, 
  start_date, end_date, registration_deadline, venue, is_virtual, 
  registered_count, prize_pool, organizer
) VALUES (
  'xorvin-coding-sprint-2026', 
  'XORVIN Coding Sprint 2026!', 
  'Solve 50 programs in Java, Python, and SQL', 
  'XORVIN Coding Sprint 2026! Platform: HackerRank. 50 programs to solve using languages like Java, Python, and SQL.
  
Link: https://www.hackerrank.com/xorvin-community', 
  'competition'::event_category, 
  'ongoing'::event_status, 
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80', 
  '2026-07-06T00:00:00Z', 
  '2026-07-31T23:59:00Z', 
  '2026-07-31T23:59:00Z', 
  'HackerRank', 
  true, 
  0, 
  '', 
  'Xorvin'
) ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- SEED DATA: seed.sql
-- ==============================================================================

-- ==============================================================================
-- XORVIN â€” Factual Seed Data (2026)
-- No mock users, no mock events, no mock statistics.
-- ==============================================================================

-- â”€â”€â”€ 1. WEBSITE SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO website_settings (key, value, description) VALUES
('organization_profile', '{"name": "Xorvin", "foundedYear": 2026, "country": "India", "type": "Global Technology Community", "email": "official.xorvin@gmail.com"}', 'Core organization facts'),
('mission', '{"text": "Empowering innovators through technology, collaboration, and competition."}', 'Organization Mission'),
('vision', '{"text": "To become one of the world''s most trusted technology communities."}', 'Organization Vision'),
('social_platforms', '{"linkedin": "https://linkedin.com/company/xorvin", "instagram": "https://instagram.com/xorvin", "twitter": "https://twitter.com/xorvin", "github": "https://github.com/xorvin"}', 'Official Social Links'),
('homepage_hero', '{"tagline": "Innovate. Compete. Elevate.", "headline": "Build the Future with Xorvin", "subheadline": "A global technology community empowering innovators through competitions, collaboration, and continuous learning."}', 'Hero section copy'),
('seo_metadata', '{"defaultTitle": "Xorvin â€” Innovate. Compete. Elevate.", "defaultDescription": "Xorvin is a global technology community headquartered in India, dedicated to empowering innovators through competitions, collaboration, and continuous learning."}', 'Global SEO defaults');

-- â”€â”€â”€ 2. TECHNOLOGY CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO technology_categories (id, name, icon, color, order_index) VALUES
('ai', 'Artificial Intelligence', 'ðŸ¤–', '#007BFF', 1),
('ml', 'Machine Learning', 'ðŸ§ ', '#30D5FF', 2),
('cybersec', 'Cybersecurity', 'ðŸ”’', '#FF4757', 3),
('programming', 'Programming', 'ðŸ’»', '#2ED573', 4),
('web', 'Web Development', 'ðŸŒ', '#FFA502', 5),
('mobile', 'Mobile Dev', 'ðŸ“±', '#FF6B81', 6),
('cloud', 'Cloud Computing', 'â˜ï¸', '#5352ED', 7),
('devops', 'DevOps', 'âš™ï¸', '#00D2D3', 8),
('blockchain', 'Blockchain', 'â›“ï¸', '#F9CA24', 9),
('data', 'Data Science', 'ðŸ“Š', '#55EFC4', 10);

-- â”€â”€â”€ 3. CORE VALUES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO core_values (title, description, icon, order_index) VALUES
('Innovation', 'We believe in challenging the status quo and building solutions that matter â€” one problem at a time.', 'ðŸš€', 1),
('Collaboration', 'The best ideas emerge when diverse minds work together. We foster an open, inclusive environment.', 'ðŸ¤', 2),
('Excellence', 'We set high standards for ourselves and inspire every community member to grow and exceed their limits.', 'ðŸ†', 3),
('Inclusivity', 'Technology belongs to everyone. Xorvin welcomes participants of all backgrounds and skill levels.', 'ðŸŒ', 4),
('Continuous Learning', 'Growth never stops. We are committed to sharing knowledge, mentorship, and lifelong education.', 'ðŸ“š', 5),
('Transparency', 'We operate with openness and honesty â€” from how events are run to how decisions are made.', 'ðŸ”“', 6);

-- â”€â”€â”€ 4. FAQS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO faqs (question, answer, order_index) VALUES
('What is Xorvin?', 'Xorvin is a global technology community founded in India in 2026. Our mission is to empower innovators through technology competitions, collaborative learning, and community-driven programs.', 1),
('How do I join Xorvin?', 'Simply create a free account. Once registered, you can browse events, register for competitions, and access resources.', 2),
('Is Xorvin free to join?', 'Yes! Joining the Xorvin community is completely free. Our current events are also free to participate in.', 3),
('Can I participate from anywhere in the world?', 'Absolutely. Xorvin is a global community. Our current competitions are hosted online on Unstop, open to participants from anywhere in the world.', 4),
('How do I register for the Xorvin Tech Challenge 2026?', 'Visit our Events page and click the registration link for the Xorvin Tech Challenge 2026 on Unstop. Registration is open from 1 July to 8 July 2026.', 5),
('Are certificates provided for participation?', 'Yes. Winners of Xorvin competitions receive verified digital certificates. Participation certificates will be available for qualifying events as our program grows.', 6),
('How can my company partner with Xorvin?', 'We are actively seeking our founding partners. Visit our Partners page or contact us at official.xorvin@gmail.com to discuss collaboration opportunities.', 7);

-- â”€â”€â”€ 5. ADMIN PROFILE (SYSTEM) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Insert a system profile so blogs can have an author.
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000000', 'official.xorvin@gmail.com') ON CONFLICT DO NOTHING;
INSERT INTO profiles (id, name, username, role, bio) VALUES ('00000000-0000-0000-0000-000000000000', 'Xorvin Editorial', 'xorvin_official', 'admin', 'Official Xorvin Communications') ON CONFLICT DO NOTHING;

-- â”€â”€â”€ 6. EVENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO events (
  id, slug, title, subtitle, description, category, status, cover_image, 
  start_date, end_date, registration_deadline, venue, is_virtual, organizer, prize_pool
) VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'xorvin-tech-challenge-2026', 
  'Xorvin Tech Challenge 2026', 
  'Our Inaugural Competition', 
  'Join us for the very first Xorvin Tech Challenge. Test your skills, collaborate with peers, and establish your presence in the global tech community.', 
  'competition', 
  'ongoing', 
  '/assets/brand/xorvin-poster.jpg', 
  '2026-07-09T00:00:00Z', 
  '2026-07-15T23:59:00Z', 
  '2026-07-08T23:59:00Z', 
  'Unstop', 
  true, 
  'Xorvin',
  'Winner Certificate'
);

-- â”€â”€â”€ 7. BLOGS (EVERGREEN CONTENT) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO blogs (slug, title, excerpt, content, cover_image, author_id, category, is_published, published_at) VALUES
(
  'what-is-artificial-intelligence',
  'What is Artificial Intelligence?',
  'An introduction to AI, how it works, and why it is transforming the modern technology landscape.',
  '# What is Artificial Intelligence?\n\nArtificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions...',
  '/assets/blog/ai.jpg',
  '00000000-0000-0000-0000-000000000000',
  'Artificial Intelligence',
  true,
  NOW()
),
(
  'cybersecurity-best-practices-students',
  'Cybersecurity Best Practices for Students',
  'Essential security tips every computer science student should know to protect their projects and identity.',
  '# Cybersecurity Best Practices for Students\n\nIn an increasingly digital world, securing your data is paramount...',
  '/assets/blog/cyber.jpg',
  '00000000-0000-0000-0000-000000000000',
  'Cybersecurity',
  true,
  NOW()
),
(
  'how-to-prepare-technical-competitions',
  'How to Prepare for Technical Competitions',
  'A strategic guide to succeeding in hackathons, coding challenges, and tech competitions.',
  '# Preparing for Technical Competitions\n\nCompetitions like the Xorvin Tech Challenge require preparation, teamwork, and a strategic mindset...',
  '/assets/blog/comp.jpg',
  '00000000-0000-0000-0000-000000000000',
  'Career',
  true,
  NOW()
),
(
  'introduction-to-cloud-computing',
  'Introduction to Cloud Computing',
  'Demystifying the cloud: What it is, how it works, and why developers rely on it.',
  '# Introduction to Cloud Computing\n\nCloud computing is the delivery of computing servicesâ€”including servers, storage, databases, networking, software, analytics, and intelligenceâ€”over the Internet...',
  '/assets/blog/cloud.jpg',
  '00000000-0000-0000-0000-000000000000',
  'Cloud Computing',
  true,
  NOW()
),
(
  'version-control-git-github',
  'Version Control with Git and GitHub',
  'Learn the fundamentals of version control and how to collaborate effectively on code.',
  '# Version Control with Git and GitHub\n\nVersion control systems are a category of software tools that help a software team manage changes to source code over time...',
  '/assets/blog/git.jpg',
  '00000000-0000-0000-0000-000000000000',
  'Web Development',
  true,
  NOW()
),
(
  'career-roadmaps-software-engineering',
  'Career Roadmaps in Software Engineering',
  'Navigating the paths to becoming a frontend, backend, or full-stack developer.',
  '# Career Roadmaps in Software Engineering\n\nSoftware engineering is a broad field. Choosing a path can be daunting. This guide will outline the core skills needed for various roles...',
  '/assets/blog/career.jpg',
  '00000000-0000-0000-0000-000000000000',
  'Career',
  true,
  NOW()
);


-- ==============================================================================
-- XORVIN â€” Application Queries (used by React pages & services)
-- Reference only â€” these run via Supabase JS client, not directly in SQL editor.
-- ==============================================================================

-- â”€â”€â”€ PUBLIC PAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

-- /events â€” EventsPage
-- SELECT * FROM events ORDER BY start_date ASC;

-- /events/:slug â€” EventDetailPage
-- SELECT * FROM events WHERE slug = :slug LIMIT 1;

-- /blog â€” BlogPage (service available; page currently uses sample data)
-- SELECT *, author:author_id(name, avatar_url, role)
-- FROM blogs WHERE is_published = true ORDER BY published_at DESC;

-- /blog/:slug â€” BlogDetailPage (service available; page currently uses sample data)
-- SELECT *, author:author_id(name, avatar_url, role, bio)
-- FROM blogs WHERE slug = :slug LIMIT 1;

-- /gallery â€” GalleryPage (service available; page currently uses sample data)
-- SELECT * FROM gallery ORDER BY created_at DESC;

-- /leaderboard â€” LeaderboardPage (service available; page currently uses sample data)
-- SELECT id, name, username, avatar_url, college, country, points, wins, events_participated
-- FROM profiles ORDER BY points DESC LIMIT 100;

-- /certificates/verify â€” VerifyPage
-- SELECT id, certificate_id, type, rank, issued_at,
--        user:user_id(name, email), event:event_id(title, start_date)
-- FROM certificates WHERE certificate_id = :certificateId LIMIT 1;

-- /contact â€” ContactPage (service available; page currently uses local state only)
-- INSERT INTO contact_messages (name, email, subject, message) VALUES (...);

-- /profile â€” ProfilePage
-- SELECT *, event:event_id(title, slug, start_date, cover_image)
-- FROM event_registrations WHERE user_id = :userId ORDER BY registered_at DESC;
-- SELECT id, points FROM profiles ORDER BY points DESC;

-- /profile/edit â€” EditProfilePage
-- UPDATE profiles SET name, username, bio, college, country, github, linkedin, twitter, portfolio
-- WHERE id = :userId;

-- /profile/settings â€” SettingsPage
-- (Auth API) UPDATE auth.users password via supabase.auth.updateUser

-- â”€â”€â”€ AUTH PAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

-- /auth/login
-- supabase.auth.signInWithPassword({ email, password })
-- SELECT role FROM profiles WHERE id = :userId LIMIT 1;

-- /auth/register
-- supabase.auth.signUp({ email, password, options: { data: { full_name, username } } })

-- /auth/forgot-password
-- supabase.auth.resetPasswordForEmail(email)

-- /auth/callback
-- supabase.auth.getSession() / onAuthStateChange

-- â”€â”€â”€ ADMIN PAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

-- /admin â€” AdminDashboard (currently sample data; no live queries)

-- /admin/users â€” UsersManagement
-- SELECT * FROM profiles ORDER BY created_at DESC;
-- UPDATE profiles SET role = :role WHERE id = :id;
-- INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata) VALUES (...);

-- /admin/blogs â€” BlogsManagement
-- SELECT *, author:author_id(name, avatar_url, role) FROM blogs WHERE is_published = true ORDER BY published_at DESC;

-- /admin/certificates â€” CertificatesManagement
-- SELECT *, user:user_id(name, email), event:event_id(title) FROM certificates ORDER BY issued_at DESC;
-- SELECT id, title FROM events ORDER BY created_at DESC;
-- SELECT id FROM profiles WHERE email = :email LIMIT 1;
-- INSERT INTO certificates (user_id, event_id, type, rank) VALUES (...);

-- /admin/announcements â€” AnnouncementsManagement
-- SELECT *, profiles(name) FROM announcements ORDER BY created_at DESC;
-- INSERT/UPDATE/DELETE announcements

-- /admin/gallery â€” GalleryManagement
-- SELECT *, profiles(name) FROM gallery_items ORDER BY created_at DESC;
-- INSERT/UPDATE/DELETE gallery_items
-- Storage: upload to 'media' bucket

-- /admin/contact â€” ContactMessages
-- SELECT * FROM contact_messages ORDER BY created_at DESC;

-- /admin/reports â€” ReportsManagement
-- SELECT *, profiles!reporter_id(name, email) FROM reports ORDER BY created_at DESC;
-- UPDATE reports SET status, reviewed_by, reviewed_at WHERE id = :id;
-- DELETE FROM reports WHERE id = :id;

-- /admin/leaderboard â€” LeaderboardManagement
-- SELECT id, name, username, points, wins, events_participated FROM profiles ORDER BY points DESC;

-- â”€â”€â”€ ROLE DASHBOARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

-- /super-admin â€” SuperAdminDashboard
-- SELECT COUNT(*) FROM profiles; SELECT COUNT(*) FROM events;
-- SELECT COUNT(*) FROM blogs; SELECT COUNT(*) FROM audit_logs;
-- SELECT created_at FROM profiles ORDER BY created_at;
-- SELECT *, actor:actor_id(name) FROM audit_logs ORDER BY created_at DESC LIMIT 20;

-- /moderator â€” ModeratorDashboard
-- SELECT COUNT(*) FROM reports WHERE status = 'pending';
-- SELECT COUNT(*) FROM comments WHERE is_flagged = true;
-- SELECT *, profiles!reporter_id(name, email) FROM reports ORDER BY created_at DESC LIMIT 10;
-- UPDATE reports SET status WHERE id = :id;

-- /events/manage â€” EventManagerDashboard
-- SELECT * FROM events ORDER BY start_date DESC;

-- /events/manage/new, /events/manage/:id/edit â€” EventWizard
-- SELECT * FROM events WHERE id = :id LIMIT 1;
-- INSERT INTO events (...) VALUES (...);
-- UPDATE events SET ... WHERE id = :id;

-- /events/manage/:id/registrations â€” Registrations
-- SELECT title, slug FROM events WHERE id = :id LIMIT 1;
-- SELECT *, user:user_id(name, email, avatar_url) FROM event_registrations WHERE event_id = :id;

-- /content â€” ContentManagerDashboard
-- SELECT * FROM blogs ORDER BY created_at DESC;

-- /content/blogs/new, /content/blogs/:id/edit â€” BlogEditor
-- SELECT * FROM blogs WHERE id = :id LIMIT 1;
-- INSERT/UPDATE blogs

-- /interviewer â€” InterviewerDashboard
-- SELECT * FROM interviews WHERE interviewer_id = :userId ORDER BY scheduled_at;

-- /interviewer/schedule â€” ScheduleInterview
-- SELECT id, name, username, college FROM profiles ORDER BY name;
-- SELECT id, title FROM events WHERE status IN ('upcoming','ongoing') ORDER BY title;
-- INSERT INTO interviews (...) VALUES (...);

-- /interviewer/candidates â€” CandidateDatabase
-- SELECT id, name, username, college, skills, experience FROM profiles ORDER BY name;
-- SELECT * FROM interviews WHERE candidate_id = :candidateId;

-- /interviewer/evaluate/:id â€” EvaluationForm
-- SELECT *, candidate:candidate_id(name, username), event:event_id(title)
-- FROM interviews WHERE id = :id LIMIT 1;
-- INSERT INTO interview_feedback (...) VALUES (...);

-- /judge â€” JudgeDashboard
-- SELECT * FROM events WHERE status IN ('ongoing','completed') ORDER BY start_date DESC;

-- /judge/submissions/:eventId â€” SubmissionViewer
-- SELECT title, slug FROM events WHERE id = :eventId LIMIT 1;
-- SELECT * FROM submissions WHERE event_id = :eventId;
-- INSERT/UPDATE evaluations

-- /ambassador â€” AmbassadorDashboard
-- SELECT * FROM ambassadors WHERE user_id = :userId LIMIT 1;
-- SELECT * FROM referrals WHERE ambassador_id = :ambassadorId;
-- SELECT id, title, start_date, slug, registered_count FROM events
-- WHERE status IN ('upcoming','ongoing') LIMIT 5;

-- /mentor â€” MentorDashboard
-- SELECT * FROM mentor_sessions WHERE mentor_id = :userId;
-- SELECT * FROM mentor_resources WHERE mentor_id = :userId;
-- SELECT * FROM learning_plans WHERE mentor_id = :userId;
-- SELECT * FROM assignments WHERE mentor_id = :userId;
-- INSERT/UPDATE mentor_sessions, mentor_resources, activity_log, notifications

-- â”€â”€â”€ HOOKS & COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

-- useGamification: xp_transactions, user_badges, activity_log, profiles
-- useBookmarks: bookmarks (SELECT/INSERT/DELETE)
-- useSubmissions: submissions, evaluations, xp_transactions
-- useInterviews: interviews, interview_feedback, interview_notes, profiles, xp_transactions, activity_log
-- useNotifications: notifications (SELECT/UPDATE/DELETE + realtime channel)
-- useAuditLog: audit_logs INSERT
-- CommandPalette: profiles, events, blogs (ilike search)

-- â”€â”€â”€ STORAGE BUCKETS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- media â€” used by Admin GalleryManagement for image uploads
