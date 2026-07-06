import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type ManagedUserRole = 'admin' | 'host' | 'guest';
export type ManagedUserStatus = 'active' | 'pending' | 'inactive';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  status: ManagedUserStatus;
  joinDate: string; // YYYY-MM-DD
  bookings: number;
}

const STORAGE_KEY = 'nh-admin-users-v1';

const seed = (): ManagedUser[] => [
  { id: '1', name: 'Suraj Admin', email: 'admin@nepali.com', role: 'admin', status: 'active', joinDate: '2024-01-15', bookings: 0 },
  { id: '2', name: 'Ram Gurung', email: 'host@nepali.com', role: 'host', status: 'active', joinDate: '2024-03-20', bookings: 45 },
  { id: '3', name: 'Sarah Johnson', email: 'guest@nepali.com', role: 'guest', status: 'active', joinDate: '2025-06-10', bookings: 3 },
  { id: '4', name: 'Sita Tamang', email: 'sita@nepali.com', role: 'host', status: 'active', joinDate: '2024-08-05', bookings: 32 },
  { id: '5', name: 'Bhim Thapa', email: 'bhim@nepali.com', role: 'host', status: 'pending', joinDate: '2026-02-28', bookings: 0 },
  { id: '6', name: 'Emma Müller', email: 'emma@example.com', role: 'guest', status: 'active', joinDate: '2025-11-12', bookings: 5 },
  { id: '7', name: 'Takeshi Yamamoto', email: 'takeshi@example.com', role: 'guest', status: 'active', joinDate: '2025-09-08', bookings: 2 },
  { id: '8', name: 'Maya Sherpa', email: 'maya@nepali.com', role: 'host', status: 'inactive', joinDate: '2024-05-15', bookings: 18 },
];

const genId = () => `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

interface UserStoreContextType {
  users: ManagedUser[];
  addUser: (data: Partial<ManagedUser> & { name: string; email: string }) => ManagedUser;
  updateUser: (id: string, patch: Partial<ManagedUser>) => void;
  deleteUser: (id: string) => void;
  setStatus: (id: string, status: ManagedUserStatus) => void;
  reset: () => void;
}

const UserStoreContext = createContext<UserStoreContextType | null>(null);

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ManagedUser[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* ignore */ }
    return seed();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch { /* ignore */ }
  }, [users]);

  const addUser: UserStoreContextType['addUser'] = useCallback((data) => {
    const created: ManagedUser = {
      bookings: 0,
      status: 'pending',
      joinDate: new Date().toISOString().slice(0, 10),
      role: 'guest',
      ...data,
      id: data.id || genId(),
    } as ManagedUser;
    setUsers(prev => [created, ...prev]);
    return created;
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<ManagedUser>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const setStatus = useCallback((id: string, status: ManagedUserStatus) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
  }, []);

  const reset = useCallback(() => setUsers(seed()), []);

  return (
    <UserStoreContext.Provider value={{ users, addUser, updateUser, deleteUser, setStatus, reset }}>
      {children}
    </UserStoreContext.Provider>
  );
}

export function useUserStore() {
  const ctx = useContext(UserStoreContext);
  if (!ctx) throw new Error('useUserStore must be used within UserStoreProvider');
  return ctx;
}
