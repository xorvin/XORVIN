-- ==============================================================================
-- XORVIN — Factual Seed Data (2026)
-- No mock users, no mock events, no mock statistics.
-- ==============================================================================

-- ─── 1. WEBSITE SETTINGS ──────────────────────────────────────────────────────
INSERT INTO website_settings (key, value, description) VALUES
('organization_profile', '{"name": "Xorvin", "foundedYear": 2026, "country": "India", "type": "Global Technology Community", "email": "official.xorvin@gmail.com"}', 'Core organization facts'),
('mission', '{"text": "Empowering innovators through technology, collaboration, and competition."}', 'Organization Mission'),
('vision', '{"text": "To become one of the world''s most trusted technology communities."}', 'Organization Vision'),
('social_platforms', '{"linkedin": "https://linkedin.com/company/xorvin", "instagram": "https://instagram.com/xorvin", "twitter": "https://twitter.com/xorvin", "github": "https://github.com/xorvin"}', 'Official Social Links'),
('homepage_hero', '{"tagline": "Innovate. Compete. Elevate.", "headline": "Build the Future with Xorvin", "subheadline": "A global technology community empowering innovators through competitions, collaboration, and continuous learning."}', 'Hero section copy'),
('seo_metadata', '{"defaultTitle": "Xorvin — Innovate. Compete. Elevate.", "defaultDescription": "Xorvin is a global technology community headquartered in India, dedicated to empowering innovators through competitions, collaboration, and continuous learning."}', 'Global SEO defaults');

-- ─── 2. TECHNOLOGY CATEGORIES ─────────────────────────────────────────────────
INSERT INTO technology_categories (id, name, icon, color, order_index) VALUES
('ai', 'Artificial Intelligence', '🤖', '#007BFF', 1),
('ml', 'Machine Learning', '🧠', '#30D5FF', 2),
('cybersec', 'Cybersecurity', '🔒', '#FF4757', 3),
('programming', 'Programming', '💻', '#2ED573', 4),
('web', 'Web Development', '🌐', '#FFA502', 5),
('mobile', 'Mobile Dev', '📱', '#FF6B81', 6),
('cloud', 'Cloud Computing', '☁️', '#5352ED', 7),
('devops', 'DevOps', '⚙️', '#00D2D3', 8),
('blockchain', 'Blockchain', '⛓️', '#F9CA24', 9),
('data', 'Data Science', '📊', '#55EFC4', 10);

-- ─── 3. CORE VALUES ───────────────────────────────────────────────────────────
INSERT INTO core_values (title, description, icon, order_index) VALUES
('Innovation', 'We believe in challenging the status quo and building solutions that matter — one problem at a time.', '🚀', 1),
('Collaboration', 'The best ideas emerge when diverse minds work together. We foster an open, inclusive environment.', '🤝', 2),
('Excellence', 'We set high standards for ourselves and inspire every community member to grow and exceed their limits.', '🏆', 3),
('Inclusivity', 'Technology belongs to everyone. Xorvin welcomes participants of all backgrounds and skill levels.', '🌍', 4),
('Continuous Learning', 'Growth never stops. We are committed to sharing knowledge, mentorship, and lifelong education.', '📚', 5),
('Transparency', 'We operate with openness and honesty — from how events are run to how decisions are made.', '🔓', 6);

-- ─── 4. FAQS ──────────────────────────────────────────────────────────────────
INSERT INTO faqs (question, answer, order_index) VALUES
('What is Xorvin?', 'Xorvin is a global technology community founded in India in 2026. Our mission is to empower innovators through technology competitions, collaborative learning, and community-driven programs.', 1),
('How do I join Xorvin?', 'Simply create a free account. Once registered, you can browse events, register for competitions, and access resources.', 2),
('Is Xorvin free to join?', 'Yes! Joining the Xorvin community is completely free. Our current events are also free to participate in.', 3),
('Can I participate from anywhere in the world?', 'Absolutely. Xorvin is a global community. Our current competitions are hosted online on Unstop, open to participants from anywhere in the world.', 4),
('How do I register for the Xorvin Tech Challenge 2026?', 'Visit our Events page and click the registration link for the Xorvin Tech Challenge 2026 on Unstop. Registration is open from 1 July to 8 July 2026.', 5),
('Are certificates provided for participation?', 'Yes. Winners of Xorvin competitions receive verified digital certificates. Participation certificates will be available for qualifying events as our program grows.', 6),
('How can my company partner with Xorvin?', 'We are actively seeking our founding partners. Visit our Partners page or contact us at official.xorvin@gmail.com to discuss collaboration opportunities.', 7);

-- ─── 5. ADMIN PROFILE (SYSTEM) ────────────────────────────────────────────────
-- Insert a system profile so blogs can have an author.
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000000', 'official.xorvin@gmail.com') ON CONFLICT DO NOTHING;
INSERT INTO profiles (id, name, username, role, bio) VALUES ('00000000-0000-0000-0000-000000000000', 'Xorvin Editorial', 'xorvin_official', 'admin', 'Official Xorvin Communications') ON CONFLICT DO NOTHING;

-- ─── 6. EVENTS ────────────────────────────────────────────────────────────────
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

-- ─── 7. BLOGS (EVERGREEN CONTENT) ─────────────────────────────────────────────
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
  '# Introduction to Cloud Computing\n\nCloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet...',
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
