import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { UserCheck, FileText, Check, X, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { toast } from 'sonner';

type AppStatus = 'pending' | 'approved' | 'rejected' | 'more-info';

interface HostApplication {
  id: string;
  name: string;
  email: string;
  property: string;
  province: string;
  submittedAt: string;
  status: AppStatus;
  checklist: { id: boolean; photos: boolean; safety: boolean; tax: boolean };
  note?: string;
}

const SEED: HostApplication[] = [
  { id: 'app-204', name: 'Anjali Tamang', email: 'anjali@example.com', property: 'Tamang Heritage Home', province: 'Bagmati Province', submittedAt: '2026-05-10', status: 'pending', checklist: { id: true, photos: true, safety: false, tax: true } },
  { id: 'app-205', name: 'Bikash Rai', email: 'bikash@example.com', property: 'Eastern Hills Retreat', province: 'Koshi Province', submittedAt: '2026-05-09', status: 'pending', checklist: { id: true, photos: false, safety: false, tax: false } },
  { id: 'app-198', name: 'Sita Gurung', email: 'sita@example.com', property: 'Lakeside Family Stay', province: 'Gandaki Province', submittedAt: '2026-05-02', status: 'approved', checklist: { id: true, photos: true, safety: true, tax: true } },
  { id: 'app-191', name: 'Dorje Sherpa', email: 'dorje@example.com', property: 'Khumbu Base Lodge', province: 'Koshi Province', submittedAt: '2026-04-27', status: 'more-info', checklist: { id: true, photos: true, safety: false, tax: true }, note: 'Safety inspection certificate required.' },
];

const statusStyle: Record<AppStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
  'more-info': 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
};

const CHECKS: { key: keyof HostApplication['checklist']; label: string }[] = [
  { key: 'id', label: 'ID verification' },
  { key: 'photos', label: 'Property photos' },
  { key: 'safety', label: 'Safety inspection' },
  { key: 'tax', label: 'Tax registration' },
];

export default function AdminVerification() {
  const { log } = useAuditLog();
  const [apps, setApps] = useState<HostApplication[]>(SEED);
  const [active, setActive] = useState<HostApplication | null>(null);
  const [note, setNote] = useState('');

  const set = (id: string, patch: Partial<HostApplication>) =>
    setApps(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));

  const decide = (app: HostApplication, status: AppStatus, action: 'approve' | 'reject' | 'update') => {
    set(app.id, { status, note: note || app.note });
    log({ actor: 'admin', actorName: 'Suraj Admin', action, entity: 'Host Application', entityId: app.id, summary: `${action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Requested more info for'} ${app.name}'s application` });
    toast.success(`Application ${status}`);
    setActive(null); setNote('');
  };

  const pending = apps.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-primary" />Host Verification
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{pending} application{pending !== 1 ? 's' : ''} awaiting review</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {apps.map(app => {
          const done = Object.values(app.checklist).filter(Boolean).length;
          return (
            <Card key={app.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[app.status]}`}>{app.status.replace('-', ' ')}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="text-foreground font-medium">{app.property}</p>
                <p>{app.province} · submitted {app.submittedAt}</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CHECKS.map(c => (
                  <div key={c.key} className="flex items-center gap-1.5 text-xs">
                    {app.checklist[c.key]
                      ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      : <X className="w-3.5 h-3.5 text-muted-foreground" />}
                    <span className={app.checklist[c.key] ? 'text-foreground' : 'text-muted-foreground'}>{c.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <Badge variant="outline" className="text-xs"><FileText className="w-3 h-3 mr-1" />{done}/4 verified</Badge>
                <Button size="sm" variant="outline" onClick={() => { setActive(app); setNote(app.note ?? ''); }}>Review</Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!active} onOpenChange={o => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Review · {active?.name}</DialogTitle></DialogHeader>
          {active && (
            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <p className="font-medium text-foreground">{active.property}</p>
                <p className="text-muted-foreground">{active.province}</p>
              </div>
              <div className="space-y-2">
                {CHECKS.map(c => (
                  <label key={c.key} className="flex items-center justify-between text-sm cursor-pointer">
                    <span>{c.label}</span>
                    <input type="checkbox" checked={active.checklist[c.key]} onChange={e => {
                      const next = { ...active.checklist, [c.key]: e.target.checked };
                      set(active.id, { checklist: next }); setActive({ ...active, checklist: next });
                    }} className="rounded border-border" />
                  </label>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Note to applicant</label>
                <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional message…" rows={3} />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => active && decide(active, 'more-info', 'update')}>
              <MessageSquareWarning className="w-4 h-4 mr-1" />Request info
            </Button>
            <Button variant="destructive" onClick={() => active && decide(active, 'rejected', 'reject')}>
              <X className="w-4 h-4 mr-1" />Reject
            </Button>
            <Button onClick={() => active && decide(active, 'approved', 'approve')}>
              <Check className="w-4 h-4 mr-1" />Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
