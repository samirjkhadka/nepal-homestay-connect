import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CMSContent, defaultCMS } from '@/data/cmsDefaults';

const STORAGE_KEY = 'nh-cms-v1';

interface CMSContextType {
  content: CMSContent;
  update: <K extends keyof CMSContent>(key: K, value: CMSContent[K]) => void;
  patch: (partial: Partial<CMSContent>) => void;
  reset: () => void;
}

const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CMSContent>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // shallow-merge defaults so new fields appear after upgrades
        return { ...defaultCMS, ...parsed };
      }
    } catch (e) { /* ignore */ }
    return defaultCMS;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(content)); } catch (e) { /* ignore */ }
  }, [content]);

  const update = useCallback(<K extends keyof CMSContent>(key: K, value: CMSContent[K]) => {
    setContent(c => ({ ...c, [key]: value }));
  }, []);

  const patch = useCallback((partial: Partial<CMSContent>) => {
    setContent(c => ({ ...c, ...partial }));
  }, []);

  const reset = useCallback(() => setContent(defaultCMS), []);

  return (
    <CMSContext.Provider value={{ content, update, patch, reset }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used within CMSProvider');
  return ctx;
}
