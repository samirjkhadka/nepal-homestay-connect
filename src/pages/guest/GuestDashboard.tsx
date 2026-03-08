import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarCheck, Heart, Star, MapPin, Eye, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllHomestays } from '@/data/homestays';

const myBookings = [
  { homestay: 'Mountain View Retreat', location: 'Pokhara', checkIn: '2026-03-10', checkOut: '2026-03-13', status: 'upcoming', amount: 13500 },
  { homestay: 'Lakeside Heritage Home', location: 'Pokhara', checkIn: '2025-12-20', checkOut: '2025-12-23', status: 'completed', amount: 9600 },
];

const wishlist = getAllHomestays().slice(0, 3);

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function GuestDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, Sarah!</h1>
        <p className="text-muted-foreground text-sm mt-1">Plan your next Nepali adventure</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Bookings', value: '2', icon: CalendarCheck },
          { label: 'Wishlist', value: '3', icon: Heart },
          { label: 'Reviews Written', value: '1', icon: Star },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bookings */}
      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-primary" />
          My Bookings
        </h2>
        <div className="space-y-3">
          {myBookings.map((b, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">{b.homestay}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{b.location} · {b.checkIn} → {b.checkOut}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[b.status]}`}>
                  {b.status}
                </span>
                <p className="text-sm font-medium text-foreground mt-1">NPR {b.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Wishlist */}
      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          My Wishlist
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wishlist.map(h => (
            <Link key={h.id} to={`/homestay/${h.id}`} className="group">
              <div className="rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
                <div className="h-32 overflow-hidden">
                  <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-foreground text-sm truncate">{h.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />{h.rating} · {h.location}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <Link to="/homestays">
          <Button>
            <Eye className="w-4 h-4 mr-2" />
            Explore More Homestays
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
