import { motion } from 'framer-motion';
import {
  Home, Users, CalendarCheck, TrendingUp, DollarSign, Star, ArrowUpRight, ArrowDownRight,
  Eye, BedDouble, MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getAllHomestays } from '@/data/homestays';

const stats = [
  { label: 'Total Homestays', value: '523', change: '+12', up: true, icon: Home },
  { label: 'Active Bookings', value: '1,247', change: '+8.2%', up: true, icon: CalendarCheck },
  { label: 'Total Users', value: '52,340', change: '+15.3%', up: true, icon: Users },
  { label: 'Revenue (NPR)', value: '12.4M', change: '+22%', up: true, icon: DollarSign },
];

const recentBookings = [
  { id: 'B001', guest: 'Sarah J.', homestay: 'Mountain View Retreat', date: '2026-03-07', status: 'confirmed', amount: 4500 },
  { id: 'B002', guest: 'Takeshi Y.', homestay: 'Lakeside Heritage Home', date: '2026-03-06', status: 'pending', amount: 3200 },
  { id: 'B003', guest: 'Emma M.', homestay: 'Tharu Cultural Homestay', date: '2026-03-05', status: 'confirmed', amount: 2800 },
  { id: 'B004', guest: 'Raj P.', homestay: 'Ancient Newari House', date: '2026-03-04', status: 'cancelled', amount: 3500 },
  { id: 'B005', guest: 'Claire D.', homestay: 'Himalayan Tea Garden', date: '2026-03-03', status: 'confirmed', amount: 5000 },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const topHomestays = getAllHomestays().sort((a, b) => b.rating - a.rating).slice(0, 5);

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Bookings</h2>
            <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Homestay</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-mono text-xs text-muted-foreground">{b.id}</td>
                    <td className="py-3 font-medium text-foreground">{b.guest}</td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">{b.homestay}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">NPR {b.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Homestays */}
        <Card className="p-5">
          <h2 className="font-semibold text-foreground mb-4">Top Rated Homestays</h2>
          <div className="space-y-4">
            {topHomestays.map((h, i) => (
              <div key={h.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{h.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{h.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="font-medium">{h.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
