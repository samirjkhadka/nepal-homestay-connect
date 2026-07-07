import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export type ArticleType = 'blog' | 'news';
export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: string;
  type: ArticleType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  author: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  createdAt: string;   // ISO
  publishedAt?: string; // YYYY-MM-DD
}

const STORAGE_KEY = 'nh-articles-v1';

const slugify = (t: string) =>
  t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const genId = (t: string) => `${slugify(t) || 'article'}-${Math.random().toString(36).slice(2, 6)}`;

const seed = (): Article[] => {
  const now = Date.now();
  const d = (n: number) => new Date(now - n * 86_400_000).toISOString();
  const day = (n: number) => new Date(now - n * 86_400_000).toISOString().slice(0, 10);
  return [
    { id: 'a-himalaya-homestays', type: 'blog', title: 'Top 10 Homestays in the Himalayas for 2026', slug: 'top-10-homestays-himalayas-2026', excerpt: 'Discover the most breathtaking homestay experiences nestled in the majestic Himalayan mountains.', body: 'Full article body…', coverUrl: '/placeholder.svg', author: 'Anisha Rai', category: 'Travel', tags: ['himalaya', 'homestay'], status: 'published', createdAt: d(12), publishedAt: day(12) },
    { id: 'a-tea-culture', type: 'blog', title: 'A Guide to Nepali Tea Culture', slug: 'nepali-tea-culture-guide', excerpt: 'From Ilam gardens to your host family kitchen — the rituals behind every cup.', body: 'Full article body…', coverUrl: '/placeholder.svg', author: 'Pradeep Sharma', category: 'Culture', tags: ['tea', 'culture'], status: 'published', createdAt: d(20), publishedAt: day(20) },
    { id: 'a-monsoon-tips', type: 'blog', title: 'Monsoon Travel Tips for Rural Nepal', slug: 'monsoon-travel-tips', excerpt: 'How to make the most of the green season while staying safe and dry.', body: 'Full article body…', coverUrl: '/placeholder.svg', author: 'Editorial', category: 'Tips', tags: ['monsoon', 'safety'], status: 'draft', createdAt: d(3) },
    { id: 'n-new-provinces', type: 'news', title: 'NepalHomestay Expands to Karnali Province', slug: 'expansion-karnali-province', excerpt: 'Twelve new verified homestays now welcome guests across remote Karnali.', body: 'Full article body…', coverUrl: '/placeholder.svg', author: 'Press Team', category: 'Company', tags: ['expansion'], status: 'published', createdAt: d(2), publishedAt: day(2) },
    { id: 'n-award', type: 'news', title: 'Community Tourism Award 2026 Announced', slug: 'community-tourism-award-2026', excerpt: 'Our host network recognized for sustainable rural tourism impact.', body: 'Full article body…', coverUrl: '/placeholder.svg', author: 'Press Team', category: 'Awards', tags: ['award'], status: 'draft', createdAt: d(1) },
  ];
};

interface ArticleStoreContextType {
  articles: Article[];
  publicArticles: Article[];
  getBySlug: (slug: string) => Article | undefined;
  addArticle: (data: Partial<Article> & { title: string; type: ArticleType }) => Article;
  updateArticle: (id: string, patch: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  setPublished: (id: string, published: boolean) => void;
  reset: () => void;
}

const ArticleStoreContext = createContext<ArticleStoreContextType | null>(null);

export function ArticleStoreProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Article[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* ignore */ }
    return seed();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(articles)); } catch { /* ignore */ }
  }, [articles]);

  const publicArticles = useMemo(() => articles.filter(a => a.status === 'published'), [articles]);
  const getBySlug = useCallback((slug: string) => articles.find(a => a.slug === slug), [articles]);

  const addArticle: ArticleStoreContextType['addArticle'] = useCallback((data) => {
    const created: Article = {
      excerpt: '', body: '', coverUrl: '/placeholder.svg', author: 'Editor',
      category: 'General', tags: [], status: 'draft',
      ...data,
      slug: data.slug || slugify(data.title),
      id: data.id || genId(data.title),
      createdAt: new Date().toISOString(),
    } as Article;
    setArticles(prev => [created, ...prev]);
    return created;
  }, []);

  const updateArticle = useCallback((id: string, patch: Partial<Article>) => {
    setArticles(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  }, []);

  const setPublished = useCallback((id: string, published: boolean) => {
    setArticles(prev => prev.map(a => (a.id === id ? {
      ...a,
      status: published ? 'published' : 'draft',
      publishedAt: published ? (a.publishedAt ?? new Date().toISOString().slice(0, 10)) : a.publishedAt,
    } : a)));
  }, []);

  const reset = useCallback(() => setArticles(seed()), []);

  return (
    <ArticleStoreContext.Provider value={{ articles, publicArticles, getBySlug, addArticle, updateArticle, deleteArticle, setPublished, reset }}>
      {children}
    </ArticleStoreContext.Provider>
  );
}

export function useArticleStore() {
  const ctx = useContext(ArticleStoreContext);
  if (!ctx) throw new Error('useArticleStore must be used within ArticleStoreProvider');
  return ctx;
}
