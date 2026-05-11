import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface HostProperty {
  id: string;
  name: string;
  location: string;
  province: string;
  type: string;
  description: string;
  pricePerNight: number;
  weekendUplift: number;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  badges: string[];
  images: string[];
  coverImage: string;
  rules: { checkIn: string; checkOut: string; houseRules: string };
  published: boolean;
  createdAt: string;
}

export interface HostBooking {
  id: string;
  propertyId: string;
  guest: string;
  guestEmail: string;
  guestAvatar?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
}

export interface HostMessage {
  id: string;
  threadId: string;
  from: 'host' | 'guest';
  body: string;
  at: string;
}
export interface HostThread {
  id: string;
  guest: string;
  guestAvatar?: string;
  propertyName: string;
  unread: boolean;
  lastAt: string;
}

export interface HostReview {
  id: string;
  propertyId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface HostExperienceOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  maxGuests: number;
  imageUrl: string;
}

export interface HostEarnings {
  monthly: { month: string; amount: number }[];
  payouts: { id: string; date: string; amount: number; method: string; status: string }[];
  pendingBalance: number;
  payoutMethod: { type: string; account: string };
}

export interface HostProfileData {
  bio: string;
  videoUrl: string;
  languages: string[];
  family: { id: string; name: string; role: string }[];
  verified: { id: boolean; phone: boolean; email: boolean; address: boolean };
}

export interface HostData {
  properties: HostProperty[];
  bookings: HostBooking[];
  messages: Record<string, HostMessage[]>;
  threads: HostThread[];
  reviews: HostReview[];
  experiences: HostExperienceOffer[];
  blockedDates: string[]; // ISO yyyy-mm-dd
  customPricing: Record<string, number>;
  earnings: HostEarnings;
  profile: HostProfileData;
  settings: {
    notifyEmail: boolean;
    notifySMS: boolean;
    autoAcceptBookings: boolean;
    instantBook: boolean;
  };
}

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

const seedHostData = (): HostData => ({
  properties: [
    {
      id: uid('hp'), name: 'Mountain View Retreat', location: 'Sarangkot', province: 'Gandaki Province',
      type: 'Traditional', description: 'Stunning Himalayan views with home-cooked meals.',
      pricePerNight: 2500, weekendUplift: 500, cleaningFee: 300,
      maxGuests: 4, bedrooms: 2, bathrooms: 1,
      amenities: ['WiFi', 'Hot Water', 'Breakfast', 'Mountain View'],
      badges: ['Eco-certified', 'Female-led'],
      images: ['/placeholder.svg', '/placeholder.svg'],
      coverImage: '/placeholder.svg',
      rules: { checkIn: '14:00', checkOut: '11:00', houseRules: 'No smoking. Quiet hours 10pm–6am.' },
      published: true, createdAt: '2026-01-15',
    },
  ],
  bookings: [
    { id: uid('b'), propertyId: 'p1', guest: 'Sarah Johnson', guestEmail: 'sarah@example.com', checkIn: '2026-05-18', checkOut: '2026-05-21', guests: 2, status: 'pending', amount: 8100 },
    { id: uid('b'), propertyId: 'p1', guest: 'Emma Müller', guestEmail: 'emma@example.com', checkIn: '2026-05-25', checkOut: '2026-05-27', guests: 1, status: 'confirmed', amount: 5500 },
    { id: uid('b'), propertyId: 'p1', guest: 'Raj Patel', guestEmail: 'raj@example.com', checkIn: '2026-04-08', checkOut: '2026-04-11', guests: 4, status: 'completed', amount: 9000 },
  ],
  threads: [
    { id: 't1', guest: 'Sarah Johnson', propertyName: 'Mountain View Retreat', unread: true, lastAt: '2026-05-10T10:30:00Z' },
    { id: 't2', guest: 'Emma Müller', propertyName: 'Mountain View Retreat', unread: false, lastAt: '2026-05-09T16:00:00Z' },
  ],
  messages: {
    t1: [
      { id: uid('m'), threadId: 't1', from: 'guest', body: 'Hi! Is breakfast included?', at: '2026-05-10T09:00:00Z' },
      { id: uid('m'), threadId: 't1', from: 'host', body: 'Yes — a full Nepali breakfast every morning!', at: '2026-05-10T10:30:00Z' },
    ],
    t2: [
      { id: uid('m'), threadId: 't2', from: 'guest', body: 'Looking forward to the stay!', at: '2026-05-09T16:00:00Z' },
    ],
  },
  reviews: [
    { id: uid('r'), propertyId: 'p1', author: 'Raj Patel', rating: 5, comment: 'Stunning views, lovely family.', date: '2026-04-12' },
    { id: uid('r'), propertyId: 'p1', author: 'Lisa Wong', rating: 4, comment: 'Cozy and authentic.', date: '2026-03-28', reply: 'Thank you Lisa!' },
  ],
  experiences: [
    { id: uid('he'), title: 'Sunrise Trek to Sarangkot', description: 'Catch the first golden light on Annapurna.', price: 1500, duration: '3 hours', maxGuests: 6, imageUrl: '/placeholder.svg' },
  ],
  blockedDates: [],
  customPricing: {},
  earnings: {
    monthly: [
      { month: 'Jan', amount: 32000 }, { month: 'Feb', amount: 28000 },
      { month: 'Mar', amount: 41000 }, { month: 'Apr', amount: 38000 },
      { month: 'May', amount: 22000 },
    ],
    payouts: [
      { id: 'po1', date: '2026-04-30', amount: 38000, method: 'eSewa', status: 'paid' },
      { id: 'po2', date: '2026-03-31', amount: 41000, method: 'eSewa', status: 'paid' },
    ],
    pendingBalance: 22000,
    payoutMethod: { type: 'eSewa', account: '98XXXXXX21' },
  },
  profile: {
    bio: 'Born and raised in Sarangkot, I love sharing our family traditions with travelers.',
    videoUrl: '',
    languages: ['Nepali', 'English', 'Hindi'],
    family: [
      { id: uid('fm'), name: 'Deepak (me)', role: 'Host & Guide' },
      { id: uid('fm'), name: 'Maya', role: 'Cook' },
    ],
    verified: { id: true, phone: true, email: true, address: false },
  },
  settings: {
    notifyEmail: true, notifySMS: false, autoAcceptBookings: false, instantBook: false,
  },
});

interface HostDataContextType {
  data: HostData;
  update: <K extends keyof HostData>(key: K, value: HostData[K]) => void;
  reset: () => void;
}

const HostDataContext = createContext<HostDataContextType | null>(null);

export function HostDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = `nh-host-data-${user?.id ?? 'guest'}-v1`;

  const [data, setData] = useState<HostData>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return { ...seedHostData(), ...JSON.parse(stored) };
    } catch (e) { /* ignore */ }
    return seedHostData();
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }, [data, storageKey]);

  const update = useCallback(<K extends keyof HostData>(key: K, value: HostData[K]) => {
    setData(d => ({ ...d, [key]: value }));
  }, []);

  const reset = useCallback(() => setData(seedHostData()), []);

  return (
    <HostDataContext.Provider value={{ data, update, reset }}>
      {children}
    </HostDataContext.Provider>
  );
}

export function useHostData() {
  const ctx = useContext(HostDataContext);
  if (!ctx) throw new Error('useHostData must be used within HostDataProvider');
  return ctx;
}
