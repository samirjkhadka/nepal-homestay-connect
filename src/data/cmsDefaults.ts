// Seed defaults for the CMS store. Mirrors what's hardcoded in components today.

export interface CMSPartner {
  id: string;
  name: string;
  tag: string;
  website?: string;
  logoUrl?: string;
}
export interface CMSPartnerCategory {
  id: string;
  title: string;
  icon: 'CreditCard' | 'Plane' | 'PartyPopper' | 'Building2';
  description: string;
  partners: CMSPartner[];
}

export interface CMSHero {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  slides: { id: string; imageUrl: string; caption?: string }[];
}

export interface CMSFestival {
  id: string;
  name: string;
  month: string;
  region: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

export interface CMSExperience {
  id: string;
  title: string;
  host: string;
  price: number;
  duration: string;
  category: string;
  imageUrl: string;
}

export interface CMSBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  tags: string[];
  author: string;
  publishedAt: string;
  published: boolean;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
}

export interface CMSNavLink {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface CMSFooterColumn {
  id: string;
  title: string;
  links: CMSNavLink[];
}

export interface CMSTheme {
  primary: string; // hsl triplet "20 60% 50%"
  accent: string;
  background: string;
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  defaultDarkMode: boolean;
}

export interface CMSStaticPage {
  slug: string;
  title: string;
  body: string;
}

export interface CMSMediaItem {
  id: string;
  url: string;
  label: string;
  createdAt: string;
}

export interface CMSSectionToggles {
  hero: boolean;
  featured: boolean;
  impact: boolean;
  experiences: boolean;
  villageStories: boolean;
  testimonials: boolean;
  blogs: boolean;
  partners: boolean;
  mobileApp: boolean;
}

export interface CMSContent {
  hero: CMSHero;
  sectionToggles: CMSSectionToggles;
  partners: CMSPartnerCategory[];
  festivals: CMSFestival[];
  experiences: CMSExperience[];
  blogs: CMSBlog[];
  testimonials: CMSTestimonial[];
  navLinks: CMSNavLink[];
  footerColumns: CMSFooterColumn[];
  footerTagline: string;
  socials: { twitter: string; facebook: string; instagram: string; youtube: string };
  theme: CMSTheme;
  staticPages: CMSStaticPage[];
  media: CMSMediaItem[];
}

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export const defaultCMS: CMSContent = {
  hero: {
    headline: 'Discover Authentic Nepali Homestays',
    subheadline: 'Live with local families. Share their stories. Support communities.',
    ctaPrimary: 'Explore Homestays',
    ctaSecondary: 'Plan a Trip',
    slides: [
      { id: uid('s'), imageUrl: '/placeholder.svg', caption: 'Himalayan sunrise' },
      { id: uid('s'), imageUrl: '/placeholder.svg', caption: 'Village mornings' },
    ],
  },
  sectionToggles: {
    hero: true, featured: true, impact: true, experiences: true,
    villageStories: true, testimonials: true, blogs: true, partners: true, mobileApp: true,
  },
  partners: [
    {
      id: uid('cat'), title: 'Payment Partners', icon: 'CreditCard',
      description: 'Secure payments across Nepal and worldwide',
      partners: [
        { id: uid('p'), name: 'eSewa', tag: 'Digital Wallet' },
        { id: uid('p'), name: 'Khalti', tag: 'Mobile Payment' },
        { id: uid('p'), name: 'IME Pay', tag: 'Wallet' },
        { id: uid('p'), name: 'Visa', tag: 'Card Network' },
        { id: uid('p'), name: 'Mastercard', tag: 'Card Network' },
        { id: uid('p'), name: 'Stripe', tag: 'Global Gateway' },
      ],
    },
    {
      id: uid('cat'), title: 'Travel & Tours Partners', icon: 'Plane',
      description: 'Trusted operators for treks, transfers and tours',
      partners: [
        { id: uid('p'), name: 'Himalayan Glacier', tag: 'Trekking' },
        { id: uid('p'), name: 'Buddha Air', tag: 'Domestic Flights' },
        { id: uid('p'), name: 'Yeti Airlines', tag: 'Mountain Flights' },
        { id: uid('p'), name: 'Greenline Tours', tag: 'Transfers' },
      ],
    },
    {
      id: uid('cat'), title: 'Event Partners', icon: 'PartyPopper',
      description: 'Cultural festivals and community celebrations',
      partners: [
        { id: uid('p'), name: 'Nepal Tourism Board', tag: 'Official' },
        { id: uid('p'), name: 'Indra Jatra Committee', tag: 'Festival' },
        { id: uid('p'), name: 'Kathmandu Jazz', tag: 'Music' },
      ],
    },
    {
      id: uid('cat'), title: 'Community & NGO Partners', icon: 'Building2',
      description: 'Driving sustainable, women-led tourism',
      partners: [
        { id: uid('p'), name: 'HomeNet Nepal', tag: 'Women Empowerment' },
        { id: uid('p'), name: 'WWF Nepal', tag: 'Conservation' },
        { id: uid('p'), name: 'Mountain Trust', tag: 'Eco Tourism' },
      ],
    },
  ],
  festivals: [
    { id: uid('f'), name: 'Dashain', month: 'October', region: 'Nationwide', description: 'The longest Hindu festival celebrating victory of good over evil.', imageUrl: '/placeholder.svg', featured: true },
    { id: uid('f'), name: 'Tihar', month: 'November', region: 'Nationwide', description: 'Festival of lights, honoring animals and the goddess Laxmi.', imageUrl: '/placeholder.svg', featured: true },
    { id: uid('f'), name: 'Holi', month: 'March', region: 'Terai', description: 'Festival of colors marking the arrival of spring.', imageUrl: '/placeholder.svg', featured: false },
    { id: uid('f'), name: 'Indra Jatra', month: 'September', region: 'Kathmandu', description: 'Eight-day festival honoring the Hindu god Indra.', imageUrl: '/placeholder.svg', featured: false },
  ],
  experiences: [
    { id: uid('x'), title: 'Newari Cooking Class', host: 'Sita Maharjan', price: 1500, duration: '3 hours', category: 'Food', imageUrl: '/placeholder.svg' },
    { id: uid('x'), title: 'Sunrise Village Walk', host: 'Deepak Gurung', price: 800, duration: '2 hours', category: 'Nature', imageUrl: '/placeholder.svg' },
    { id: uid('x'), title: 'Tharu Stick Dance Evening', host: 'Tharu Cultural Center', price: 1200, duration: '2 hours', category: 'Culture', imageUrl: '/placeholder.svg' },
  ],
  blogs: [
    { id: uid('b'), title: '7 Hidden Homestays in the Annapurna Region', slug: 'hidden-annapurna-homestays', excerpt: 'Skip the trekking lodges and stay with local families.', body: 'Full article body here...', coverUrl: '/placeholder.svg', tags: ['trekking', 'annapurna'], author: 'Lovable Travel', publishedAt: '2026-04-12', published: true },
    { id: uid('b'), title: 'A Cook\'s Guide to Newari Cuisine', slug: 'newari-cuisine-guide', excerpt: 'From yomari to chatamari — the dishes you must try.', body: 'Full article body here...', coverUrl: '/placeholder.svg', tags: ['food', 'culture'], author: 'Lovable Travel', publishedAt: '2026-03-28', published: true },
  ],
  testimonials: [
    { id: uid('t'), name: 'Sarah Johnson', location: 'United Kingdom', quote: 'Staying with the Gurung family was the highlight of our trip — pure magic.', rating: 5 },
    { id: uid('t'), name: 'Takeshi Yamamoto', location: 'Japan', quote: 'Authentic, warm, and beautifully organised. We\'ll be back.', rating: 5 },
    { id: uid('t'), name: 'Emma Müller', location: 'Germany', quote: 'The Tharu cultural homestay opened my eyes to a side of Nepal I never knew.', rating: 5 },
  ],
  navLinks: [
    { id: uid('n'), label: 'Homestays', href: '/homestays', visible: true },
    { id: uid('n'), label: 'Experiences', href: '/experiences', visible: true },
    { id: uid('n'), label: 'Destinations', href: '/destinations', visible: true },
    { id: uid('n'), label: 'Festivals', href: '/festivals', visible: true },
    { id: uid('n'), label: 'Blog', href: '/blogs', visible: true },
    { id: uid('n'), label: 'About', href: '/about', visible: true },
  ],
  footerColumns: [
    {
      id: uid('fc'), title: 'Company',
      links: [
        { id: uid('l'), label: 'About Us', href: '/about', visible: true },
        { id: uid('l'), label: 'Team', href: '/team', visible: true },
        { id: uid('l'), label: 'Careers', href: '/careers', visible: true },
        { id: uid('l'), label: 'Press', href: '/press', visible: true },
      ],
    },
    {
      id: uid('fc'), title: 'Support',
      links: [
        { id: uid('l'), label: 'Help Center', href: '/help', visible: true },
        { id: uid('l'), label: 'Safety', href: '/safety', visible: true },
        { id: uid('l'), label: 'Cancellation', href: '/cancellation', visible: true },
        { id: uid('l'), label: 'FAQs', href: '/faqs', visible: true },
      ],
    },
    {
      id: uid('fc'), title: 'Legal',
      links: [
        { id: uid('l'), label: 'Privacy', href: '/privacy', visible: true },
        { id: uid('l'), label: 'Terms', href: '/terms', visible: true },
        { id: uid('l'), label: 'Cookies', href: '/cookies', visible: true },
      ],
    },
  ],
  footerTagline: 'Authentic homestays across Nepal. Made with ❤️ in Kathmandu.',
  socials: {
    twitter: 'https://twitter.com', facebook: 'https://facebook.com',
    instagram: 'https://instagram.com', youtube: 'https://youtube.com',
  },
  theme: {
    primary: '20 65% 48%',
    accent: '38 92% 50%',
    background: '40 30% 98%',
    siteName: 'Nepali Homestays',
    logoUrl: '',
    faviconUrl: '/favicon.ico',
    defaultDarkMode: false,
  },
  staticPages: [
    { slug: 'about', title: 'About Us', body: 'We connect travelers with authentic Nepali homestays...' },
    { slug: 'contact', title: 'Contact', body: 'Get in touch at hello@nepalihomestays.com' },
    { slug: 'privacy', title: 'Privacy Policy', body: 'We respect your privacy...' },
    { slug: 'terms', title: 'Terms of Service', body: 'By using our service you agree...' },
    { slug: 'cancellation', title: 'Cancellation Policy', body: 'Free cancellation up to 7 days before check-in...' },
    { slug: 'safety', title: 'Safety', body: 'Your safety is our top priority...' },
  ],
  media: [
    { id: uid('m'), url: '/placeholder.svg', label: 'Placeholder', createdAt: '2026-01-01' },
  ],
};
