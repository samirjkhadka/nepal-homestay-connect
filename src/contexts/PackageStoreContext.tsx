import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export type PackageStatus = 'draft' | 'published';

export interface TravelPackage {
  id: string;
  name: string;
  category: string;      // e.g. Trekking, Cultural, Wildlife
  duration: string;      // e.g. "7-10 days"
  difficulty: string;
  price: number;         // NPR
  rating: number;
  reviews: number;       // used as popularity signal
  imageUrl: string;
  description: string;
  highlights: string[];
  enabled: boolean;      // visible on public site when true
  status: PackageStatus;
  createdAt: string;
}

const STORAGE_KEY = 'nh-packages-v1';

const slugify = (t: string) =>
  t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const genId = (t: string) => `${slugify(t) || 'package'}-${Math.random().toString(36).slice(2, 6)}`;

const seed = (): TravelPackage[] => {
  const now = Date.now();
  const d = (n: number) => new Date(now - n * 86_400_000).toISOString();
  return [
    { id: 'annapurna-circuit', name: 'Annapurna Circuit Trek', category: 'Trekking', duration: '14-21 days', difficulty: 'Moderate to Challenging', price: 85000, rating: 4.9, reviews: 234, imageUrl: '/placeholder.svg', description: 'The classic Himalayan trek circling the Annapurna massif.', highlights: ['Cross Thorong La Pass', 'Visit Muktinath Temple'], enabled: true, status: 'published', createdAt: d(30) },
    { id: 'everest-base-camp', name: 'Everest Base Camp Trek', category: 'Trekking', duration: '12-16 days', difficulty: 'Moderate to Challenging', price: 95000, rating: 4.9, reviews: 312, imageUrl: '/placeholder.svg', description: 'Walk to the base of the world\'s highest peak.', highlights: ['Stand at Everest Base Camp', 'Sherpa culture immersion'], enabled: true, status: 'published', createdAt: d(28) },
    { id: 'langtang-valley', name: 'Langtang Valley Trek', category: 'Trekking', duration: '7-10 days', difficulty: 'Moderate', price: 45000, rating: 4.8, reviews: 156, imageUrl: '/placeholder.svg', description: 'A shorter trek with stunning mountain views and Tamang culture.', highlights: ['Tamang heritage villages', 'Cheese factory visit'], enabled: true, status: 'published', createdAt: d(25) },
    { id: 'chitwan-wildlife', name: 'Chitwan Wildlife Safari', category: 'Wildlife', duration: '3-4 days', difficulty: 'Easy', price: 28000, rating: 4.7, reviews: 98, imageUrl: '/placeholder.svg', description: 'Jungle safari in Chitwan National Park with homestay evenings.', highlights: ['Rhino spotting', 'Tharu cultural show'], enabled: true, status: 'published', createdAt: d(18) },
    { id: 'kathmandu-heritage', name: 'Kathmandu Heritage Walk', category: 'Cultural', duration: '2-3 days', difficulty: 'Easy', price: 18000, rating: 4.6, reviews: 64, imageUrl: '/placeholder.svg', description: 'Explore UNESCO durbar squares and living traditions.', highlights: ['Boudhanath Stupa', 'Newari feast'], enabled: false, status: 'draft', createdAt: d(6) },
  ];
};

interface PackageStoreContextType {
  packages: TravelPackage[];
  publicPackages: TravelPackage[];
  getById: (id: string) => TravelPackage | undefined;
  addPackage: (data: Partial<TravelPackage> & { name: string }) => TravelPackage;
  updatePackage: (id: string, patch: Partial<TravelPackage>) => void;
  deletePackage: (id: string) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  reset: () => void;
}

const PackageStoreContext = createContext<PackageStoreContextType | null>(null);

export function PackageStoreProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<TravelPackage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TravelPackage[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* ignore */ }
    return seed();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(packages)); } catch { /* ignore */ }
  }, [packages]);

  const publicPackages = useMemo(
    () => packages.filter(p => p.status === 'published' && p.enabled),
    [packages],
  );
  const getById = useCallback((id: string) => packages.find(p => p.id === id), [packages]);

  const addPackage: PackageStoreContextType['addPackage'] = useCallback((data) => {
    const created: TravelPackage = {
      category: 'Trekking', duration: '', difficulty: 'Moderate', price: 0,
      rating: 0, reviews: 0, imageUrl: '/placeholder.svg', description: '',
      highlights: [], enabled: true, status: 'draft',
      ...data,
      id: data.id || genId(data.name),
      createdAt: new Date().toISOString(),
    } as TravelPackage;
    setPackages(prev => [created, ...prev]);
    return created;
  }, []);

  const updatePackage = useCallback((id: string, patch: Partial<TravelPackage>) => {
    setPackages(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deletePackage = useCallback((id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  }, []);

  const setEnabled = useCallback((id: string, enabled: boolean) => {
    setPackages(prev => prev.map(p => (p.id === id ? { ...p, enabled } : p)));
  }, []);

  const reset = useCallback(() => setPackages(seed()), []);

  return (
    <PackageStoreContext.Provider value={{ packages, publicPackages, getById, addPackage, updatePackage, deletePackage, setEnabled, reset }}>
      {children}
    </PackageStoreContext.Provider>
  );
}

export function usePackageStore() {
  const ctx = useContext(PackageStoreContext);
  if (!ctx) throw new Error('usePackageStore must be used within PackageStoreProvider');
  return ctx;
}
