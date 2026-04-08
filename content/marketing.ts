// ============================================================
// ALL MARKETING COPY LIVES HERE
// RefZone - Football Referee Training Platform
// https://www.refzone.com.au
// ============================================================

export const siteConfig = {
  name: 'RefZone',
  tagline: 'Train smarter. Ref better.',
  description:
    'RefZone is an advanced football referee training platform built for Australian referees. Master the Laws of the Game with interactive scenarios, quizzes, and real-time performance analytics.',
  url: 'https://www.refzone.com.au',
  supportEmail: 'admin@refzone.com.au',
  brandColor: '#1a73e8',
  brandPink: '#e91e63',
};

// ============================================================
// ANNOUNCEMENT BAR
// ============================================================

export const announcementBar = {
  badge: 'New',
  text: 'Decision Lab is live — get instant analysis on any match scenario',
  link: {
    label: 'Try it now',
    href: '/decision-lab',
  },
};

// ============================================================
// FEATURES DROPDOWN (Navigation mega-menu)
// ============================================================

export const featuresDropdown = {
  products: [
    {
      icon: 'Crosshair',
      label: 'Scenarios',
      description: '100+ real-game decision-making situations with instant analysis and feedback.',
      href: '/features/scenarios',
    },
    {
      icon: 'BookOpen',
      label: 'Quizzes',
      description: '500+ questions spanning every Law of the Game, from offside to misconduct.',
      href: '/features/quizzes',
    },
    {
      icon: 'Brain',
      label: 'Decision Lab',
      description: 'Interactive analysis tool that breaks down complex decisions in real time.',
      href: '/features/decision-lab',
    },
    {
      icon: 'BarChart3',
      label: 'Analytics',
      description: 'Accuracy metrics, law-specific tracking, and 7-day activity charts.',
      href: '/features/analytics',
    },
    {
      icon: 'Zap',
      label: 'Streaks',
      description: 'Build daily training habits with streaks and track your consistency over time.',
      href: '/features/gamification',
    },
  ],
  secondary: [
    {
      icon: 'Sparkles',
      label: 'Smart Analysis',
      description: 'Get instant, context-aware feedback on every decision you make.',
      href: '/features/scenarios',
    },
    {
      icon: 'Flame',
      label: 'Streak Tracking',
      description: 'Build daily training habits with streak goals and track your consistency.',
      href: '/features/gamification',
    },
    {
      icon: 'Users',
      label: 'Community Forum',
      description: 'Connect with referees across Australia to discuss calls and share insights.',
      href: '/referees/community',
    },
  ],
  featured: [
    {
      label: 'RefZone Pro',
      href: '/about',
      description: 'Advanced analytics, unlimited Decision Lab, and priority support. Coming soon.',
      comingSoon: true,
    },
    {
      label: 'For Associations',
      href: '/contact',
      description: 'Training tools built for referee panels, academies, and football associations.',
      comingSoon: false,
    },
  ],
  bottomLinks: [
    {
      label: 'Decision Lab',
      cta: 'Try the assistant',
      href: '/features/decision-lab',
      isNew: true,
    },
    {
      label: 'Scenarios',
      cta: 'Browse all scenarios',
      href: '/features/scenarios',
      isNew: false,
    },
  ],
};

// ============================================================
// REFEREES DROPDOWN (Navigation mega-menu)
// ============================================================

export const refereesDropdown = {
  items: [
    {
      icon: 'GraduationCap',
      label: 'Getting Started',
      description:
        'New to RefZone? Learn how the platform works and start your first training session in minutes.',
      href: '/referees/getting-started',
    },
    {
      icon: 'BookOpen',
      label: 'Laws of the Game',
      description:
        'A complete, searchable reference for every Law of the Game, aligned with the latest IFAB updates.',
      href: '/referees/laws-of-the-game',
    },
    {
      icon: 'Award',
      label: 'Career Development',
      description:
        'Understand the pathway from grassroots to elite, and track your progression through each level.',
      href: '/referees/career',
    },
    {
      icon: 'Users',
      label: 'Community',
      description:
        'Join the RefZone community forum. Discuss match situations, share tips, and connect with referees.',
      href: '/referees/community',
    },
    {
      icon: 'Target',
      label: 'Training Resources',
      description:
        'Guides, checklists, and articles written by experienced referees to sharpen your match-day skills.',
      href: '/referees/training-resources',
    },
    {
      icon: 'Shield',
      label: 'Match Preparation',
      description:
        'Pre-match checklists, positioning guides, and warm-up routines to get you game-ready.',
      href: '/referees/match-preparation',
    },
  ],
};

// ============================================================
// NAVIGATION — Raycast-style flat links
// ============================================================

export const navigation = {
  links: [
    { label: 'Scenarios', href: '/features/scenarios' },
    { label: 'Quizzes', href: '/features/quizzes' },
    { label: 'Decision Lab', href: '/features/decision-lab' },
    { label: 'About', href: '/about' },
    { label: 'Privacy', href: '/privacy' },
  ],
  cta: {
    signIn: { label: 'Log in', href: '/auth/login' },
    getStarted: { label: 'Get started', href: '/auth/sign-up' },
  },
};

// ============================================================
// LANDING PAGE
// ============================================================

export const landingPage = {
  // ----------------------------------------------------------
  // HERO
  // ----------------------------------------------------------
  hero: {
    headline: 'Train smarter.\nRef better.',
    subheadline:
      'Master the Laws of the Game with algorithm-driven scenarios, quizzes, and real-time performance analytics. Join hundreds of Australian referees levelling up their skills.',
    primaryCta: { label: 'Start training free', href: '/auth/sign-up' },
    secondaryCta: null,
    logoStrip: [
      'Football Australia',
      'FFA',
      'NPL',
      'A-League',
      'Football NSW',
      'Football Victoria',
      'Football Queensland',
      'Capital Football',
    ],
  },

  // ----------------------------------------------------------
  // SECTION 1 — Scenarios
  // ----------------------------------------------------------
  section1: {
    headline: 'Real decisions. Real improvement.',
    mainFeature: {
      label: 'Scenarios',
      isNew: true,
      title: 'Train with match-realistic situations',
      description:
        'Step into the referee\'s shoes with 100+ scenarios drawn from real match footage. Each situation tests your decision-making under pressure, then delivers instant expert feedback explaining the correct call, the relevant law, and the reasoning behind it.',
    },
    features: [
      {
        title: 'Contextual feedback',
        description:
          'Every decision you make is analysed in real time. Understand not just the right call, but the law reference, the positioning cues, and common mistakes other referees make in the same situation.',
      },
      {
        title: 'Categorised by law',
        description:
          'Scenarios are tagged to specific Laws of the Game so you can target your weakest areas — whether it is offside interpretation, handling, or advantage application.',
      },
      {
        title: 'Difficulty progression',
        description:
          'Start with clear-cut calls and progress to borderline situations that test even the most experienced referees. The platform adapts to your current skill level.',
      },
      {
        title: 'Detailed explanations',
        description:
          'After each scenario, review a full breakdown including the applicable law, key factors in the decision, and tips on how to read similar situations faster on match day.',
      },
    ],
    actionCards: [
      {
        title: 'Law 11 — Offside',
        description: 'Test your ability to judge offside position, interfering with play, and gaining an advantage.',
        href: '/features/scenarios?law=11',
        highlighted: false,
      },
      {
        title: 'Law 12 — Fouls & Misconduct',
        description: 'Distinguish careless, reckless, and excessive-force challenges under match pressure.',
        href: '/features/scenarios?law=12',
        highlighted: false,
      },
      {
        title: 'Penalty Decisions',
        description: 'Navigate the toughest calls in football — inside the penalty area, every detail matters.',
        href: '/features/scenarios?category=penalty',
        highlighted: false,
      },
      {
        title: 'Advantage Play',
        description: 'Know when to play on and when to bring it back. Master the art of advantage application.',
        href: '/features/scenarios?category=advantage',
        highlighted: false,
      },
      {
        title: 'Build your own',
        description: 'Describe a match situation and generate a custom training scenario tailored to you.',
        href: '/decision-lab',
        highlighted: true,
      },
    ],
  },

  // ----------------------------------------------------------
  // SECTION 2 — Quizzes
  // ----------------------------------------------------------
  section2: {
    headline: 'Know every law inside out.',
    mainCard: {
      label: 'Quizzes',
      title: '500+ questions covering the complete Laws of the Game',
      description:
        'From throw-in procedures to VAR protocols, our question bank covers every law in detail. Each question includes a full explanation so you learn from every answer — right or wrong.',
    },
    cards: [
      {
        label: 'Difficulty Levels',
        title: 'From grassroots to elite-level challenge',
        description:
          'Questions are graded across three tiers — Foundation, Intermediate, and Advanced. Start where you are comfortable, then push yourself into the questions that separate good referees from great ones.',
      },
      {
        label: 'Track Progress',
        title: 'See exactly where you stand on every law',
        description:
          'Your quiz results feed directly into your analytics dashboard. Identify which laws you have mastered and which need more attention, then generate targeted practice sessions automatically.',
      },
    ],
  },

  // ----------------------------------------------------------
  // SECTION 3 — Analytics
  // ----------------------------------------------------------
  section3: {
    headline: 'See your growth.',
    cards: [
      {
        label: 'Performance Dashboard',
        title: 'Your accuracy at a glance',
        description:
          'A single dashboard that tracks your overall accuracy, response time trends, and session history. Watch your numbers climb as your training compounds over days and weeks.',
      },
      {
        label: 'Law-Specific Analytics',
        title: 'Pinpoint your strengths and blind spots',
        description:
          'Break your performance down by individual law. Instantly see whether Law 12 fouls are your weakness or if offside calls need more work — then act on it.',
      },
    ],
    wideCard: {
      label: 'Activity Tracking',
      title: '7-day activity charts and streak monitoring',
      description:
        'Visualise your training consistency with daily activity charts. Pair it with the streak system to build an unbreakable training habit — most active RefZone users train at least five days a week.',
    },
  },

  // ----------------------------------------------------------
  // PULL QUOTES
  // ----------------------------------------------------------
  pullQuote: {
    quotes: [
      '"Train smarter. Ref better."',
      '"500+ questions. Every law covered."',
      '"Built for Australian referees."',
      '"Algorithm-driven scenarios and quizzes."',
      '"Track your progress law by law."',
      '"Your referee training platform."',
    ],
  },

  // ----------------------------------------------------------
  // STATS
  // ----------------------------------------------------------
  stats: {
    headline: 'Numbers that\nspeak for themselves.',
    subheadline:
      'RefZone is the most comprehensive referee training platform in Australia.',
    tags: [
      'Scenarios',
      'Quizzes',
      'Laws of the Game',
      'Smart Analysis',
      'Performance Tracking',
      'Community',
      'Streaks',
    ],
    items: [
      { value: '500+', label: 'Quiz questions' },
      { value: '100+', label: 'Game scenarios' },
      { value: '24/7', label: 'Training assistant' },
    ],
  },

  // ----------------------------------------------------------
  // TESTIMONIALS
  // ----------------------------------------------------------
  testimonials: {
    headline: 'What referees are saying.',
    featured: {
      quote:
        '[Placeholder] This is where a featured testimonial from a real RefZone user will go. We are collecting feedback from our early users.',
      author: 'Your Name Here',
      role: 'Placeholder — Real testimonial coming soon',
    },
    items: [
      {
        quote:
          '[Placeholder] A real testimonial from a community referee will appear here once we have collected user feedback.',
        author: 'Community Referee',
        role: 'Placeholder',
        stars: 5,
      },
      {
        quote:
          '[Placeholder] A real testimonial about Decision Lab will appear here once we have collected user feedback.',
        author: 'Junior Referee',
        role: 'Placeholder',
        stars: 5,
      },
      {
        quote:
          '[Placeholder] A real testimonial about streaks and training habits will appear here once we have collected user feedback.',
        author: 'District Referee',
        role: 'Placeholder',
        stars: 5,
      },
      {
        quote:
          '[Placeholder] A real testimonial about analytics and improvement will appear here once we have collected user feedback.',
        author: 'State Referee',
        role: 'Placeholder',
        stars: 5,
      },
    ],
  },

  // ----------------------------------------------------------
  // BOTTOM CTA
  // ----------------------------------------------------------
  bottomCta: {
    headline: 'Ready to level up?',
    products: [
      {
        name: 'RefZone',
        description: 'Algorithm-driven referee training. Free to start.',
        cta: { label: 'Start training free', href: '/auth/sign-up' },
        isPrimary: true,
      },
      {
        name: 'Scenarios',
        description: '100+ real-game decision situations.',
        cta: { label: 'Explore scenarios', href: '/features/scenarios' },
        isPrimary: false,
      },
      {
        name: 'For Associations',
        description: 'Training tools for your whole referee panel.',
        cta: { label: 'Get in touch', href: '/contact' },
        isPrimary: false,
      },
    ],
  },
};

// ============================================================
// FAQ PAGE
// ============================================================

export const faqPage = {
  headline: 'Questions & answers',
  items: [
    {
      question: 'What is RefZone?',
      answer:
        'RefZone is an advanced training platform designed specifically for football referees in Australia. It combines interactive match scenarios, a comprehensive quiz bank, a smart decision analysis tool, and detailed performance analytics to help referees at every level sharpen their knowledge of the Laws of the Game and improve their on-field decision-making.',
    },
    {
      question: 'Who is RefZone for?',
      answer:
        'RefZone is for any football referee — from someone who has just completed their introductory course through to experienced officials preparing for national-level appointments. Community referees, junior referees, district referees, and NPL-level officials all benefit from the platform. Football associations can also use RefZone as a training and assessment tool for their entire referee panel.',
    },
    {
      question: 'Is RefZone free to use?',
      answer:
        'Yes. RefZone offers a free tier that gives you access to scenarios, quizzes, basic analytics, and streak tracking. All core training features are available at no cost. We are developing RefZone Pro with advanced analytics, unlimited Decision Lab sessions, and priority support — details will be announced soon.',
    },
    {
      question: 'Which Laws of the Game does RefZone cover?',
      answer:
        'RefZone covers all 17 Laws of the Game as defined by the International Football Association Board (IFAB). Our quiz bank includes 500+ questions and our scenario library includes 100+ situations, spanning everything from the field of play and offside to fouls, misconduct, penalty kicks, and VAR procedures. Content is updated regularly to reflect the latest IFAB amendments.',
    },
    {
      question: 'How does the analysis work?',
      answer:
        'When you complete a scenario or ask a question in Decision Lab, our algorithms analyse your decision against the relevant Laws of the Game. You get a detailed breakdown of the correct call, the specific law and clause, common errors referees make in that situation, and practical positioning and communication tips. Our system is built on official IFAB materials and real match interpretations.',
    },
    {
      question: 'Is my data private and secure?',
      answer:
        'Absolutely. RefZone takes data privacy seriously. Your personal information and training data are encrypted and stored securely on Australian-hosted servers. We never sell your data to third parties. Your performance analytics are visible only to you. For full details, see our Privacy Policy.',
    },
    {
      question: 'Can I use RefZone on my phone?',
      answer:
        'Yes. RefZone is a fully responsive web application that works on any modern browser — desktop, tablet, or mobile. There is no app to download. Simply visit refzone.com.au, sign up, and start training from any device.',
    },
    {
      question: 'How do I get started?',
      answer:
        'Getting started takes less than a minute. Click "Start training free", create your account with an email address, and you will be taken straight to your dashboard. From there you can jump into a scenario, start a quiz, or explore Decision Lab. No credit card is required.',
    },
    {
      question: 'What is Decision Lab?',
      answer:
        'Decision Lab is RefZone\'s interactive analysis tool, built on a specialised AI trained on the Laws of the Game. You can describe any match situation — real or hypothetical — and get an instant, detailed breakdown of the correct decision, the applicable law, and the reasoning. Think of it as having an experienced referee mentor available around the clock.',
    },
    {
      question: 'Can football associations use RefZone for their referee panels?',
      answer:
        'Yes. We offer tools designed for football associations, academies, and referee panels. Association administrators can track their referees\' progress, assign targeted training, and identify areas where additional coaching is needed. Contact us at admin@refzone.com.au to discuss your requirements.',
    },
  ],
};

// ============================================================
// FOOTER
// ============================================================

export const footerContent = {
  columns: [
    {
      title: 'Platform',
      links: [
        { label: 'Scenarios', href: '/features/scenarios' },
        { label: 'Quizzes', href: '/features/quizzes' },
        { label: 'Decision Lab', href: '/features/decision-lab' },
        { label: 'Analytics', href: '/features/analytics' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'For Referees', href: '/referees/getting-started' },
        { label: 'Laws of the Game', href: '/referees/laws-of-the-game' },
        { label: 'Weekly Quiz', href: '/weekly-quiz' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Sitemap', href: '/sitemap' },
      ],
    },
  ],
  social: [],
};

// ============================================================
// PRIVACY PAGE
// ============================================================

export const privacyPage = {
  title: 'Privacy Policy',
  lastUpdated: '2026-04-05',
  sections: [
    {
      heading: 'Introduction',
      content:
        'RefZone ("we", "us", or "our") operates the website refzone.com.au and the RefZone platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or use our services. We are committed to protecting your privacy in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).',
    },
    {
      heading: 'Information we collect',
      content:
        'We collect information you provide directly to us when you create an account, including your name, email address, and optional profile details such as your refereeing level and state. We also collect usage data automatically, including training activity, quiz results, scenario responses, session durations, device information, and browser type. This data is used to power your analytics dashboard and improve the platform.',
    },
    {
      heading: 'How we use your information',
      content:
        'We use your personal information to: (a) provide, maintain, and improve the RefZone platform; (b) generate your performance analytics and personalised training recommendations; (c) send you service-related communications such as account verification and platform updates; (d) respond to your enquiries and support requests; and (e) comply with legal obligations.',
    },
    {
      heading: 'Data storage and security',
      content:
        'Your data is stored on secure, Australian-hosted servers. We implement industry-standard technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These measures include encryption in transit and at rest, access controls, and regular security audits.',
    },
    {
      heading: 'Sharing your information',
      content:
        'We do not sell, trade, or rent your personal information to third parties. We may share anonymised, aggregated data for research or statistical purposes. We may disclose your information if required by law, regulation, or legal process, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.',
    },
    {
      heading: 'Cookies and analytics',
      content:
        'RefZone uses essential cookies to maintain your session and preferences. We may use analytics tools to understand how users interact with the platform. These tools collect anonymised usage data and do not identify you personally. You can disable cookies in your browser settings, though this may affect platform functionality.',
    },
    {
      heading: 'Your rights',
      content:
        'Under the Australian Privacy Principles, you have the right to: (a) access the personal information we hold about you; (b) request correction of inaccurate or outdated information; (c) request deletion of your account and associated data; and (d) lodge a complaint with the Office of the Australian Information Commissioner (OAIC) if you believe your privacy has been breached. To exercise any of these rights, contact us at admin@refzone.com.au.',
    },
    {
      heading: 'Third-party services',
      content:
        'RefZone integrates with third-party services for authentication, hosting, and data processing. These providers are bound by their own privacy policies and are contractually required to handle your data securely. We only share the minimum data necessary for these services to function.',
    },
    {
      heading: 'Children\'s privacy',
      content:
        'RefZone is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at admin@refzone.com.au and we will promptly delete it.',
    },
    {
      heading: 'Changes to this policy',
      content:
        'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date. Your continued use of RefZone after any changes constitutes your acceptance of the revised policy.',
    },
    {
      heading: 'Contact us',
      content:
        'If you have questions or concerns about this Privacy Policy or our data practices, please contact us at admin@refzone.com.au.',
    },
  ],
};

// ============================================================
// TERMS PAGE
// ============================================================

export const termsPage = {
  title: 'Terms of Service',
  lastUpdated: '2026-04-05',
  sections: [
    {
      heading: 'Acceptance of terms',
      content:
        'By accessing or using the RefZone platform at refzone.com.au ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Service. We reserve the right to update these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.',
    },
    {
      heading: 'Description of service',
      content:
        'RefZone is an advanced football referee training platform that provides interactive match scenarios, quiz-based assessments, decision analysis, performance analytics, and streak tracking. The Service is designed for educational and training purposes and is not a substitute for official referee accreditation or certification programs.',
    },
    {
      heading: 'Account registration',
      content:
        'To access certain features of the Service, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must notify us immediately at admin@refzone.com.au if you suspect any unauthorised use of your account.',
    },
    {
      heading: 'Acceptable use',
      content:
        'You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not: (a) use the Service to harass, abuse, or harm other users; (b) attempt to gain unauthorised access to any part of the Service; (c) use automated tools to scrape, crawl, or extract data from the Service; (d) impersonate another person or entity; (e) upload malicious code or interfere with the Service\'s operation; or (f) use the Service in any manner that could damage, disable, or impair the platform.',
    },
    {
      heading: 'Intellectual property',
      content:
        'All content on the RefZone platform — including text, graphics, logos, software, scenarios, quiz questions, generated analysis, and user interface designs — is the property of RefZone or its licensors and is protected by Australian and international intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.',
    },
    {
      heading: 'User-generated content',
      content:
        'By submitting content to RefZone, including forum posts, feedback, and Decision Lab queries, you grant RefZone a non-exclusive, worldwide, royalty-free licence to use, reproduce, and display that content for the purpose of operating and improving the Service. You retain ownership of your content and are solely responsible for ensuring it does not violate any third-party rights.',
    },
    {
      heading: 'Generated content disclaimer',
      content:
        'RefZone uses advanced algorithms to generate scenario analysis, quiz explanations, and Decision Lab responses. While we strive for accuracy, generated content is provided for educational purposes only and may contain errors. It should not be treated as a definitive interpretation of the Laws of the Game. Always refer to official IFAB publications and your local football association for authoritative rulings.',
    },
    {
      heading: 'Limitation of liability',
      content:
        'To the maximum extent permitted by Australian law, RefZone and its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Service. Our total liability for any claim arising from the Service shall not exceed the amount you paid to us, if any, in the twelve months preceding the claim.',
    },
    {
      heading: 'Termination',
      content:
        'We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct that we determine violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Service will immediately cease. Provisions that by their nature should survive termination — including intellectual property, limitation of liability, and dispute resolution — will remain in effect.',
    },
    {
      heading: 'Governing law',
      content:
        'These Terms are governed by and construed in accordance with the laws of the Commonwealth of Australia. Any disputes arising from or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Australia.',
    },
    {
      heading: 'Contact us',
      content:
        'If you have questions about these Terms of Service, please contact us at admin@refzone.com.au.',
    },
  ],
};
