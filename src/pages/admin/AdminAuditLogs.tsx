import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { ScrollText, Download, Search, ShieldAlert, Eye, List, Clock, ExternalLink } from 'lucide-react';
import { useAuditLog, AuditEntry, AuditActor } from '@/contexts/AuditLogContext';
import { toast } from 'sonner';

const actorColors: Record<AuditActor, string> = {
  admin: 'bg-primary/15 text-primary',
  host: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  guest: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  system: 'bg-muted text-muted-foreground',
};

const CRITICAL = new Set(['payout', 'refund', 'delete', 'reject', 'approve']);

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminAuditLogs() {
  const { entries, clear } = useAuditLog();
  const [q, setQ] = useState('');
  const [actor, setActor] = useState('all');
  const [action, setAction] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detail, setDetail] = useState<AuditEntry | null>(null);
  const [view, setView] = useState<'table' | 'timeline'>('table');

  const actions = useMemo(() => Array.from(new Set(entries.map(e => e.action))).sort(), [entries]);

  const filtered = useMemo(() => entries.filter(e => {
    if (actor !== 'all' && e.actor !== actor) return false;
    if (action !== 'all' && e.action !== action) return false;
    if (from && e.at < from) return false;
    if (to && e.at > to + 'T23:59:59') return false;
    if (q) {
      const hay = `${e.actorName} ${e.entity} ${e.entityId ?? ''} ${e.summary}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [entries, actor, action, from, to, q]);

  const exportCsv = () => {
    const headers = ['Timestamp', 'Actor', 'Name', 'Action', 'Entity', 'Entity ID', 'Summary', 'IP'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map(e => [e.at, e.actor, e.actorName, e.action, e.entity, e.entityId, e.summary, e.ip].map(esc).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = `audit-log-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} entries`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-primary" />Audit Logs
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Immutable activity trail across the platform</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-sm flex items-center gap-1 ${view === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><List className="w-4 h-4" />Table</button>
            <button onClick={() => setView('timeline')} className={`px-3 py-1.5 text-sm flex items-center gap-1 ${view === 'timeline' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Clock className="w-4 h-4" />Timeline</button>
          </div>
          <Button variant="outline" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
        </div>
      </div>

      {view === 'timeline' && (
        <Card className="p-6">
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No matching log entries.</p>}
          <ol className="relative border-l border-border ml-2">
            {filtered.map(e => (
              <li key={e.id} className="ml-6 pb-6 last:pb-0">
                <span className={`absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-background ${CRITICAL.has(e.action) ? 'bg-amber-500' : 'bg-primary'}`} />
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${actorColors[e.actor]}`}>{e.actor}</span>
                  <span className="text-sm font-medium text-foreground">{e.actorName}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted capitalize flex items-center gap-1">
                    {CRITICAL.has(e.action) && <ShieldAlert className="w-3 h-3 text-amber-500" />}{e.action}
                  </span>
                  <span className="text-xs text-muted-foreground">· {e.entity}{e.entityId && <span className="font-mono ml-1">{e.entityId}</span>}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{fmt(e.at)}</span>
                </div>
                <p className="text-sm text-foreground mt-1">{e.summary}</p>
                <button className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1" onClick={() => setDetail(e)}><Eye className="w-3 h-3" />View details</button>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Select value={actor} onValueChange={setActor}>
            <SelectTrigger><SelectValue placeholder="Actor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actors</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="host">Host</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actions.map(a => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>{filtered.length} of {entries.length} entries</span>
          <button className="hover:text-destructive transition-colors" onClick={() => { clear(); toast('Audit log cleared'); }}>Clear log</button>
        </div>
      </Card>

      {view === 'table' && (
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground bg-muted/40">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Entity</th>
                <th className="px-4 py-3 font-medium">Summary</th>
                <th className="px-4 py-3 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">{fmt(e.at)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${actorColors[e.actor]}`}>{e.actor}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{e.actorName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize font-medium text-foreground flex items-center gap-1">
                      {CRITICAL.has(e.action) && <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                      {e.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {e.entity}{e.entityId && <span className="font-mono text-xs ml-1">{e.entityId}</span>}
                  </td>
                  <td className="px-4 py-3 text-foreground max-w-md">{e.summary}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setDetail(e)}><Eye className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No matching log entries.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      )}



      <Dialog open={!!detail} onOpenChange={o => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Audit Entry</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Timestamp</p><p>{fmt(detail.at)}</p></div>
                <div><p className="text-muted-foreground text-xs">IP Address</p><p className="font-mono">{detail.ip}</p></div>
                <div><p className="text-muted-foreground text-xs">Actor</p><p className="capitalize">{detail.actor} · {detail.actorName}</p></div>
                <div><p className="text-muted-foreground text-xs">Action</p><p className="capitalize">{detail.action}</p></div>
                <div><p className="text-muted-foreground text-xs">Entity</p><p>{detail.entity} {detail.entityId}</p></div>
              </div>
              <div><p className="text-muted-foreground text-xs">Summary</p><p>{detail.summary}</p></div>
              {(detail.before || detail.after) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Before</p>
                    <pre className="bg-muted rounded-lg p-2 text-xs overflow-auto">{JSON.stringify(detail.before ?? {}, null, 2)}</pre>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">After</p>
                    <pre className="bg-muted rounded-lg p-2 text-xs overflow-auto">{JSON.stringify(detail.after ?? {}, null, 2)}</pre>
                  </div>
                </div>
              )}
              {CRITICAL.has(detail.action) && (
                <Badge variant="outline" className="text-amber-600 border-amber-500/40">
                  <ShieldAlert className="w-3 h-3 mr-1" />Critical action
                </Badge>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
