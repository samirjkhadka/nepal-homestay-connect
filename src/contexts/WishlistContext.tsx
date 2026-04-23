import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface WishlistCollection {
  id: string;
  name: string;
  homestayIds: string[];
}

interface Ctx {
  collections: WishlistCollection[];
  createCollection: (name: string) => string;
  renameCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  toggleInCollection: (collectionId: string, homestayId: string) => void;
  isSaved: (homestayId: string) => boolean;
}

const WishlistContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'nh-wishlist-collections-v1';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<WishlistCollection[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [{ id: 'default', name: 'My favourites', homestayIds: [] }];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  const createCollection = (name: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setCollections(c => [...c, { id, name, homestayIds: [] }]);
    return id;
  };

  const renameCollection = (id: string, name: string) =>
    setCollections(c => c.map(col => (col.id === id ? { ...col, name } : col)));

  const deleteCollection = (id: string) =>
    setCollections(c => c.filter(col => col.id !== id));

  const toggleInCollection = (collectionId: string, homestayId: string) =>
    setCollections(c => c.map(col => col.id !== collectionId ? col : ({
      ...col,
      homestayIds: col.homestayIds.includes(homestayId)
        ? col.homestayIds.filter(x => x !== homestayId)
        : [...col.homestayIds, homestayId],
    })));

  const isSaved = (homestayId: string) =>
    collections.some(col => col.homestayIds.includes(homestayId));

  return (
    <WishlistContext.Provider value={{ collections, createCollection, renameCollection, deleteCollection, toggleInCollection, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
