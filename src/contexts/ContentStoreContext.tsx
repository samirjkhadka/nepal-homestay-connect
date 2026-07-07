import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Shared taxonomy content managed by admins: Provinces and Amenities.
export type ContentKind = 'province' | 'amenity';

export interface ContentItem {
  id: string;
  kind: ContentKind;
  name: string;
  description: string;
  icon?: string;      // lucide icon name (amenities)
  enabled: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'nh-content-taxonomy-v1';

const slugify = (t: string) =>
  t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const genId = (kind: ContentKind, t: string) => `${kind}-${slugify(t) || 'item'}-${Math.random().toString(36).slice(2, 5)}`;

const seed = (): ContentItem[] => {
  const now = new Date().toISOString();
  const provinces = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];
  const amenities = [
    ['Wi-Fi', 'Wifi'], ['Home-cooked Meals', 'UtensilsCrossed'], ['Hot Water', 'Droplets'],
    ['Mountain View', 'Mountain'], ['Parking', 'Car'], ['Guided Treks', 'Compass'],
    ['Bonfire', 'Flame'], ['Local Transport', 'Bus'],
  ];
  return [
    ...provinces.map((name, i) => ({ id: `province-${slugify(name)}`, kind: 'province' as ContentKind, name: `${name} Province`, description: `Homestays across ${name} Province`, enabled: true, createdAt: now })),
    ...amenities.map(([name, icon]) => ({ id: `amenity-${slugify(name)}`, kind: 'amenity' as ContentKind, name, description: '', icon, enabled: true, createdAt: now })),
  ];
};

interface ContentStoreContextType {
  items: ContentItem[];
  addItem: (data: Partial<ContentItem> & { name: string; kind: ContentKind }) => ContentItem;
  updateItem: (id: string, patch: Partial<ContentItem>) => void;
  deleteItem: (id: string) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  reset: () => void;
}

const ContentStoreContext = createContext<ContentStoreContextType | null>(null);

export function ContentStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ContentItem[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* ignore */ }
    return seed();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const addItem: ContentStoreContextType['addItem'] = useCallback((data) => {
    const created: ContentItem = {
      description: '', enabled: true,
      ...data,
      id: data.id || genId(data.kind, data.name),
      createdAt: new Date().toISOString(),
    } as ContentItem;
    setItems(prev => [created, ...prev]);
    return created;
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<ContentItem>) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const setEnabled = useCallback((id: string, enabled: boolean) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, enabled } : i)));
  }, []);

  const reset = useCallback(() => setItems(seed()), []);

  return (
    <ContentStoreContext.Provider value={{ items, addItem, updateItem, deleteItem, setEnabled, reset }}>
      {children}
    </ContentStoreContext.Provider>
  );
}

export function useContentStore() {
  const ctx = useContext(ContentStoreContext);
  if (!ctx) throw new Error('useContentStore must be used within ContentStoreProvider');
  return ctx;
}
