# XORVIN

Empowering innovators through technology, collaboration, and competition. Join a growing global community of builders and creators.

## 🚀 Live Deployment
- **Website**: [https://xorvin.onrender.com](https://xorvin.onrender.com)

## 🛠 Tech Stack
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **State & Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router
- **Backend & Auth**: Supabase (PostgreSQL + RLS + Auth + Storage)
- **Deployment**: Render / Vercel
- **Animations**: Framer Motion + GSAP

## 📂 Project Structure

```text
C:\USERS\SANJA\PROJECT\XORVIN\SRC
│   App.css
│   App.tsx
│   index.css
│   main.tsx
│   vite-env.d.ts
│   
├───animations
│       variants.ts
│       
├───assets
│   │   hero.png
│   │   react.svg
│   │   vite.svg
│   │   
│   └───brand
│           ai.jpg
│           cloud.jpg
│           cs.jpg
│           git.jpg
│           xorvin-poster.jpg
│           
├───components
│   ├───atoms
│   │       Badge.tsx
│   │       Button.tsx
│   │       CountdownTimer.tsx
│   │       LazyImage.tsx
│   │       SEO.tsx
│   │       Skeleton.tsx
│   │       
│   ├───molecules
│   │       AdminModal.tsx
│   │       BlogCard.tsx
│   │       CommandPalette.tsx
│   │       ConfirmDialog.tsx
│   │       CookieBanner.tsx
│   │       DataTable.tsx
│   │       EventCard.tsx
│   │       MarkdownEditor.tsx
│   │       MetricCard.tsx
│   │       NotificationBell.tsx
│   │       PageHeader.tsx
│   │       ProtectedRoute.tsx
│   │       RequirePermission.tsx
│   │       ScrollProgress.tsx
│   │       StatChart.tsx
│   │       ToastContainer.tsx
│   │       
│   └───organisms
│           DynamicSidebar.tsx
│           ErrorBoundary.tsx
│           Footer.tsx
│           HeroSection.tsx
│           Navbar.tsx
│           TechScroller.tsx
│           
├───constants
│       config.ts
│       permissions.ts
│       routes.ts
│       
├───contexts
│       AuthContext.tsx
│       PermissionContext.tsx
│       ThemeContext.tsx
│       ToastContext.tsx
│       
├───hooks
│       useAdminData.ts
│       useAuditLog.ts
│       useBlogs.ts
│       useBookmarks.ts
│       useCertificates.ts
│       useContact.ts
│       useEvents.ts
│       useGamification.ts
│       useInterviews.ts
│       useLeaderboard.ts
│       useMentorSessions.ts
│       useNotifications.ts
│       usePageTracking.ts
│       usePermission.ts
│       useScrollProgress.ts
│       useSubmissions.ts
│       
├───layouts
│       AdminLayout.tsx
│       AmbassadorLayout.tsx
│       AuthLayout.tsx
│       ContentManagerLayout.tsx
│       EventManagerLayout.tsx
│       InterviewerLayout.tsx
│       JudgeLayout.tsx
│       MainLayout.tsx
│       MentorLayout.tsx
│       SuperAdminLayout.tsx
│       
├───lib
│       analytics.ts
│       env.ts
│       errors.ts
│       queryClient.ts
│       retry.ts
│       supabase.ts
│       
├───pages
│       (Contains subdirectories for all individual page components)
│       
├───services
│       audit.service.ts
│       auth.service.ts
│       blogs.service.ts
│       certificates.service.ts
│       contact.service.ts
│       events.service.ts
│       gallery.service.ts
│       leaderboard.service.ts
│       notifications.service.ts
│       
├───types
│       index.ts
│       permissions.ts
│       
└───utils
        cn.ts
        formatDate.ts
        mapDbBlog.ts
        mapDbEvent.ts
```

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xorvin/XORVIN.git
   cd XORVIN
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_URL=http://localhost:5173
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```
