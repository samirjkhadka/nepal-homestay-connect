import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

type Booking = {
  id: string; guest: string; email: string; phone: string; host: string; homestay: string;
  checkIn: string; checkOut: string; guests: number; status: string; amount: number;
};

const allBookings: Booking[] = [
  { id: 'B001', guest: 'Sarah Johnson',    email: 'sarah@example.com',   phone: '+1-415-555-0142', host: 'Deepak Gurung',   homestay: 'Mountain View Retreat',   checkIn: '2026-03-10', checkOut: '2026-03-13', guests: 2, status: 'confirmed', amount: 13500 },
  { id: 'B002', guest: 'Takeshi Yamamoto', email: 'takeshi@example.com', phone: '+81-90-1234-5678', host: 'Rita Shrestha',  homestay: 'Lakeside Heritage Home',   checkIn: '2026-03-12', checkOut: '2026-03-15', guests: 3, status: 'pending',   amount: 9600 },
  { id: 'B003', guest: 'Emma Müller',      email: 'emma@example.com',    phone: '+49-30-12345678', host: 'Bishnu Tharu',    homestay: 'Tharu Cultural Homestay',  checkIn: '2026-03-08', checkOut: '2026-03-11', guests: 2, status: 'confirmed', amount: 8400 },
  { id: 'B004', guest: 'Raj Patel',        email: 'raj@example.com',     phone: '+91-98-7654-3210', host: 'Aman Maharjan',  homestay: 'Ancient Newari House',     checkIn: '2026-03-15', checkOut: '2026-03-18', guests: 4, status: 'pending',   amount: 10500 },
  { id: 'B005', guest: 'Claire Dupont',    email: 'claire@example.com',  phone: '+33-1-2345-6789', host: 'Tashi Sherpa',    homestay: 'Himalayan Tea Garden',     checkIn: '2026-03-20', checkOut: '2026-03-24', guests: 2, status: 'confirmed', amount: 20000 },
  { id: 'B006', guest: 'John Smith',       email: 'john@example.com',    phone: '+44-20-7946-0958', host: 'Tashi Sherpa',   homestay: 'Sherpa Mountain Lodge',    checkIn: '2026-03-09', checkOut: '2026-03-12', guests: 1, status: 'cancelled', amount: 10500 },
  { id: 'B007', guest: 'Mei Lin',          email: 'mei@example.com',     phone: '+86-10-5555-1212', host: 'Rita Shrestha',  homestay: 'Lakeside Heritage Home',   checkIn: '2026-04-02', checkOut: '2026-04-05', guests: 2, status: 'confirmed', amount: 11200 },
  { id: 'B008', guest: 'Lucas Costa',      email: 'lucas@example.com',   phone: '+55-11-91234-5678', host: 'Deepak Gurung', homestay: 'Mountain View Retreat',   checkIn: '2026-04-10', checkOut: '2026-04-12', guests: 3, status: 'pending',   amount: 7800 },
  { id: 'B009', guest: 'Anya Petrov',      email: 'anya@example.com',    phone: '+7-495-555-0144', host: 'Bishnu Tharu',    homestay: 'Tharu Cultural Homestay',  checkIn: '2026-04-14', checkOut: '2026-04-17', guests: 2, status: 'confirmed', amount: 8400 },
  { id: 'B010', guest: 'Noah Williams',    email: 'noah@example.com',    phone: '+1-212-555-0173', host: 'Aman Maharjan',   homestay: 'Ancient Newari House',     checkIn: '2026-04-20', checkOut: '2026-04-23', guests: 4, status: 'cancelled', amount: 10500 },
  { id: 'B011', guest: 'Hana Park',        email: 'hana@example.com',    phone: '+82-2-555-1234',  host: 'Tashi Sherpa',    homestay: 'Himalayan Tea Garden',     checkIn: '2026-04-25', checkOut: '2026-04-28', guests: 2, status: 'confirmed', amount: 14000 },
  { id: 'B012', guest: 'Olivier Martin',   email: 'olivier@example.com', phone: '+33-6-1234-5678', host: 'Deepak Gurung',   homestay: 'Mountain View Retreat',   checkIn: '2026-05-01', checkOut: '2026-05-04', guests: 3, status: 'pending',   amount: 11500 },
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

type SortKey = 'id' | 'guest' | 'host' | 'homestay' | 'checkIn' | 'checkOut' | 'status' | 'amount';
const PAGE_SIZES = [10, 25, 50];

export default function AdminBookings() {
  const [status, setStatus] = useState<string>('all');
  const [host, setHost] = useState<string>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('checkIn');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const hosts = useMemo(() => Array.from(new Set(allBookings.map(b => b.host))), []);

  const filtered = useMemo(() => allBookings.filter(b => {
    if (status !== 'all' && b.status !== status) return false;
    if (host !== 'all' && b.host !== host) return false;
    if (from && b.checkIn < from) return false;
    if (to && b.checkOut > to) return false;
    if (q && !`${b.id} ${b.guest} ${b.email} ${b.homestay}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [status, host, from, to, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] as any; const bv = b[sortKey] as any;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
    setPage(1);
  };

  const sortIcon = (k: SortKey) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 inline ml-1" />
      : <ArrowDown className="w-3 h-3 inline ml-1" />;
  };

  const exportCSV = () => {
    const headers = [
      'Booking ID', 'Guest Name', 'Guest Email', 'Guest Phone', 'Number of Guests',
      'Host', 'Homestay', 'Check-in Date', 'Check-out Date', 'Booking Status', 'Amount NPR',
    ];
    const rows = sorted.map(b => [
      b.id, b.guest, b.email, b.phone, b.guests,
      b.host, b.homestay, b.checkIn, b.checkOut, b.status, b.amount,
    ]);
    const csv = [headers, ...rows].map(r => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: `${sorted.length} bookings downloaded` });
  };

  const reset = () => { setStatus('all'); setHost('all'); setFrom(''); setTo(''); setQ(''); setPage(1); };

  const SortableTH = ({ k, children, className = '' }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <th className={`p-4 font-medium ${className}`}>
      <button onClick={() => toggleSort(k)} className="hover:text-foreground transition-colors">
        {children}{sortIcon(k)}
      </button>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">{sorted.length} of {allBookings.length} bookings</p>
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
            <Input placeholder="Guest, email, ID, homestay" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
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
            <Select value={host} onValueChange={(v) => { setHost(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hosts</SelectItem>
                {hosts.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">From</Label>
            <Input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} />
          </div>
          <div>
            <Label className="text-xs">To</Label>
            <Input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} />
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
                <SortableTH k="id">Booking ID</SortableTH>
                <SortableTH k="guest">Guest</SortableTH>
                <SortableTH k="host" className="hidden lg:table-cell">Host</SortableTH>
                <SortableTH k="homestay" className="hidden lg:table-cell">Homestay</SortableTH>
                <SortableTH k="checkIn" className="hidden md:table-cell">Check-in</SortableTH>
                <SortableTH k="checkOut" className="hidden md:table-cell">Check-out</SortableTH>
                <SortableTH k="status">Status</SortableTH>
                <th className="p-4 font-medium text-right">
                  <button onClick={() => toggleSort('amount')} className="hover:text-foreground transition-colors">
                    Amount{sortIcon('amount')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No bookings match these filters.</td></tr>
              )}
              {pageRows.map((b, i) => (
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

        {/* Pagination footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(+v); setPage(1); }}>
              <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
              <SelectContent>{PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              Page {safePage} of {totalPages} · Showing {pageRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{(safePage - 1) * pageSize + pageRows.length}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={safePage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" disabled={safePage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
