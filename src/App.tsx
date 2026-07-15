import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SuperAdminLayout } from '@/layouts/SuperAdminLayout';
import { EventManagerLayout } from '@/layouts/EventManagerLayout';
import { ContentManagerLayout } from '@/layouts/ContentManagerLayout';
import { InterviewerLayout } from '@/layouts/InterviewerLayout';
import { JudgeLayout } from '@/layouts/JudgeLayout';
import { AmbassadorLayout } from '@/layouts/AmbassadorLayout';
import { MentorLayout } from '@/layouts/MentorLayout';
import { ProtectedRoute } from '@/components/molecules/ProtectedRoute';
import { usePageTracking } from '@/hooks/usePageTracking';

// Loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-xorvin-dark">
    <div className="w-8 h-8 border-2 border-xorvin-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ─── Lazy Loaded Pages ──────────────────────────────────────────────────────
const HomePage          = lazy(() => import('@/pages/Home'));
const AboutPage         = lazy(() => import('@/pages/About'));
const EventsPage        = lazy(() => import('@/pages/Events'));
const EventDetailPage   = lazy(() => import('@/pages/Events/EventDetail'));
const CompetitionsPage  = lazy(() => import('@/pages/Competitions'));
const HackathonsPage    = lazy(() => import('@/pages/Hackathons'));
const WorkshopsPage     = lazy(() => import('@/pages/Workshops'));
const ProgramsPage      = lazy(() => import('@/pages/Programs'));
const CommunityPage     = lazy(() => import('@/pages/Community'));
const CampusPage        = lazy(() => import('@/pages/CampusAmbassador'));
const PartnersPage      = lazy(() => import('@/pages/Partners'));
const GalleryPage       = lazy(() => import('@/pages/Gallery'));
const BlogPage          = lazy(() => import('@/pages/Blog'));
const BlogDetailPage    = lazy(() => import('@/pages/Blog/BlogDetail'));
const LeaderboardPage   = lazy(() => import('@/pages/Leaderboard'));
const CertificatesPage  = lazy(() => import('@/pages/Certificates'));
const VerifyPage        = lazy(() => import('@/pages/Certificates/Verify'));
const FAQPage           = lazy(() => import('@/pages/FAQ'));
const ContactPage       = lazy(() => import('@/pages/Contact'));
const NotFoundPage      = lazy(() => import('@/pages/NotFound'));
const ForbiddenPage     = lazy(() => import('@/pages/Forbidden'));

// Profile Pages
const ProfilePage       = lazy(() => import('@/pages/Profile'));
const EditProfilePage   = lazy(() => import('@/pages/Profile/EditProfile'));
const SettingsPage      = lazy(() => import('@/pages/Profile/Settings'));

// Legal Pages
const PrivacyPage       = lazy(() => import('@/pages/Legal/Privacy'));
const TermsPage         = lazy(() => import('@/pages/Legal/Terms'));
const ConductPage       = lazy(() => import('@/pages/Legal/CodeOfConduct'));

// Auth Pages
const LoginPage         = lazy(() => import('@/pages/Auth/Login'));
const RegisterPage      = lazy(() => import('@/pages/Auth/Register'));
const ForgotPage        = lazy(() => import('@/pages/Auth/ForgotPassword'));
const CallbackPage      = lazy(() => import('@/pages/Auth/Callback'));

// Admin & Role Dashboards
const SuperAdminDashboard = lazy(() => import('@/pages/SuperAdmin/Dashboard'));
const ModeratorDashboard  = lazy(() => import('@/pages/Moderator/Dashboard'));
const EventDashboard      = lazy(() => import('@/pages/EventManager/Dashboard'));
const EventWizard       = lazy(() => import('@/pages/EventManager/EventWizard'));
const RegistrationManager = lazy(() => import('@/pages/EventManager/Registrations'));
const ContentDashboard    = lazy(() => import('@/pages/ContentManager/Dashboard'));
const BlogEditor        = lazy(() => import('@/pages/ContentManager/BlogEditor'));
const InterviewerDash     = lazy(() => import('@/pages/Interviewer/Dashboard'));
const JudgeDashboard      = lazy(() => import('@/pages/Judge/Dashboard'));
const AmbassadorDash      = lazy(() => import('@/pages/Ambassador/Dashboard'));
const MentorDashboard     = lazy(() => import('@/pages/Mentor/Dashboard'));

// Legacy Admin Pages
const AdminDashboard    = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminEvents       = lazy(() => import('@/pages/Admin/EventsManagement'));
const AdminUsers        = lazy(() => import('@/pages/Admin/UsersManagement'));
const AdminBlogs        = lazy(() => import('@/pages/Admin/BlogsManagement'));
const AdminCertificates = lazy(() => import('@/pages/Admin/CertificatesManagement'));
const AdminAnnounce     = lazy(() => import('@/pages/Admin/AnnouncementsManagement'));
const AdminGallery      = lazy(() => import('@/pages/Admin/GalleryManagement'));
const AdminContact      = lazy(() => import('@/pages/Admin/ContactMessages'));
const AdminReports      = lazy(() => import('@/pages/Admin/ReportsManagement'));
const AdminLeaderboard  = lazy(() => import('@/pages/Admin/LeaderboardManagement'));

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

function AppInner() {
  usePageTracking();
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

          {/* ─── Main Public Layout ─────────────────────────────────────────── */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Events & Competitions */}
            <Route path="/events"           element={<EventsPage />} />
            <Route path="/events/:slug"     element={<EventDetailPage />} />
            <Route path="/competitions"     element={<CompetitionsPage />} />
            <Route path="/hackathons"       element={<HackathonsPage />} />
            <Route path="/workshops"        element={<WorkshopsPage />} />
            <Route path="/programs"         element={<ProgramsPage />} />

            {/* Community */}
            <Route path="/community"          element={<CommunityPage />} />
            <Route path="/campus-ambassador"  element={<CampusPage />} />
            <Route path="/partners"           element={<PartnersPage />} />
            <Route path="/gallery"            element={<GalleryPage />} />

            {/* Content */}
            <Route path="/blog"         element={<BlogPage />} />
            <Route path="/blog/:slug"   element={<BlogDetailPage />} />
            <Route path="/leaderboard"  element={<LeaderboardPage />} />

            {/* Certificates */}
            <Route path="/certificates"        element={<CertificatesPage />} />
            <Route path="/certificates/verify" element={<VerifyPage />} />

            {/* Support */}
            <Route path="/faq"      element={<FAQPage />} />
            <Route path="/contact"  element={<ContactPage />} />

            {/* Legal */}
            <Route path="/privacy"          element={<PrivacyPage />} />
            <Route path="/terms"            element={<TermsPage />} />
            <Route path="/code-of-conduct"  element={<ConductPage />} />

            {/* Protected Profile Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/settings" element={<SettingsPage />} />
            </Route>

            {/* 403 & 404 */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ─── Auth Layout ────────────────────────────────────────────────── */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login"           element={<LoginPage />} />
            <Route path="register"        element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPage />} />
            <Route path="callback"        element={<CallbackPage />} />
          </Route>

          {/* ─── Super Admin Layout ─────────────────────────────────────────── */}
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
          </Route>

          {/* ─── Admin Layout ───────────────────────────────────────────────── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index        element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events"    element={<AdminEvents />} />
            <Route path="users"     element={<AdminUsers />} />
            <Route path="blogs"         element={<AdminBlogs />} />
            <Route path="certificates"  element={<AdminCertificates />} />
            <Route path="announcements" element={<AdminAnnounce />} />
            <Route path="gallery"       element={<AdminGallery />} />
            <Route path="contact"       element={<AdminContact />} />
            <Route path="reports"       element={<AdminReports />} />
            <Route path="leaderboard"   element={<AdminLeaderboard />} />
          </Route>

          {/* ─── Moderator Layout ───────────────────────────────────────────── */}
          <Route path="/moderator" element={<AdminLayout />}>
            <Route index element={<ModeratorDashboard />} />
          </Route>

          {/* ─── Event Manager Layout ───────────────────────────────────────── */}
          <Route path="/events/manage" element={<EventManagerLayout />}>
            <Route index element={<EventDashboard />} />
            <Route path="new" element={<EventWizard />} />
            <Route path=":id/edit" element={<EventWizard />} />
            <Route path=":id/registrations" element={<RegistrationManager />} />
          </Route>

          {/* ─── Content Manager Layout ─────────────────────────────────────── */}
          <Route path="/content" element={<ContentManagerLayout />}>
            <Route index element={<ContentDashboard />} />
            <Route path="blogs/new" element={<BlogEditor />} />
            <Route path="blogs/:id/edit" element={<BlogEditor />} />
          </Route>

          {/* ─── Interviewer Layout ─────────────────────────────────────────── */}
          <Route path="/interviewer" element={<InterviewerLayout />}>
            <Route index element={<InterviewerDash />} />
          </Route>

          {/* ─── Judge Layout ───────────────────────────────────────────────── */}
          <Route path="/judge" element={<JudgeLayout />}>
            <Route index element={<JudgeDashboard />} />
          </Route>

          {/* ─── Ambassador Layout ──────────────────────────────────────────── */}
          <Route path="/ambassador" element={<AmbassadorLayout />}>
            <Route index element={<AmbassadorDash />} />
          </Route>

          {/* ─── Mentor Layout ──────────────────────────────────────────────── */}
          <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<MentorDashboard />} />
          </Route>

        </Routes>
      </Suspense>
  );
}
