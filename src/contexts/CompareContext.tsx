import { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CompareContext = createContext<Ctx | null>(null);
const MAX = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    setIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  };

  return (
    <CompareContext.Provider value={{ ids, toggle, clear: () => setIds([]), has: id => ids.includes(id), open, setOpen }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
}
