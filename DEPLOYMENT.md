# XORVIN v1.0 Deployment Checklist

This document is the authoritative pre-flight checklist for deploying XORVIN to production.
Complete every step in order before going live.

---

## 1. Prerequisites

- [ ] Node.js 20+ installed
- [ ] Supabase project created at [supabase.com](https://supabase.com)
- [ ] Custom domain configured (e.g. `xorvin.com`)

---

## 2. Environment Variables

Create `.env.production` in the project root with the following:

```env
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App URL (used for SEO, OG tags, verification codes)
VITE_APP_URL=https://xorvin.onrender.com

# Google Analytics 4 (optional — leave blank to disable tracking)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Never commit `.env.production` to version control.**
> Ensure `.env*` is in `.gitignore`.

---

## 3. Database Migration Order

Run the following SQL files **in order** via the Supabase SQL Editor:

```
1. supabase/migrations/001_initial_schema.sql
2. supabase/migrations/002_events_schema.sql
3. supabase/migrations/003_rbac_schema.sql
4. supabase/migrations/004_rbac_schema_part2.sql
5. supabase/migrations/005_phase2_schema.sql
6. supabase/migrations/006_phase3_schema.sql
```

> If using Supabase CLI: `supabase db push`

---

## 4. Supabase Storage Buckets

In the Supabase Dashboard → Storage, create the following buckets:

| Bucket Name  | Public | Description                     |
|--------------|--------|---------------------------------|
| `media`      | ✅ Yes | Gallery images, event assets    |
| `avatars`    | ✅ Yes | User profile pictures           |
| `certificates` | ❌ No | Certificate PDFs (signed URLs)  |

**Bucket Policies:**
- `media`: Allow all authenticated users to upload. Admins to delete.
- `avatars`: Allow users to manage their own folder (`{user_id}/*`).
- `certificates`: Allow only `super_admin`, `admin`, `event_manager` to upload.

---

## 5. Supabase Auth Configuration

In Supabase Dashboard → Auth → Settings:

- [ ] Enable **Google OAuth** provider (add Client ID + Secret)
- [ ] Enable **GitHub OAuth** provider (add Client ID + Secret)
- [ ] Set **Site URL**: `https://xorvin.onrender.com`
- [ ] Add **Redirect URLs**: `https://xorvin.onrender.com/auth/callback`
- [ ] Disable email confirmations if using social-only auth (optional)
- [ ] Set SMTP provider for magic link / password reset emails

---

## 6. Row Level Security (RLS)

Verify all tables have RLS enabled (enforced in migrations). To double-check:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

All rows should show `rowsecurity = true`.

---

## 7. Build & Deploy

```bash
# Install dependencies
npm install

# Type check
npx tsc -b --noEmit

# Run lint
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Recommended Hosting:** Vercel or Netlify

**Vercel Deployment:**
```bash
npx vercel --prod
# Or connect GitHub repo for automatic deploys
```

**Vercel Configuration (`vercel.json`):**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 8. Post-Deployment Verification

- [ ] Visit `https://xorvin.onrender.com` — homepage loads with real data
- [ ] Test Google OAuth login flow
- [ ] Register a new user and verify profile is created
- [ ] Visit `/events` — events load from Supabase
- [ ] Visit `/certificates/verify` — test with a real verification code
- [ ] Login as `super_admin` — verify dashboard shows real metrics
- [ ] Login as `admin` — test Announcements, Gallery upload, Certificates
- [ ] Login as `moderator` — verify Reports queue loads
- [ ] Run Lighthouse audit: target Score ≥ 90 across all categories
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Verify robots.txt is accessible at `https://xorvin.onrender.com/robots.txt`

---

## 9. Security Final Checks

- [ ] No Supabase service role key exposed in frontend
- [ ] All `.env` files excluded from git
- [ ] HTTPS enforced (Vercel/Netlify handle this automatically)
- [ ] Supabase RLS policies are active on all tables
- [ ] No `console.log` statements with sensitive data in production build

---

## 10. Google Search Console

1. Verify domain ownership via DNS TXT record
2. Submit sitemap: `https://xorvin.onrender.com/sitemap.xml`
3. Request indexing for key pages:
   - `/`
   - `/events`
   - `/blog`
   - `/leaderboard`
   - `/community`
