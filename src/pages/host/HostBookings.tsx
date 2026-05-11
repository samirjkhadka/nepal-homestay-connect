import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useHostData } from '@/contexts/HostDataContext';
import { Check, X, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function HostBookings() {
  const { data, update } = useHostData();

  const setStatus = (id: string, status: any) => {
    update('bookings', data.bookings.map(b => b.id === id ? { ...b, status } : b));
    toast({ title: `Booking ${status}` });
  };

  const groups = {
    pending: data.bookings.filter(b => b.status === 'pending'),
    confirmed: data.bookings.filter(b => b.status === 'confirmed'),
    completed: data.bookings.filter(b => b.status === 'completed'),
    cancelled: data.bookings.filter(b => b.status === 'cancelled'),
  };

  const renderList = (list: typeof data.bookings) => (
    <div className="space-y-3">
      {list.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No bookings here.</p>}
      {list.map(b => (
        <Card key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{b.guest}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[b.status]}`}>{b.status}</span>
            </div>
            <p className="text-xs text-muted-foreground">{b.guestEmail}</p>
            <p className="text-sm text-muted-foreground mt-1">{b.checkIn} → {b.checkOut} · {b.guests} guests</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">NPR {b.amount.toLocaleString()}</p>
            <div className="flex gap-1 justify-end mt-2">
              {b.status === 'pending' && (
                <>
                  <Button size="sm" variant="outline" onClick={() => setStatus(b.id, 'confirmed')}><Check className="w-3 h-3 mr-1" />Approve</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setStatus(b.id, 'cancelled')}><X className="w-3 h-3" /></Button>
                </>
              )}
              <Button size="sm" variant="ghost"><MessageSquare className="w-3 h-3 mr-1" />Message</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reservations</h1>
        <p className="text-muted-foreground text-sm mt-1">Approve, decline and track all your bookings.</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({groups.pending.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Upcoming ({groups.confirmed.length})</TabsTrigger>
          <TabsTrigger value="completed">Past ({groups.completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({groups.cancelled.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">{renderList(groups.pending)}</TabsContent>
        <TabsContent value="confirmed" className="mt-4">{renderList(groups.confirmed)}</TabsContent>
        <TabsContent value="completed" className="mt-4">{renderList(groups.completed)}</TabsContent>
        <TabsContent value="cancelled" className="mt-4">{renderList(groups.cancelled)}</TabsContent>
      </Tabs>
    </div>
  );
}
