-- ==============================================================================
-- XORVIN — Enterprise Schema (Phase 3: Admin & Super Admin)
-- Adds Announcements, Gallery Items, Certificates, and Moderation Reports
-- ==============================================================================

-- ─── 1. ANNOUNCEMENTS ─────────────────────────────────────────────────────────
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

-- ─── 2. GALLERY ITEMS ─────────────────────────────────────────────────────────
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

-- ─── 3. CERTIFICATES ──────────────────────────────────────────────────────────
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
