// ============================================================
// XORVIN — App Configuration Constants
// Last updated: July 2026
// All values reflect the current, factual state of the Xorvin organization.
// ============================================================

export const APP_CONFIG = {
  name:        'Xorvin',
  tagline:     'Innovate. Compete. Elevate.',
  mission:     'Empowering innovators through technology, collaboration, and competition.',
  vision:      'To become one of the world\'s most trusted technology communities.',
  description: 'Xorvin is a global technology community headquartered in India, dedicated to empowering innovators through competitions, collaboration, and continuous learning.',
  url:         'https://xorvin.com',
  email:       'official.xorvin@gmail.com',
  foundedYear: 2026,
  country:     'India',
  social: {
    twitter:   'https://x.com/xorvincommunity',
    github:    'https://github.com/xorvin',
    linkedin:  'https://linkedin.com/company/xorvinofficial',
    instagram: 'https://www.instagram.com/xorvincommunity/',
    discord:   'https://discord.gg/ac4tZhjDW',
    youtube:   '#',
  },
} as const;

export const TECH_DOMAINS = [
  { id: 'ai',          name: 'Artificial Intelligence', icon: '🤖', color: '#007BFF' },
  { id: 'ml',          name: 'Machine Learning',        icon: '🧠', color: '#30D5FF' },
  { id: 'cybersec',    name: 'Cybersecurity',           icon: '🔒', color: '#FF4757' },
  { id: 'programming', name: 'Programming',             icon: '💻', color: '#2ED573' },
  { id: 'web',         name: 'Web Development',         icon: '🌐', color: '#FFA502' },
  { id: 'mobile',      name: 'Mobile Dev',              icon: '📱', color: '#FF6B81' },
  { id: 'cloud',       name: 'Cloud Computing',         icon: '☁️', color: '#5352ED' },
  { id: 'devops',      name: 'DevOps',                  icon: '⚙️', color: '#00D2D3' },
  { id: 'blockchain',  name: 'Blockchain',              icon: '⛓️', color: '#F9CA24' },
  { id: 'iot',         name: 'IoT',                     icon: '📡', color: '#6C5CE7' },
  { id: 'robotics',    name: 'Robotics',                icon: '🤖', color: '#A29BFE' },
  { id: 'data',        name: 'Data Science',            icon: '📊', color: '#55EFC4' },
  { id: 'uiux',        name: 'UI/UX Design',            icon: '🎨', color: '#FD79A8' },
  { id: 'cp',          name: 'Competitive Programming', icon: '🏆', color: '#FDCB6E' },
  { id: 'se',          name: 'Software Engineering',    icon: '🔧', color: '#74B9FF' },
] as const;

// ——— LAUNCH FACTS (factual, not projected) ———
// These stats reflect the actual launch state of Xorvin in 2026.
// They will be updated dynamically as the community grows.
export const HOME_STATS = [
  { label: 'Founded',       value: 2026,  suffix: '',   icon: 'Calendar', isYear: true },
  { label: 'Live Events',   value: 1,     suffix: '',   icon: 'Trophy'                 },
  { label: 'Open to All',   value: 100,   suffix: '%',  icon: 'Globe'                  },
  { label: 'Free to Join',  value: 0,     suffix: '₹',  icon: 'Users', isFree: true    },
] as const;

export const CORE_VALUES = [
  {
    icon: '🚀',
    title: 'Innovation',
    description: 'We believe in challenging the status quo and building solutions that matter — one problem at a time.',
  },
  {
    icon: '🤝',
    title: 'Collaboration',
    description: 'The best ideas emerge when diverse minds work together. We foster an open, inclusive environment.',
  },
  {
    icon: '🏆',
    title: 'Excellence',
    description: 'We set high standards for ourselves and inspire every community member to grow and exceed their limits.',
  },
  {
    icon: '🌍',
    title: 'Inclusivity',
    description: 'Technology belongs to everyone. Xorvin welcomes participants of all backgrounds and skill levels.',
  },
  {
    icon: '📚',
    title: 'Continuous Learning',
    description: 'Growth never stops. We are committed to sharing knowledge, mentorship, and lifelong education.',
  },
  {
    icon: '🔓',
    title: 'Transparency',
    description: 'We operate with openness and honesty — from how events are run to how decisions are made.',
  },
] as const;

// ——— HONEST FOUNDING TIMELINE (Xorvin was founded in 2026) ———
export const ABOUT_TIMELINE = [
  {
    year: '2026',
    title: 'Xorvin Founded',
    description: 'Xorvin was established in India with a mission to empower innovators through technology, collaboration, and competition.',
  },
  {
    year: '2026',
    title: 'First Event Launched',
    description: 'The Xorvin Tech Challenge 2026 — our inaugural competition — was announced and hosted on Unstop, marking the beginning of our journey.',
  },
  {
    year: 'Soon',
    title: 'Community Growth',
    description: 'We are actively building our community. New events, workshops, and programs are being planned. Stay tuned.',
  },
] as const;

export const COMMUNITY_BENEFITS = [
  {
    icon: '🎓',
    title: 'Learn & Grow',
    description: 'Access workshops, curated resources, and editorial content from the Xorvin team to sharpen your tech skills.',
  },
  {
    icon: '🌐',
    title: 'Global Community',
    description: 'Connect with like-minded innovators, developers, and students who share your passion for technology.',
  },
  {
    icon: '🏆',
    title: 'Compete & Earn',
    description: 'Participate in free competitions and challenges. Winners receive verified certificates and recognition.',
  },
  {
    icon: '💼',
    title: 'Build Your Profile',
    description: 'Grow your professional presence through competitions, community contributions, and earned certificates.',
  },
  {
    icon: '📜',
    title: 'Verified Certificates',
    description: 'Earn digital certificates for participating in and winning Xorvin events — shareable on LinkedIn and resumes.',
  },
  {
    icon: '🤝',
    title: 'Open Collaboration',
    description: 'We believe in open access to knowledge, community-driven events, and shared growth for everyone.',
  },
] as const;

export const FAQ_DATA = [
  {
    question: 'What is Xorvin?',
    answer: 'Xorvin is a global technology community founded in India in 2026. Our mission is to empower innovators through technology competitions, collaborative learning, and community-driven programs.',
  },
  {
    question: 'How do I join Xorvin?',
    answer: 'Simply create a free account using your email or Google login. Once registered, you can browse events, register for competitions, and access resources.',
  },
  {
    question: 'Is Xorvin free to join?',
    answer: 'Yes! Joining the Xorvin community is completely free. Our current events are also free to participate in.',
  },
  {
    question: 'Can I participate from anywhere in the world?',
    answer: 'Absolutely. Xorvin is a global community. Our current competitions are hosted online on Unstop, open to participants from anywhere in the world.',
  },
  {
    question: 'How do I register for the Xorvin Tech Challenge 2026?',
    answer: 'Visit our Events page and click the registration link for the Xorvin Tech Challenge 2026 on Unstop. Registration is open from 1 July to 8 July 2026.',
  },
  {
    question: 'Are certificates provided for participation?',
    answer: 'Yes. Winners of Xorvin competitions receive verified digital certificates. Participation certificates will be available for qualifying events as our program grows.',
  },
  {
    question: 'How can my company partner with Xorvin?',
    answer: 'We are actively seeking our founding partners. Visit our Partners page or contact us at official.xorvin@gmail.com to discuss collaboration opportunities.',
  },
  {
    question: 'What is the Campus Ambassador Program?',
    answer: 'The Campus Ambassador Program is in planning. It will empower passionate tech students to represent Xorvin at their universities and organize local events. Details will be announced soon.',
  },
  {
    question: 'Can I propose a workshop or event?',
    answer: 'Yes! We welcome community proposals. Reach out through our Contact page with your ideas. We are especially interested in topics like AI, cybersecurity, web development, and career development.',
  },
  {
    question: 'How does the leaderboard work?',
    answer: 'The Xorvin leaderboard will rank participants based on performance in competitions and events. Rankings will be published after our first competitions conclude.',
  },
] as const;

export const PROGRAM_TYPES = [
  {
    id: 'competitions',
    title: 'Competitions',
    description: 'Test your skills in technology challenges, hackathons, and problem-solving competitions hosted by Xorvin.',
    icon: '🏆',
    color: '#007BFF',
    features: ['Online Format', 'Free Entry', 'Winner Certificates', 'Skill Building'],
  },
  {
    id: 'open-source',
    title: 'Open Source Initiative',
    description: 'Contribute to open source projects, collaborate with community members, and build a portfolio of real-world work.',
    icon: '🔓',
    color: '#30D5FF',
    features: ['Community Projects', 'Portfolio Building', 'Collaborative Learning', 'Coming Soon'],
  },
  {
    id: 'workshops',
    title: 'Workshops & Webinars',
    description: 'Attend curated online workshops on emerging technology topics, designed for students and early-career professionals.',
    icon: '📚',
    color: '#FFA502',
    features: ['Online Format', 'Expert Sessions', 'Q&A Included', 'Coming Soon'],
  },
  {
    id: 'ambassador',
    title: 'Campus Ambassador',
    description: 'Represent Xorvin at your university, organize local tech events, and build a community of innovators on your campus.',
    icon: '🌐',
    color: '#2ED573',
    features: ['University Presence', 'Event Organizing', 'Community Building', 'Coming Soon'],
  },
] as const;
