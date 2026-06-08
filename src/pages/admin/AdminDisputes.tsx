import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Gavel, AlertTriangle, Clock, CheckCircle2, Paperclip } from 'lucide-react';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { toast } from 'sonner';

type Priority = 'low' | 'medium' | 'high';
type DisputeStatus = 'open' | 'investigating' | 'resolved';

interface Dispute {
  id: string;
  bookingId: string;
  opener: string;
  against: string;
  reason: string;
  priority: Priority;
  status: DisputeStatus;
  amount: number;
  openedAt: string;
  evidence: string[];
  resolution?: string;
}

const SEED: Dispute[] = [
  { id: 'd-501', bookingId: 'b-8790', opener: 'Sarah Johnson (guest)', against: 'Ram Host', reason: 'Property did not match photos — no hot water.', priority: 'high', status: 'open', amount: 5500, openedAt: '2026-05-10', evidence: ['photo-bathroom.jpg', 'chat-log.pdf'] },
  { id: 'd-498', bookingId: 'b-8712', opener: 'Ram Host', against: 'Emma Müller (guest)', reason: 'Guest damaged kitchenware, requesting deposit deduction.', priority: 'medium', status: 'investigating', amount: 2000, openedAt: '2026-05-07', evidence: ['damage-1.jpg'] },
  { id: 'd-485', bookingId: 'b-8650', opener: 'Raj Patel (guest)', against: 'Sita Gurung', reason: 'Late check-in, host unreachable for 2 hours.', priority: 'low', status: 'resolved', amount: 0, openedAt: '2026-04-28', evidence: [], resolution: 'Issued NPR 500 goodwill credit to guest.' },
];

const priorityStyle: Record<Priority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  high: 'bg-red-500/15 text-red-600 dark:text-red-400',
};
const statusStyle: Record<DisputeStatus, string> = {
  open: 'bg-red-500/15 text-red-600 dark:text-red-400',
  investigating: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  resolved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};
const statusIcon: Record<DisputeStatus, typeof Clock> = {
  open: AlertTriangle, investigating: Clock, resolved: CheckCircle2,
};

export default function AdminDisputes() {
  const { log } = useAuditLog();
  const [disputes, setDisputes] = useState<Dispute[]>(SEED);
  const [active, setActive] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState('');
  const [refund, setRefund] = useState('');
  const [tab, setTab] = useState<'all' | DisputeStatus>('all');

  const filtered = useMemo(() =>
    disputes.filter(d => tab === 'all' || d.status === tab), [disputes, tab]);

  const setStatus = (d: Dispute, status: DisputeStatus) => {
    setDisputes(prev => prev.map(x => x.id === d.id ? { ...x, status } : x));
    setActive(a => a && a.id === d.id ? { ...a, status } : a);
    log({ actor: 'admin', actorName: 'Suraj Admin', action: 'update', entity: 'Dispute', entityId: d.id, summary: `Marked dispute ${d.id} as ${status}` });
  };

  const resolve = (d: Dispute) => {
    const amt = Number(refund) || 0;
    setDisputes(prev => prev.map(x => x.id === d.id ? { ...x, status: 'resolved', resolution: resolution || 'Resolved by admin.' } : x));
    if (amt > 0) log({ actor: 'admin', actorName: 'Suraj Admin', action: 'refund', entity: 'Dispute', entityId: d.id, summary: `Issued NPR ${amt.toLocaleString()} refund resolving dispute ${d.id}` });
    log({ actor: 'admin', actorName: 'Suraj Admin', action: 'update', entity: 'Dispute', entityId: d.id, summary: `Resolved dispute ${d.id}` });
    toast.success('Dispute resolved');
    setActive(null); setResolution(''); setRefund('');
  };

  const openCount = disputes.filter(d => d.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Gavel className="w-6 h-6 text-primary" />Dispute Resolution
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{openCount} active dispute{openCount !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'open', 'investigating', 'resolved'] as const).map(t => (
          <Button key={t} variant={tab === t ? 'default' : 'outline'} size="sm" className="capitalize" onClick={() => setTab(t)}>{t}</Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(d => {
          const Icon = statusIcon[d.status];
          return (
            <Card key={d.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setActive(d); setResolution(d.resolution ?? ''); setRefund(''); }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyle[d.priority]}`}>{d.priority}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${statusStyle[d.status]}`}>
                      <Icon className="w-3 h-3" />{d.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mt-2">{d.opener} <span className="text-muted-foreground font-normal">vs</span> {d.against}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">{d.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">Booking {d.bookingId} · opened {d.openedAt}{d.evidence.length > 0 && ` · ${d.evidence.length} attachment(s)`}</p>
                </div>
                {d.amount > 0 && <span className="text-sm font-semibold text-foreground whitespace-nowrap">NPR {d.amount.toLocaleString()}</span>}
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No disputes in this view.</p>}
      </div>

      <Sheet open={!!active} onOpenChange={o => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>Dispute {active?.id}</SheetTitle></SheetHeader>
          {active && (
            <div className="space-y-5 mt-4 text-sm">
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyle[active.priority]}`}>{active.priority} priority</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[active.status]}`}>{active.status}</span>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Parties</p>
                <p className="text-foreground">{active.opener} vs {active.against}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Reason</p>
                <p className="text-foreground">{active.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Booking</p><p className="font-mono">{active.bookingId}</p></div>
                <div><p className="text-muted-foreground text-xs">Disputed amount</p><p>NPR {active.amount.toLocaleString()}</p></div>
              </div>
              {active.evidence.length > 0 && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Evidence</p>
                  {active.evidence.map(f => (
                    <div key={f} className="flex items-center gap-2 text-foreground"><Paperclip className="w-3.5 h-3.5 text-muted-foreground" />{f}</div>
                  ))}
                </div>
              )}

              {active.status !== 'resolved' ? (
                <div className="space-y-3 pt-2 border-t border-border">
                  <Select value={active.status} onValueChange={v => setStatus(active, v as DisputeStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Refund amount (NPR)</label>
                    <Input type="number" value={refund} onChange={e => setRefund(e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Resolution note</label>
                    <Textarea value={resolution} onChange={e => setResolution(e.target.value)} rows={3} placeholder="Describe the outcome…" />
                  </div>
                  <Button className="w-full" onClick={() => resolve(active)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />Resolve dispute
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-border">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-500/40 mb-2">Resolved</Badge>
                  <p className="text-foreground">{active.resolution}</p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
