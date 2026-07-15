-- ==============================================================================
-- XORVIN — Phase 2 Schema: Judge Submissions, Mentor Resources, Gamification
-- Run AFTER 004_rbac_schema_part2.sql
-- ==============================================================================

-- ─── 1. SUBMISSIONS (for Judge scoring) ───────────────────────────────────────
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

-- ─── 2. EVALUATIONS (judge scores per submission) ─────────────────────────────
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

-- ─── 3. MENTOR RESOURCES ──────────────────────────────────────────────────────
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

-- ─── 4. LEARNING PLANS ────────────────────────────────────────────────────────
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

-- ─── 5. ASSIGNMENTS ───────────────────────────────────────────────────────────
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

-- ─── 6. INTERVIEW NOTES (rich notes per session) ──────────────────────────────
CREATE TABLE IF NOT EXISTS interview_notes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id  UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  content       TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(interview_id)
);

-- ─── 7. ACTIVITY LOG (member activity timeline) ───────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action      TEXT NOT NULL, -- "registered_event" | "earned_badge" | "completed_session" | etc.
  target_type TEXT,
  target_id   TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. XP TRANSACTIONS (gamification) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_transactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount      INTEGER NOT NULL,
  reason      TEXT NOT NULL,
  source_type TEXT, -- "event" | "badge" | "interview" | "referral" | "session"
  source_id   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. AMBASSADOR REFERRAL TRACKING ─────────────────────────────────────────
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
