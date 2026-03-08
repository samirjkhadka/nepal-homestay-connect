import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  BedDouble, CalendarCheck, Star, DollarSign, TrendingUp, ArrowUpRight, Eye, MessageSquare
} from 'lucide-react';
import { getAllHomestays } from '@/data/homestays';

const stats = [
  { label: 'Active Listings', value: '3', icon: BedDouble, change: '+1' },
  { label: 'Total Bookings', value: '45', icon: CalendarCheck, change: '+5' },
  { label: 'Avg Rating', value: '4.9', icon: Star, change: '+0.1' },
  { label: 'Earnings (NPR)', value: '285K', icon: DollarSign, change: '+18%' },
];

const upcomingBookings = [
  { guest: 'Sarah Johnson', checkIn: '2026-03-10', checkOut: '2026-03-13', guests: 2, status: 'confirmed' },
  { guest: 'Emma Müller', checkIn: '2026-03-15', checkOut: '2026-03-18', guests: 1, status: 'pending' },
  { guest: 'Raj Patel', checkIn: '2026-03-20', checkOut: '2026-03-23', guests: 4, status: 'confirmed' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function HostDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Host Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Ram!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-primary" />
          Upcoming Bookings
        </h2>
        <div className="space-y-3">
          {upcomingBookings.map((b, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">{b.guest}</p>
                <p className="text-xs text-muted-foreground">{b.checkIn} → {b.checkOut} · {b.guests} guests</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[b.status]}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
