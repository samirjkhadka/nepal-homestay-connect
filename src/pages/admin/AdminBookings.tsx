import { motion } from 'framer-motion';
import { CalendarCheck, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const bookings = [
  { id: 'B001', guest: 'Sarah Johnson', email: 'sarah@example.com', homestay: 'Mountain View Retreat', checkIn: '2026-03-10', checkOut: '2026-03-13', guests: 2, status: 'confirmed', amount: 13500 },
  { id: 'B002', guest: 'Takeshi Yamamoto', email: 'takeshi@example.com', homestay: 'Lakeside Heritage Home', checkIn: '2026-03-12', checkOut: '2026-03-15', guests: 3, status: 'pending', amount: 9600 },
  { id: 'B003', guest: 'Emma Müller', email: 'emma@example.com', homestay: 'Tharu Cultural Homestay', checkIn: '2026-03-08', checkOut: '2026-03-11', guests: 2, status: 'confirmed', amount: 8400 },
  { id: 'B004', guest: 'Raj Patel', email: 'raj@example.com', homestay: 'Ancient Newari House', checkIn: '2026-03-15', checkOut: '2026-03-18', guests: 4, status: 'pending', amount: 10500 },
  { id: 'B005', guest: 'Claire Dupont', email: 'claire@example.com', homestay: 'Himalayan Tea Garden', checkIn: '2026-03-20', checkOut: '2026-03-24', guests: 2, status: 'confirmed', amount: 20000 },
  { id: 'B006', guest: 'John Smith', email: 'john@example.com', homestay: 'Sherpa Mountain Lodge', checkIn: '2026-03-09', checkOut: '2026-03-12', guests: 1, status: 'cancelled', amount: 10500 },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminBookings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-medium">Booking ID</th>
                <th className="p-4 font-medium">Guest</th>
                <th className="p-4 font-medium hidden lg:table-cell">Homestay</th>
                <th className="p-4 font-medium hidden md:table-cell">Check-in</th>
                <th className="p-4 font-medium hidden md:table-cell">Check-out</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-mono text-xs">{b.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{b.guest}</p>
                    <p className="text-xs text-muted-foreground">{b.email}</p>
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{b.homestay}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{b.checkIn}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{b.checkOut}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium">NPR {b.amount.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
