-- ==============================================================================
-- XORVIN — Enterprise Supabase Schema - CMS & Settings
-- ==============================================================================

-- ─── 1. WEBSITE SETTINGS ──────────────────────────────────────────────────────
CREATE TABLE website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── 2. FAQS ──────────────────────────────────────────────────────────────────
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── 3. TECHNOLOGY CATEGORIES ─────────────────────────────────────────────────
CREATE TABLE technology_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL
);

-- ─── 4. CORE VALUES ───────────────────────────────────────────────────────────
CREATE TABLE core_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ─── 5. NAVIGATION LINKS ──────────────────────────────────────────────────────
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
