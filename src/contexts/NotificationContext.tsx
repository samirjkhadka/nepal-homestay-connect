import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserRole } from '@/contexts/AuthContext';

export type NotificationType = 'booking' | 'message' | 'payout' | 'review' | 'system' | 'alert';

export interface AppNotification {
  id: string;
  audience: UserRole | 'all';
  type: NotificationType;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
}

const STORAGE_KEY = 'nh-notifications-v1';
const uid = () => `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const seed = (): AppNotification[] => {
  const now = Date.now();
  const m = (n: number) => new Date(now - n * 60_000).toISOString();
  return [
    { id: uid(), audience: 'host', type: 'booking', title: 'New booking request', body: 'Sarah Johnson requested 18–21 May at Mountain View Retreat.', at: m(12), read: false, href: '/host/bookings' },
    { id: uid(), audience: 'host', type: 'message', title: 'New message', body: 'Emma Müller sent you a message.', at: m(48), read: false, href: '/host/inbox' },
    { id: uid(), audience: 'host', type: 'payout', title: 'Payout completed', body: 'NPR 38,000 was sent to your eSewa account.', at: m(600), read: true, href: '/host/earnings' },
    { id: uid(), audience: 'guest', type: 'booking', title: 'Booking confirmed', body: 'Your stay at Mountain View Retreat is confirmed.', at: m(30), read: false, href: '/guest' },
    { id: uid(), audience: 'guest', type: 'review', title: 'How was your stay?', body: 'Leave a review for Lakeside Heritage Home.', at: m(1440), read: false, href: '/guest' },
    { id: uid(), audience: 'admin', type: 'alert', title: 'New host application', body: 'Anjali Tamang submitted a host application for review.', at: m(20), read: false, href: '/admin/verification' },
    { id: uid(), audience: 'admin', type: 'alert', title: 'Dispute opened', body: 'A refund dispute was opened on booking b-8790.', at: m(90), read: false, href: '/admin/disputes' },
    { id: uid(), audience: 'admin', type: 'system', title: 'Daily report ready', body: '24 new bookings, NPR 412,000 in volume today.', at: m(720), read: true, href: '/admin/analytics' },
  ];
};

interface NotificationContextType {
  all: AppNotification[];
  for: (role: UserRole) => AppNotification[];
  unreadCount: (role: UserRole) => number;
  markRead: (id: string) => void;
  markAllRead: (role: UserRole) => void;
  push: (n: Omit<AppNotification, 'id' | 'at' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    return seed();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch (e) { /* ignore */ }
  }, [all]);

  const forRole = useCallback((role: UserRole) =>
    all.filter(n => n.audience === role || n.audience === 'all')
       .sort((a, b) => b.at.localeCompare(a.at)), [all]);

  const unreadCount = useCallback((role: UserRole) =>
    forRole(role).filter(n => !n.read).length, [forRole]);

  const markRead = useCallback((id: string) =>
    setAll(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);

  const markAllRead = useCallback((role: UserRole) =>
    setAll(prev => prev.map(n =>
      (n.audience === role || n.audience === 'all') ? { ...n, read: true } : n)), []);

  const push = useCallback((n: Omit<AppNotification, 'id' | 'at' | 'read'>) =>
    setAll(prev => [{ ...n, id: uid(), at: new Date().toISOString(), read: false }, ...prev]), []);

  return (
    <NotificationContext.Provider value={{ all, for: forRole, unreadCount, markRead, markAllRead, push }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
