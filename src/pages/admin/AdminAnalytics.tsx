import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Eye, CalendarCheck, DollarSign, ArrowUpRight } from 'lucide-react';

const monthlyData = [
  { month: 'Oct', bookings: 320, revenue: 2.1 },
  { month: 'Nov', bookings: 410, revenue: 2.8 },
  { month: 'Dec', bookings: 580, revenue: 3.9 },
  { month: 'Jan', bookings: 490, revenue: 3.3 },
  { month: 'Feb', bookings: 620, revenue: 4.2 },
  { month: 'Mar', bookings: 750, revenue: 5.1 },
];

const maxBookings = Math.max(...monthlyData.map(d => d.bookings));

const topProvinces = [
  { name: 'Gandaki', bookings: 890, share: 35 },
  { name: 'Bagmati', bookings: 720, share: 28 },
  { name: 'Lumbini', bookings: 410, share: 16 },
  { name: 'Koshi', bookings: 320, share: 13 },
  { name: 'Others', bookings: 200, share: 8 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform performance insights</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Page Views', value: '284K', icon: Eye, change: '+18%' },
          { label: 'New Users', value: '3,420', icon: Users, change: '+12%' },
          { label: 'Bookings', value: '750', icon: CalendarCheck, change: '+22%' },
          { label: 'Revenue', value: 'NPR 5.1M', icon: DollarSign, change: '+15%' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <k.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                  <ArrowUpRight className="w-3 h-3" />{k.change}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <Card className="p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Monthly Bookings
          </h2>
          <div className="flex items-end gap-3 h-48">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.bookings / maxBookings) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full bg-primary/80 rounded-t-md min-h-[4px]"
                />
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Province breakdown */}
        <Card className="p-5">
          <h2 className="font-semibold text-foreground mb-4">Bookings by Province</h2>
          <div className="space-y-4">
            {topProvinces.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="text-muted-foreground">{p.bookings} ({p.share}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.share}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
