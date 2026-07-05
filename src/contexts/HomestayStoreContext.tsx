import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { homestaysData, Homestay, HomestayStatus } from '@/data/homestays';

const STORAGE_KEY = 'nh-homestays-v1';

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const genId = (name: string) => `${slugify(name) || 'homestay'}-${Math.random().toString(36).slice(2, 6)}`;

// Seed the store from the static dataset, adding admin management fields.
const seed = (): Homestay[] =>
  Object.values(homestaysData).map((h, i) => ({
    ...h,
    status: 'approved' as HomestayStatus,
    enabled: true,
    featured: i < 4,
    createdAt: h.createdAt ?? new Date(Date.now() - (i + 1) * 86_400_000).toISOString(),
  }));

interface HomestayStoreContextType {
  homestays: Homestay[];
  publicHomestays: Homestay[];
  getById: (id: string) => Homestay | undefined;
  getNearby: (id: string, limit?: number) => Homestay[];
  addHomestay: (data: Omit<Homestay, 'id' | 'status' | 'enabled' | 'featured' | 'createdAt'> & Partial<Homestay>) => Homestay;
  updateHomestay: (id: string, patch: Partial<Homestay>) => void;
  deleteHomestay: (id: string) => void;
  approveHomestay: (id: string) => void;
  rejectHomestay: (id: string, reason: string) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  setFeatured: (id: string, featured: boolean) => void;
  reset: () => void;
}

const HomestayStoreContext = createContext<HomestayStoreContextType | null>(null);

export function HomestayStoreProvider({ children }: { children: ReactNode }) {
  const [homestays, setHomestays] = useState<Homestay[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Homestay[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {
      /* ignore */
    }
    return seed();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(homestays));
    } catch {
      /* ignore */
    }
  }, [homestays]);

  const publicHomestays = useMemo(
    () => homestays.filter(h => h.status === 'approved' && h.enabled !== false),
    [homestays],
  );

  const getById = useCallback((id: string) => homestays.find(h => h.id === id), [homestays]);

  const getNearby = useCallback(
    (id: string, limit = 3) => {
      const current = homestays.find(h => h.id === id);
      if (!current) return [];
      return publicHomestays
        .filter(h => h.id !== id)
        .sort((a, b) => (a.province === current.province ? -1 : 1) - (b.province === current.province ? -1 : 1))
        .slice(0, limit);
    },
    [homestays, publicHomestays],
  );

  const addHomestay: HomestayStoreContextType['addHomestay'] = useCallback((data) => {
    const created: Homestay = {
      rating: 0,
      reviews: 0,
      reviewsList: [],
      itinerary: [],
      bookedDates: [],
      amenities: [],
      images: [],
      ...data,
      id: data.id || genId(data.name),
      status: 'pending',
      enabled: true,
      featured: false,
      createdAt: new Date().toISOString(),
    } as Homestay;
    setHomestays(prev => [created, ...prev]);
    return created;
  }, []);

  const updateHomestay = useCallback((id: string, patch: Partial<Homestay>) => {
    setHomestays(prev => prev.map(h => (h.id === id ? { ...h, ...patch } : h)));
  }, []);

  const deleteHomestay = useCallback((id: string) => {
    setHomestays(prev => prev.filter(h => h.id !== id));
  }, []);

  const approveHomestay = useCallback((id: string) => {
    setHomestays(prev => prev.map(h => (h.id === id ? { ...h, status: 'approved', rejectionReason: undefined } : h)));
  }, []);

  const rejectHomestay = useCallback((id: string, reason: string) => {
    setHomestays(prev => prev.map(h => (h.id === id ? { ...h, status: 'rejected', rejectionReason: reason } : h)));
  }, []);

  const setEnabled = useCallback((id: string, enabled: boolean) => {
    setHomestays(prev => prev.map(h => (h.id === id ? { ...h, enabled } : h)));
  }, []);

  const setFeatured = useCallback((id: string, featured: boolean) => {
    setHomestays(prev => prev.map(h => (h.id === id ? { ...h, featured } : h)));
  }, []);

  const reset = useCallback(() => setHomestays(seed()), []);

  return (
    <HomestayStoreContext.Provider
      value={{
        homestays,
        publicHomestays,
        getById,
        getNearby,
        addHomestay,
        updateHomestay,
        deleteHomestay,
        approveHomestay,
        rejectHomestay,
        setEnabled,
        setFeatured,
        reset,
      }}
    >
      {children}
    </HomestayStoreContext.Provider>
  );
}

export function useHomestayStore() {
  const ctx = useContext(HomestayStoreContext);
  if (!ctx) throw new Error('useHomestayStore must be used within HomestayStoreProvider');
  return ctx;
}
