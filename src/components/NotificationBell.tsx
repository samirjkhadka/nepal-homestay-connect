import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CalendarCheck, MessageSquare, CreditCard, Star, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications, NotificationType } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const icons: Record<NotificationType, typeof Bell> = {
  booking: CalendarCheck,
  message: MessageSquare,
  payout: CreditCard,
  review: Star,
  system: Settings,
  alert: AlertTriangle,
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const { for: forRole, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  if (!user) return null;
  const items = forRole(user.role);
  const count = unreadCount(user.role);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5 text-foreground" />
          {count > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-semibold text-foreground text-sm">Notifications</p>
          {count > 0 && (
            <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => markAllRead(user.role)}>
              <Check className="w-3 h-3" />Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>}
          {items.map(n => {
            const Icon = icons[n.type];
            const inner = (
              <div className={`flex gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    {n.title}
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.at)}</p>
                </div>
              </div>
            );
            return n.href ? (
              <Link key={n.id} to={n.href} onClick={() => { markRead(n.id); setOpen(false); }}>{inner}</Link>
            ) : (
              <button key={n.id} className="w-full text-left" onClick={() => markRead(n.id)}>{inner}</button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
