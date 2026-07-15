-- ==============================================================================
-- XORVIN — Phase 0: Tables for skipped pages (create only if missing)
-- Run after 001–007. Safe to re-run (IF NOT EXISTS).
-- ==============================================================================

-- ─── PARTNERS (Home, /partners) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  logo_url    TEXT,
  website_url TEXT,
  tier        TEXT DEFAULT 'community',  -- platinum | gold | silver | community
  description TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── TESTIMONIALS (Home) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT,
  company     TEXT,
  avatar_url  TEXT,
  quote       TEXT NOT NULL,
  rating      INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── SPEAKERS (About, Event detail) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS speakers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  title       TEXT,
  company     TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  event_id    UUID REFERENCES events(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partners' AND policyname = 'Partners public read') THEN
    CREATE POLICY "Partners public read" ON partners FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partners' AND policyname = 'Admins manage partners') THEN
    CREATE POLICY "Admins manage partners" ON partners FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator', 'content_manager'))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Testimonials public read') THEN
    CREATE POLICY "Testimonials public read" ON testimonials FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Admins manage testimonials') THEN
    CREATE POLICY "Admins manage testimonials" ON testimonials FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator', 'content_manager'))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'speakers' AND policyname = 'Speakers public read') THEN
    CREATE POLICY "Speakers public read" ON speakers FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'speakers' AND policyname = 'Admins manage speakers') THEN
    CREATE POLICY "Admins manage speakers" ON speakers FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator', 'content_manager', 'event_manager'))
    );
  END IF;
END $$;
