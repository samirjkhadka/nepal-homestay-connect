import { createContext, useContext, useState, ReactNode } from 'react';
import { AdminRole, AdminPermission, roleHasPermission } from '@/lib/permissions';

export type UserRole = 'admin' | 'host' | 'guest';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  /** Sub-role for admin RBAC. Only relevant when role === 'admin'. */
  adminRole?: AdminRole;
}

const mockUsers: Record<string, MockUser> = {
  'admin@nepali.com': { id: '1', name: 'Suraj Admin', email: 'admin@nepali.com', role: 'admin', avatar: 'S', adminRole: 'super' },
  'host@nepali.com': { id: '2', name: 'Ram Host', email: 'host@nepali.com', role: 'host', avatar: 'R' },
  'guest@nepali.com': { id: '3', name: 'Sarah Guest', email: 'guest@nepali.com', role: 'guest', avatar: 'S' },
};

interface AuthContextType {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  /** Returns true when the current admin user holds the given permission. */
  can: (permission: AdminPermission) => boolean;
  adminRole: AdminRole | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() => {
    const stored = localStorage.getItem('nh-auth-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    const found = mockUsers[email.toLowerCase()];
    if (found) {
      setUser(found);
      localStorage.setItem('nh-auth-user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nh-auth-user');
  };

  const adminRole = user?.role === 'admin' ? (user.adminRole ?? 'super') : undefined;
  const can = (permission: AdminPermission) => roleHasPermission(adminRole, permission);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, can, adminRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
