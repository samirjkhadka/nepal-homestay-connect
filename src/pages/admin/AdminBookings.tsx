import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const allBookings = [
  { id: 'B001', guest: 'Sarah Johnson', email: 'sarah@example.com', host: 'Deepak Gurung',     homestay: 'Mountain View Retreat',  checkIn: '2026-03-10', checkOut: '2026-03-13', guests: 2, status: 'confirmed', amount: 13500 },
  { id: 'B002', guest: 'Takeshi Yamamoto', email: 'takeshi@example.com', host: 'Rita Shrestha', homestay: 'Lakeside Heritage Home', checkIn: '2026-03-12', checkOut: '2026-03-15', guests: 3, status: 'pending',   amount: 9600 },
  { id: 'B003', guest: 'Emma Müller',    email: 'emma@example.com',    host: 'Bishnu Tharu',   homestay: 'Tharu Cultural Homestay', checkIn: '2026-03-08', checkOut: '2026-03-11', guests: 2, status: 'confirmed', amount: 8400 },
  { id: 'B004', guest: 'Raj Patel',      email: 'raj@example.com',     host: 'Aman Maharjan',  homestay: 'Ancient Newari House',    checkIn: '2026-03-15', checkOut: '2026-03-18', guests: 4, status: 'pending',   amount: 10500 },
  { id: 'B005', guest: 'Claire Dupont',  email: 'claire@example.com',  host: 'Tashi Sherpa',   homestay: 'Himalayan Tea Garden',    checkIn: '2026-03-20', checkOut: '2026-03-24', guests: 2, status: 'confirmed', amount: 20000 },
  { id: 'B006', guest: 'John Smith',     email: 'john@example.com',    host: 'Tashi Sherpa',   homestay: 'Sherpa Mountain Lodge',   checkIn: '2026-03-09', checkOut: '2026-03-12', guests: 1, status: 'cancelled', amount: 10500 },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const csvEscape = (v: any) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function AdminBookings() {
  const [status, setStatus] = useState<string>('all');
  const [host, setHost] = useState<string>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');

  const hosts = useMemo(() => Array.from(new Set(allBookings.map(b => b.host))), []);

  const filtered = useMemo(() => allBookings.filter(b => {
    if (status !== 'all' && b.status !== status) return false;
    if (host !== 'all' && b.host !== host) return false;
    if (from && b.checkIn < from) return false;
    if (to && b.checkOut > to) return false;
    if (q && !`${b.id} ${b.guest} ${b.email} ${b.homestay}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [status, host, from, to, q]);

  const exportCSV = () => {
    const headers = ['ID','Guest','Email','Host','Homestay','Check-in','Check-out','Guests','Status','Amount NPR'];
    const rows = filtered.map(b => [b.id, b.guest, b.email, b.host, b.homestay, b.checkIn, b.checkOut, b.guests, b.status, b.amount]);
    const csv = [headers, ...rows].map(r => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: `${filtered.length} bookings downloaded` });
  };

  const reset = () => { setStatus('all'); setHost('all'); setFrom(''); setTo(''); setQ(''); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} of {allBookings.length} bookings</p>
        </div>
        <Button onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <Label className="text-xs">Search</Label>
            <Input placeholder="Guest, email, ID, homestay" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Host</Label>
            <Select value={host} onValueChange={setHost}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hosts</SelectItem>
                {hosts.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">From</Label>
            <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">To</Label>
            <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Button variant="ghost" size="sm" onClick={reset}>Reset filters</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-medium">Booking ID</th>
                <th className="p-4 font-medium">Guest</th>
                <th className="p-4 font-medium hidden lg:table-cell">Host</th>
                <th className="p-4 font-medium hidden lg:table-cell">Homestay</th>
                <th className="p-4 font-medium hidden md:table-cell">Check-in</th>
                <th className="p-4 font-medium hidden md:table-cell">Check-out</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No bookings match these filters.</td></tr>
              )}
              {filtered.map((b, i) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 6) * 0.04 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-mono text-xs">{b.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{b.guest}</p>
                    <p className="text-xs text-muted-foreground">{b.email}</p>
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{b.host}</td>
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
