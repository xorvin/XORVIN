-- ==============================================================================
-- XORVIN — Application Queries (used by React pages & services)
-- Reference only — these run via Supabase JS client, not directly in SQL editor.
-- ==============================================================================

-- ─── PUBLIC PAGES ─────────────────────────────────────────────────────────────

-- /events — EventsPage
-- SELECT * FROM events ORDER BY start_date ASC;

-- /events/:slug — EventDetailPage
-- SELECT * FROM events WHERE slug = :slug LIMIT 1;

-- /blog — BlogPage (service available; page currently uses sample data)
-- SELECT *, author:author_id(name, avatar_url, role)
-- FROM blogs WHERE is_published = true ORDER BY published_at DESC;

-- /blog/:slug — BlogDetailPage (service available; page currently uses sample data)
-- SELECT *, author:author_id(name, avatar_url, role, bio)
-- FROM blogs WHERE slug = :slug LIMIT 1;

-- /gallery — GalleryPage (service available; page currently uses sample data)
-- SELECT * FROM gallery ORDER BY created_at DESC;

-- /leaderboard — LeaderboardPage (service available; page currently uses sample data)
-- SELECT id, name, username, avatar_url, college, country, points, wins, events_participated
-- FROM profiles ORDER BY points DESC LIMIT 100;

-- /certificates/verify — VerifyPage
-- SELECT id, certificate_id, type, rank, issued_at,
--        user:user_id(name, email), event:event_id(title, start_date)
-- FROM certificates WHERE certificate_id = :certificateId LIMIT 1;

-- /contact — ContactPage (service available; page currently uses local state only)
-- INSERT INTO contact_messages (name, email, subject, message) VALUES (...);

-- /profile — ProfilePage
-- SELECT *, event:event_id(title, slug, start_date, cover_image)
-- FROM event_registrations WHERE user_id = :userId ORDER BY registered_at DESC;
-- SELECT id, points FROM profiles ORDER BY points DESC;

-- /profile/edit — EditProfilePage
-- UPDATE profiles SET name, username, bio, college, country, github, linkedin, twitter, portfolio
-- WHERE id = :userId;

-- /profile/settings — SettingsPage
-- (Auth API) UPDATE auth.users password via supabase.auth.updateUser

-- ─── AUTH PAGES ───────────────────────────────────────────────────────────────

-- /auth/login
-- supabase.auth.signInWithPassword({ email, password })
-- SELECT role FROM profiles WHERE id = :userId LIMIT 1;

-- /auth/register
-- supabase.auth.signUp({ email, password, options: { data: { full_name, username } } })

-- /auth/forgot-password
-- supabase.auth.resetPasswordForEmail(email)

-- /auth/callback
-- supabase.auth.getSession() / onAuthStateChange

-- ─── ADMIN PAGES ──────────────────────────────────────────────────────────────

-- /admin — AdminDashboard (currently sample data; no live queries)

-- /admin/users — UsersManagement
-- SELECT * FROM profiles ORDER BY created_at DESC;
-- UPDATE profiles SET role = :role WHERE id = :id;
-- INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata) VALUES (...);

-- /admin/blogs — BlogsManagement
-- SELECT *, author:author_id(name, avatar_url, role) FROM blogs WHERE is_published = true ORDER BY published_at DESC;

-- /admin/certificates — CertificatesManagement
-- SELECT *, user:user_id(name, email), event:event_id(title) FROM certificates ORDER BY issued_at DESC;
-- SELECT id, title FROM events ORDER BY created_at DESC;
-- SELECT id FROM profiles WHERE email = :email LIMIT 1;
-- INSERT INTO certificates (user_id, event_id, type, rank) VALUES (...);

-- /admin/announcements — AnnouncementsManagement
-- SELECT *, profiles(name) FROM announcements ORDER BY created_at DESC;
-- INSERT/UPDATE/DELETE announcements

-- /admin/gallery — GalleryManagement
-- SELECT *, profiles(name) FROM gallery_items ORDER BY created_at DESC;
-- INSERT/UPDATE/DELETE gallery_items
-- Storage: upload to 'media' bucket

-- /admin/contact — ContactMessages
-- SELECT * FROM contact_messages ORDER BY created_at DESC;

-- /admin/reports — ReportsManagement
-- SELECT *, profiles!reporter_id(name, email) FROM reports ORDER BY created_at DESC;
-- UPDATE reports SET status, reviewed_by, reviewed_at WHERE id = :id;
-- DELETE FROM reports WHERE id = :id;

-- /admin/leaderboard — LeaderboardManagement
-- SELECT id, name, username, points, wins, events_participated FROM profiles ORDER BY points DESC;

-- ─── ROLE DASHBOARDS ──────────────────────────────────────────────────────────

-- /super-admin — SuperAdminDashboard
-- SELECT COUNT(*) FROM profiles; SELECT COUNT(*) FROM events;
-- SELECT COUNT(*) FROM blogs; SELECT COUNT(*) FROM audit_logs;
-- SELECT created_at FROM profiles ORDER BY created_at;
-- SELECT *, actor:actor_id(name) FROM audit_logs ORDER BY created_at DESC LIMIT 20;

-- /moderator — ModeratorDashboard
-- SELECT COUNT(*) FROM reports WHERE status = 'pending';
-- SELECT COUNT(*) FROM comments WHERE is_flagged = true;
-- SELECT *, profiles!reporter_id(name, email) FROM reports ORDER BY created_at DESC LIMIT 10;
-- UPDATE reports SET status WHERE id = :id;

-- /events/manage — EventManagerDashboard
-- SELECT * FROM events ORDER BY start_date DESC;

-- /events/manage/new, /events/manage/:id/edit — EventWizard
-- SELECT * FROM events WHERE id = :id LIMIT 1;
-- INSERT INTO events (...) VALUES (...);
-- UPDATE events SET ... WHERE id = :id;

-- /events/manage/:id/registrations — Registrations
-- SELECT title, slug FROM events WHERE id = :id LIMIT 1;
-- SELECT *, user:user_id(name, email, avatar_url) FROM event_registrations WHERE event_id = :id;

-- /content — ContentManagerDashboard
-- SELECT * FROM blogs ORDER BY created_at DESC;

-- /content/blogs/new, /content/blogs/:id/edit — BlogEditor
-- SELECT * FROM blogs WHERE id = :id LIMIT 1;
-- INSERT/UPDATE blogs

-- /interviewer — InterviewerDashboard
-- SELECT * FROM interviews WHERE interviewer_id = :userId ORDER BY scheduled_at;

-- /interviewer/schedule — ScheduleInterview
-- SELECT id, name, username, college FROM profiles ORDER BY name;
-- SELECT id, title FROM events WHERE status IN ('upcoming','ongoing') ORDER BY title;
-- INSERT INTO interviews (...) VALUES (...);

-- /interviewer/candidates — CandidateDatabase
-- SELECT id, name, username, college, skills, experience FROM profiles ORDER BY name;
-- SELECT * FROM interviews WHERE candidate_id = :candidateId;

-- /interviewer/evaluate/:id — EvaluationForm
-- SELECT *, candidate:candidate_id(name, username), event:event_id(title)
-- FROM interviews WHERE id = :id LIMIT 1;
-- INSERT INTO interview_feedback (...) VALUES (...);

-- /judge — JudgeDashboard
-- SELECT * FROM events WHERE status IN ('ongoing','completed') ORDER BY start_date DESC;

-- /judge/submissions/:eventId — SubmissionViewer
-- SELECT title, slug FROM events WHERE id = :eventId LIMIT 1;
-- SELECT * FROM submissions WHERE event_id = :eventId;
-- INSERT/UPDATE evaluations

-- /ambassador — AmbassadorDashboard
-- SELECT * FROM ambassadors WHERE user_id = :userId LIMIT 1;
-- SELECT * FROM referrals WHERE ambassador_id = :ambassadorId;
-- SELECT id, title, start_date, slug, registered_count FROM events
-- WHERE status IN ('upcoming','ongoing') LIMIT 5;

-- /mentor — MentorDashboard
-- SELECT * FROM mentor_sessions WHERE mentor_id = :userId;
-- SELECT * FROM mentor_resources WHERE mentor_id = :userId;
-- SELECT * FROM learning_plans WHERE mentor_id = :userId;
-- SELECT * FROM assignments WHERE mentor_id = :userId;
-- INSERT/UPDATE mentor_sessions, mentor_resources, activity_log, notifications

-- ─── HOOKS & COMPONENTS ───────────────────────────────────────────────────────

-- useGamification: xp_transactions, user_badges, activity_log, profiles
-- useBookmarks: bookmarks (SELECT/INSERT/DELETE)
-- useSubmissions: submissions, evaluations, xp_transactions
-- useInterviews: interviews, interview_feedback, interview_notes, profiles, xp_transactions, activity_log
-- useNotifications: notifications (SELECT/UPDATE/DELETE + realtime channel)
-- useAuditLog: audit_logs INSERT
-- CommandPalette: profiles, events, blogs (ilike search)

-- ─── STORAGE BUCKETS ──────────────────────────────────────────────────────────
-- media — used by Admin GalleryManagement for image uploads
