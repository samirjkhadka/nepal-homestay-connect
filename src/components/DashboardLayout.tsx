import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Home, Users, CalendarCheck, BarChart3, Settings, LogOut, Menu, X,
  BedDouble, MessageSquare, Star, CreditCard, User, Heart, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Homestays', href: '/admin/homestays', icon: Home },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  host: [
    { label: 'Dashboard', href: '/host', icon: LayoutDashboard },
    { label: 'My Listings', href: '/host/listings', icon: BedDouble },
    { label: 'Bookings', href: '/host/bookings', icon: CalendarCheck },
    { label: 'Reviews', href: '/host/reviews', icon: Star },
    { label: 'Messages', href: '/host/messages', icon: MessageSquare },
    { label: 'Earnings', href: '/host/earnings', icon: CreditCard },
  ],
  guest: [
    { label: 'Dashboard', href: '/guest', icon: LayoutDashboard },
    { label: 'My Bookings', href: '/guest/bookings', icon: CalendarCheck },
    { label: 'Wishlist', href: '/guest/wishlist', icon: Heart },
    { label: 'Reviews', href: '/guest/reviews', icon: Star },
    { label: 'Profile', href: '/guest/profile', icon: User },
  ],
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin Panel',
  host: 'Host Dashboard',
  guest: 'Guest Dashboard',
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const navItems = navByRole[user.role];

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-5 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">N</span>
              </div>
              <div>
                <span className="font-display text-sm font-semibold text-foreground block">{roleLabels[user.role]}</span>
                <span className="text-xs text-muted-foreground">Nepali Homestays</span>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border h-14 flex items-center px-4 lg:px-6">
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <MapPin className="w-4 h-4 mr-1" />
                View Site
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
