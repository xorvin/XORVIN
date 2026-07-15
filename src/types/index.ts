// ============================================================
// XORVIN — TypeScript Type Definitions
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'moderator'
  | 'event_manager'
  | 'content_manager'
  | 'interviewer'
  | 'judge'
  | 'ambassador'
  | 'mentor'
  | 'member'
  | 'guest';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  college?: string;
  country?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  joinedAt: string;
  points: number;
  wins: number;
  eventsParticipated: number;
  status: 'active' | 'suspended' | 'banned';
  isVerified: boolean;
  experience?: 'beginner' | 'intermediate' | 'advanced';
  skills?: string[];
  badges: Badge[];
}


export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory =
  | 'hackathon'
  | 'competition'
  | 'workshop'
  | 'conference'
  | 'bootcamp'
  | 'ctf'
  | 'ai-challenge'
  | 'startup'
  | 'open-source';

export interface Event {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  coverImage: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  venue?: string;
  isVirtual: boolean;
  maxParticipants?: number;
  registeredCount: number;
  prizePool?: string;
  tags: string[];
  organizer: string;
  speakers?: Speaker[];
  sponsors?: string[];
  timeline?: EventTimeline[];
  rules?: string[];
  faqs?: FAQ[];
  winners?: Winner[];
  resources?: Resource[];
  gallery?: string[];
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  social?: { twitter?: string; linkedin?: string; github?: string };
}

export interface EventTimeline {
  date: string;
  title: string;
  description: string;
  time?: string;
}

export interface Winner {
  rank: number;
  teamName: string;
  members: string[];
  prize: string;
  project: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'link' | 'github';
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  views: number;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface BlogAuthor {
  name: string;
  avatar: string;
  bio: string;
  role: string;
}

export interface Certificate {
  id: string;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  issuedAt: string;
  type: 'participation' | 'winner' | 'speaker' | 'volunteer' | 'completion';
  verificationUrl: string;
  qrCode?: string;
  rank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  college: string;
  country: string;
  score: number;
  eventsParticipated: number;
  wins: number;
  badges: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'community';
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  event?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'event';
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  eventId?: string;
  eventTitle?: string;
  takenAt: string;
  tags: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'partnership' | 'sponsorship' | 'media' | 'support';
}

export interface CampusAmbassadorForm {
  name: string;
  email: string;
  phone: string;
  college: string;
  city: string;
  country: string;
  year: string;
  branch: string;
  linkedin: string;
  github?: string;
  experience: string;
  whyJoin: string;
  initiatives: string;
}

export interface NewsletterForm {
  email: string;
}

export interface TechDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
