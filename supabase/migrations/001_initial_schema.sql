-- ==============================================================================
-- XORVIN — Enterprise Supabase Schema
-- ==============================================================================

-- ─── 1. ENUMS ─────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'member', 'ambassador');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE event_category AS ENUM ('hackathon', 'competition', 'workshop', 'conference', 'bootcamp', 'ctf', 'ai-challenge', 'startup', 'open-source');
CREATE TYPE certificate_type AS ENUM ('participation', 'winner', 'speaker', 'volunteer', 'completion');
CREATE TYPE announcement_type AS ENUM ('info', 'warning', 'success', 'event');

-- ─── 2. PROFILES ──────────────────────────────────────────────────────────────
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

-- ─── 3. EVENTS ────────────────────────────────────────────────────────────────
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

-- ─── 4. EVENT REGISTRATIONS ───────────────────────────────────────────────────
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' NOT NULL, -- registered, waitlisted, cancelled
  registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- ─── 5. BLOGS ─────────────────────────────────────────────────────────────────
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

-- ─── 6. CERTIFICATES ──────────────────────────────────────────────────────────
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  type certificate_type NOT NULL,
  rank INTEGER,
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── 7. ANNOUNCEMENTS ─────────────────────────────────────────────────────────
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

-- ─── 8. CONTACT MESSAGES ──────────────────────────────────────────────────────
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── 9. GALLERY ───────────────────────────────────────────────────────────────
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
