import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  BedDouble, CalendarCheck, Star, DollarSign, ArrowUpRight, MessageSquare, Plus, TrendingUp,
} from 'lucide-react';
import { useHostData } from '@/contexts/HostDataContext';
import { useAuth } from '@/contexts/AuthContext';

export default function HostDashboard() {
  const { data } = useHostData();
  const { user } = useAuth();

  const upcoming = data.bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const totalRevenue = data.earnings.monthly.reduce((s, m) => s + m.amount, 0);
  const avgRating = data.reviews.length
    ? (data.reviews.reduce((s, r) => s + r.rating, 0) / data.reviews.length).toFixed(1)
    : '—';

  const stats = [
    { label: 'Active Listings', value: String(data.properties.filter(p => p.published).length), icon: BedDouble, change: '+1' },
    { label: 'Upcoming Bookings', value: String(upcoming.length), icon: CalendarCheck, change: '+5' },
    { label: 'Avg Rating', value: String(avgRating), icon: Star, change: '+0.1' },
    { label: 'Earnings (NPR)', value: `${Math.round(totalRevenue / 1000)}K`, icon: DollarSign, change: '+18%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's how your homestay is performing.</p>
        </div>
        <Link to="/host/listings"><Button><Plus className="w-4 h-4 mr-2" />New Listing</Button></Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />{s.change}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-primary" />Upcoming Check-ins
            </h2>
            <Link to="/host/bookings"><Button variant="ghost" size="sm">View all</Button></Link>
          </div>
          <div className="space-y-3">
            {upcoming.slice(0, 4).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">{b.guest}</p>
                  <p className="text-xs text-muted-foreground">{b.checkIn} → {b.checkOut} · {b.guests} guests</p>
                </div>
                <span className="text-sm font-semibold text-foreground">NPR {b.amount.toLocaleString()}</span>
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming bookings.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />Recent Reviews
            </h2>
            <Link to="/host/reviews"><Button variant="ghost" size="sm">View all</Button></Link>
          </div>
          <div className="space-y-3">
            {data.reviews.slice(0, 3).map(r => (
              <div key={r.id} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground text-sm">{r.author}</p>
                  <span className="text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" />{r.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />Earnings (last 5 months)
        </h2>
        <div className="flex items-end gap-3 h-32">
          {data.earnings.monthly.map(m => {
            const max = Math.max(...data.earnings.monthly.map(x => x.amount));
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/20 rounded-t" style={{ height: `${(m.amount / max) * 100}%` }} />
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
