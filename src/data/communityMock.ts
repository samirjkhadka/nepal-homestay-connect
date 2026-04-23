// Mock data for community-tourism features (Tier 1-5).
// Designed so each export can be replaced with a real API call later
// without touching component code (same shape).

export type ExperienceBadge =
  | 'verified-local'
  | 'organic-meals'
  | 'eco-certified'
  | 'female-led'
  | 'indigenous-owned'
  | 'cultural-heritage';

export const badgeMeta: Record<ExperienceBadge, { label: string; emoji: string; description: string; tone: string }> = {
  'verified-local': {
    label: 'Verified Local Host',
    emoji: '✅',
    description: 'Host identity and property verified by our community team.',
    tone: 'bg-primary/10 text-primary border-primary/30',
  },
  'organic-meals': {
    label: 'Organic Farm-to-Table',
    emoji: '🌿',
    description: 'Meals are sourced from the host\'s farm or local growers.',
    tone: 'bg-secondary/15 text-secondary border-secondary/30',
  },
  'eco-certified': {
    label: 'Eco-Certified',
    emoji: '♻️',
    description: 'Solar power, composting, and plastic-free practices.',
    tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  'female-led': {
    label: 'Female-Led',
    emoji: '👩',
    description: 'Owned and operated primarily by women in the household.',
    tone: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/30',
  },
  'indigenous-owned': {
    label: 'Indigenous-Owned',
    emoji: '🪶',
    description: 'Owned by an indigenous Nepali community.',
    tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  'cultural-heritage': {
    label: 'Cultural Heritage',
    emoji: '🏛️',
    description: 'Property is recognized for cultural or architectural heritage.',
    tone: 'bg-accent/15 text-accent-foreground border-accent/40',
  },
};

// Per-homestay badge assignments (mock — would come from API).
export const homestayBadges: Record<string, ExperienceBadge[]> = {
  'mountain-view-retreat': ['verified-local', 'organic-meals', 'eco-certified', 'cultural-heritage'],
  'lakeside-haven': ['verified-local', 'female-led', 'organic-meals'],
  'heritage-house': ['verified-local', 'cultural-heritage', 'indigenous-owned'],
  'tea-garden-stay': ['verified-local', 'organic-meals', 'eco-certified', 'female-led'],
  'jungle-lodge': ['verified-local', 'eco-certified', 'indigenous-owned'],
  'monastery-retreat': ['verified-local', 'cultural-heritage', 'organic-meals'],
};

// Default badge set (fallback for homestays without a specific assignment)
export const defaultBadges: ExperienceBadge[] = ['verified-local', 'organic-meals'];

export function getBadgesFor(id: string): ExperienceBadge[] {
  return homestayBadges[id] ?? defaultBadges;
}

// ---------- Local experiences (booking add-ons) ----------
export interface LocalExperience {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  pricePerPerson: number; // NPR
  description: string;
}

export const localExperiences: LocalExperience[] = [
  { id: 'cooking', title: 'Cooking class with grandma', emoji: '🍲', duration: '2.5 hrs', pricePerPerson: 1200, description: 'Learn to make momos and dal bhat from scratch with the host family.' },
  { id: 'yoga', title: 'Sunrise yoga at viewpoint', emoji: '🧘', duration: '1.5 hrs', pricePerPerson: 800, description: 'Greet the Himalayas with a guided yoga and breathwork session.' },
  { id: 'village-walk', title: 'Village walk with local guide', emoji: '🚶', duration: '3 hrs', pricePerPerson: 1000, description: 'Visit the school, temple, farms, and meet artisans.' },
  { id: 'photoshoot', title: 'Traditional dress photoshoot', emoji: '📸', duration: '1 hr', pricePerPerson: 1500, description: 'Wear traditional Nepali attire with a local photographer.' },
  { id: 'farming', title: 'Farming day experience', emoji: '🌾', duration: '4 hrs', pricePerPerson: 900, description: 'Plant, harvest, and share lunch with the farming family.' },
  { id: 'momo', title: 'Momo-making workshop', emoji: '🥟', duration: '1.5 hrs', pricePerPerson: 700, description: 'Hands-on workshop folding and steaming traditional momos.' },
];

// ---------- Meet the Community ----------
export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  emoji: string;
  bio: string;
}

export const communityMembers: Record<string, CommunityMember[]> = {
  default: [
    { id: 'aama', name: 'Aama Sita', role: 'Cook & matriarch', emoji: '👵', bio: 'Has been cooking for guests for 18 years. Famous for her tomato achar.' },
    { id: 'krishna', name: 'Krishna', role: 'Trekking guide', emoji: '🧗', bio: 'Lifelong local — knows every viewpoint, river crossing, and shortcut.' },
    { id: 'maya', name: 'Maya didi', role: 'Weaver & artisan', emoji: '🧶', bio: 'Hand-weaves dhaka shawls. Workshops available on request.' },
    { id: 'ramesh', name: 'Ramesh dai', role: 'Organic farmer', emoji: '🌽', bio: 'Supplies most of the homestay\'s vegetables. Loves sharing seeds with guests.' },
    { id: 'priya', name: 'Priya', role: 'Schoolteacher', emoji: '📚', bio: 'Runs the village school. Guests are welcome to visit and read with the kids.' },
  ],
};

export function getCommunityFor(_id: string): CommunityMember[] {
  return communityMembers.default;
}

// ---------- Price transparency (where money goes) ----------
export const priceBreakdown = [
  { label: 'Host family', percent: 70, color: 'hsl(var(--primary))' },
  { label: 'Community fund', percent: 15, color: 'hsl(var(--secondary))' },
  { label: 'Platform', percent: 10, color: 'hsl(var(--accent))' },
  { label: 'Taxes', percent: 5, color: 'hsl(var(--muted-foreground))' },
];

// ---------- Cultural calendar / festivals ----------
export interface Festival {
  id: string;
  name: string;
  month: string;
  monthIndex: number; // 0-11
  region: string;
  emoji: string;
  description: string;
  duration: string;
}

export const festivals: Festival[] = [
  { id: 'maghe-sankranti', name: 'Maghe Sankranti', month: 'January', monthIndex: 0, region: 'Nationwide', emoji: '🌞', description: 'Winter solstice festival celebrated with sesame sweets and holy dips in rivers.', duration: '1 day' },
  { id: 'lhosar', name: 'Sonam Lhosar', month: 'February', monthIndex: 1, region: 'Tamang regions', emoji: '🐉', description: 'Tamang New Year celebrated with masked dances and family feasts.', duration: '3 days' },
  { id: 'holi', name: 'Holi (Phagu Purnima)', month: 'March', monthIndex: 2, region: 'Nationwide', emoji: '🎨', description: 'Festival of colors marking the arrival of spring.', duration: '2 days' },
  { id: 'new-year', name: 'Nepali New Year', month: 'April', monthIndex: 3, region: 'Bhaktapur & nationwide', emoji: '🎉', description: 'Bisket Jatra in Bhaktapur — chariot pulling and ritual processions.', duration: '9 days' },
  { id: 'buddha-jayanti', name: 'Buddha Jayanti', month: 'May', monthIndex: 4, region: 'Lumbini & Kathmandu', emoji: '🪷', description: 'Birthday of Lord Buddha. Lumbini hosts the largest celebrations.', duration: '1 day' },
  { id: 'janai-purnima', name: 'Janai Purnima', month: 'August', monthIndex: 7, region: 'Nationwide', emoji: '🧵', description: 'Sacred thread festival; pilgrimage to Gosaikunda lake.', duration: '1 day' },
  { id: 'indra-jatra', name: 'Indra Jatra', month: 'September', monthIndex: 8, region: 'Kathmandu Valley', emoji: '🎭', description: 'Newari festival with masked dances and the Living Goddess Kumari procession.', duration: '8 days' },
  { id: 'dashain', name: 'Dashain', month: 'October', monthIndex: 9, region: 'Nationwide', emoji: '🪁', description: 'Biggest Hindu festival in Nepal — kite flying, family gatherings, tika blessings.', duration: '15 days' },
  { id: 'tihar', name: 'Tihar', month: 'November', monthIndex: 10, region: 'Nationwide', emoji: '🪔', description: 'Festival of lights — homes glow with diyas and rangoli for 5 nights.', duration: '5 days' },
  { id: 'mani-rimdu', name: 'Mani Rimdu', month: 'November', monthIndex: 10, region: 'Khumbu / Solukhumbu', emoji: '⛰️', description: 'Sherpa Buddhist festival with masked dances at Tengboche monastery.', duration: '3 days' },
];

// ---------- Phrasebook ----------
export interface Phrase {
  english: string;
  nepali: string;
  pronunciation: string;
}

export const phrasebook: Phrase[] = [
  { english: 'Hello / Greetings', nepali: 'नमस्ते', pronunciation: 'Namaste' },
  { english: 'Thank you', nepali: 'धन्यवाद', pronunciation: 'Dhanyabad' },
  { english: 'Yes', nepali: 'हो / हजुर', pronunciation: 'Ho / Hajur' },
  { english: 'No', nepali: 'होइन', pronunciation: 'Hoina' },
  { english: 'Please', nepali: 'कृपया', pronunciation: 'Kripaya' },
  { english: 'Sorry / Excuse me', nepali: 'माफ गर्नुहोस्', pronunciation: 'Maaf garnuhos' },
  { english: 'How are you?', nepali: 'तपाईंलाई कस्तो छ?', pronunciation: 'Tapailai kasto chha?' },
  { english: 'I am good', nepali: 'म ठिक छु', pronunciation: 'Ma thik chhu' },
  { english: 'My name is...', nepali: 'मेरो नाम ... हो', pronunciation: 'Mero naam ... ho' },
  { english: 'What is your name?', nepali: 'तपाईंको नाम के हो?', pronunciation: 'Tapaiko naam ke ho?' },
  { english: 'How much?', nepali: 'कति पर्छ?', pronunciation: 'Kati parchha?' },
  { english: 'Where is...?', nepali: '... कहाँ छ?', pronunciation: '... kahaa chha?' },
  { english: 'Water', nepali: 'पानी', pronunciation: 'Paani' },
  { english: 'Food', nepali: 'खाना', pronunciation: 'Khaana' },
  { english: 'Delicious', nepali: 'मिठो', pronunciation: 'Mitho' },
  { english: 'Beautiful', nepali: 'राम्रो', pronunciation: 'Ramro' },
  { english: 'Help', nepali: 'सहयोग', pronunciation: 'Sahayog' },
  { english: 'Goodbye', nepali: 'बिदा', pronunciation: 'Bida' },
  { english: 'Good morning', nepali: 'शुभ प्रभात', pronunciation: 'Shubha prabhat' },
  { english: 'Good night', nepali: 'शुभ रात्री', pronunciation: 'Shubha ratri' },
];

// ---------- Currency ----------
export interface Currency {
  code: string;
  symbol: string;
  rate: number; // 1 NPR = rate * currency
  name: string;
}

export const currencies: Currency[] = [
  { code: 'NPR', symbol: 'रु', name: 'Nepali Rupee', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0075 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0069 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 0.625 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0059 },
];

// ---------- Weather (mock per region) ----------
export interface MonthlyWeather { month: string; high: number; low: number; rating: 1 | 2 | 3 | 4 | 5; }

export const bestTimeData: Record<string, MonthlyWeather[]> = {
  default: [
    { month: 'Jan', high: 17, low: 2,  rating: 3 },
    { month: 'Feb', high: 19, low: 4,  rating: 3 },
    { month: 'Mar', high: 24, low: 8,  rating: 5 },
    { month: 'Apr', high: 27, low: 12, rating: 5 },
    { month: 'May', high: 29, low: 15, rating: 4 },
    { month: 'Jun', high: 28, low: 18, rating: 2 },
    { month: 'Jul', high: 27, low: 19, rating: 1 },
    { month: 'Aug', high: 27, low: 19, rating: 1 },
    { month: 'Sep', high: 27, low: 17, rating: 4 },
    { month: 'Oct', high: 25, low: 12, rating: 5 },
    { month: 'Nov', high: 22, low: 7,  rating: 5 },
    { month: 'Dec', high: 19, low: 3,  rating: 3 },
  ],
};

export interface CurrentWeather { tempC: number; condition: string; emoji: string; humidity: number; wind: number; }
export const currentWeather: CurrentWeather = {
  tempC: 22, condition: 'Partly cloudy', emoji: '⛅', humidity: 58, wind: 12,
};

// ---------- Village stories (mini-blog per homestay) ----------
export interface VillageStory { id: string; title: string; emoji: string; excerpt: string; readMins: number; }
export const villageStories: VillageStory[] = [
  { id: '1', title: 'The legend of the wishing tree', emoji: '🌳', excerpt: 'Behind our homestay stands a 200-year-old peepal tree. Locals tie red threads…', readMins: 3 },
  { id: '2', title: 'Aama\'s secret tomato achar recipe', emoji: '🍅', excerpt: 'Every guest asks for it. Here\'s how she prepares it through three seasons…', readMins: 4 },
  { id: '3', title: 'When the monsoon paints the terraces', emoji: '🌧️', excerpt: 'Why July is our most beautiful — and trickiest — month…', readMins: 2 },
  { id: '4', title: 'Tihar 2025: the night the village glowed', emoji: '🪔', excerpt: 'Photos from last year\'s festival of lights and what to expect this season…', readMins: 5 },
];

// ---------- Guest photo wall ----------
export const guestPhotoWall: { id: string; src: string; author: string }[] = [
  // Reuse existing assets so wall always renders.
];

// ---------- Suggested trip routes ----------
export interface TripRoute { id: string; name: string; days: number; emoji: string; stops: string[]; description: string; }
export const tripRoutes: TripRoute[] = [
  { id: '1', name: 'Annapurna Homestay Trail', days: 7,  emoji: '🏔️', stops: ['Pokhara', 'Sarangkot', 'Ghandruk', 'Tatopani'], description: 'Classic Annapurna foothills loop staying with local Gurung families.' },
  { id: '2', name: 'Cultural Kathmandu Valley', days: 7,  emoji: '🛕', stops: ['Bhaktapur', 'Patan', 'Kirtipur', 'Bungamati'], description: 'Heritage homestays in Newari towns of the valley.' },
  { id: '3', name: 'East to West Grand Tour',  days: 21, emoji: '🌏', stops: ['Ilam', 'Kathmandu', 'Pokhara', 'Lumbini', 'Bardia'], description: 'A three-week journey across all of Nepal\'s climate zones.' },
  { id: '4', name: 'Spiritual Lumbini & Mustang', days: 14, emoji: '🪷', stops: ['Lumbini', 'Pokhara', 'Jomsom', 'Muktinath'], description: 'Buddhist and Hindu pilgrimage circuit with monastery stays.' },
];
