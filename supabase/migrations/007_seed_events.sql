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
