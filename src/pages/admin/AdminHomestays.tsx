import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Edit, Trash2, Eye, MapPin, Star, Check, X, Power,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Homestay, HomestayStatus } from '@/data/homestays';
import { useHomestayStore } from '@/contexts/HomestayStoreContext';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { HomestayEditor } from '@/components/admin/HomestayEditor';
import { HomestayDetailDrawer } from '@/components/admin/HomestayDetailDrawer';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected' | 'disabled';

const statusStyle: Record<HomestayStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

export default function AdminHomestays() {
  const {
    homestays, addHomestay, updateHomestay, deleteHomestay,
    approveHomestay, rejectHomestay, setEnabled,
  } = useHomestayStore();
  const { log } = useAuditLog();
  const { push } = useNotifications();
  const { user } = useAuth();
  const actorName = user?.name ?? 'Admin';

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<FilterTab>('all');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Homestay | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewing, setViewing] = useState<Homestay | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Homestay | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Homestay | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const counts = useMemo(() => ({
    all: homestays.length,
    pending: homestays.filter(h => h.status === 'pending').length,
    approved: homestays.filter(h => h.status === 'approved').length,
    rejected: homestays.filter(h => h.status === 'rejected').length,
    disabled: homestays.filter(h => h.enabled === false).length,
  }), [homestays]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return homestays.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.province.toLowerCase().includes(q);
      const matchesTab =
        tab === 'all' ? true :
        tab === 'disabled' ? h.enabled === false :
        h.status === tab;
      return matchesSearch && matchesTab;
    });
  }, [homestays, search, tab]);

  // Actions
  const openAdd = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (h: Homestay) => { setEditing(h); setEditorOpen(true); setDrawerOpen(false); };
  const openView = (h: Homestay) => { setViewing(h); setDrawerOpen(true); };

  const handleSave = (data: Partial<Homestay>) => {
    if (editing) {
      updateHomestay(editing.id, data);
      log({
        actor: 'admin', actorName, action: 'update', entity: 'Homestay', entityId: editing.id,
        summary: `Updated homestay "${data.name ?? editing.name}"`,
        before: { name: editing.name, pricePerNight: editing.pricePerNight },
        after: { name: data.name, pricePerNight: data.pricePerNight },
      });
      toast.success('Homestay updated');
    } else {
      const created = addHomestay(data as Homestay);
      log({
        actor: 'admin', actorName, action: 'create', entity: 'Homestay', entityId: created.id,
        summary: `Created homestay "${created.name}" (pending approval)`,
      });
      push({ audience: 'admin', type: 'alert', title: 'New homestay added', body: `"${created.name}" is pending approval.`, href: '/admin/homestays' });
      toast.success('Homestay created — pending approval');
    }
  };

  const handleApprove = (h: Homestay) => {
    approveHomestay(h.id);
    log({ actor: 'admin', actorName, action: 'approve', entity: 'Homestay', entityId: h.id, summary: `Approved homestay "${h.name}"` });
    toast.success(`"${h.name}" approved and live`);
    setDrawerOpen(false);
  };

  const confirmReject = () => {
    if (!rejectTarget) return;
    rejectHomestay(rejectTarget.id, rejectReason.trim() || 'No reason provided');
    log({ actor: 'admin', actorName, action: 'reject', entity: 'Homestay', entityId: rejectTarget.id, summary: `Rejected homestay "${rejectTarget.name}"`, after: { rejectionReason: rejectReason } });
    toast.success(`"${rejectTarget.name}" rejected`);
    setRejectTarget(null);
    setRejectReason('');
    setDrawerOpen(false);
  };

  const handleToggleEnabled = (h: Homestay) => {
    const next = !(h.enabled !== false);
    setEnabled(h.id, next);
    log({
      actor: 'admin', actorName, action: next ? 'publish' : 'unpublish', entity: 'Homestay', entityId: h.id,
      summary: `${next ? 'Enabled' : 'Disabled'} homestay "${h.name}"`,
    });
    toast.success(next ? `"${h.name}" enabled` : `"${h.name}" disabled`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteHomestay(deleteTarget.id);
    log({ actor: 'admin', actorName, action: 'delete', entity: 'Homestay', entityId: deleteTarget.id, summary: `Deleted homestay "${deleteTarget.name}"` });
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const TABS: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'disabled', label: 'Disabled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Homestays</h1>
          <p className="text-muted-foreground text-sm mt-1">{homestays.length} homestays · {counts.pending} pending approval</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Homestay
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm border transition-colors',
              tab === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50',
            )}
          >
            {t.label} <span className="opacity-70">({counts[t.id]})</span>
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search homestays..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-4">
        {filtered.map((h, i) => {
          const status = (h.status ?? 'approved') as HomestayStatus;
          const disabled = h.enabled === false;
          return (
            <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={cn('p-4 flex flex-col lg:flex-row lg:items-center gap-4 hover:shadow-md transition-shadow', status === 'pending' && 'border-amber-500/40 bg-amber-500/[0.03]')}>
                <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  {h.images[0] && <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{h.name}</h3>
                    <Badge className={statusStyle[status]}>{status}</Badge>
                    {disabled && <Badge variant="outline">Disabled</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{h.location}, {h.province}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium">{h.rating || '—'}</span>
                  <span className="text-muted-foreground">({h.reviews})</span>
                </div>
                <div className="text-sm font-semibold text-foreground whitespace-nowrap">NPR {h.pricePerNight.toLocaleString()}/night</div>

                <div className="flex items-center gap-2 flex-wrap">
                  {status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleApprove(h)}><Check className="w-4 h-4 mr-1" />Approve</Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => setRejectTarget(h)}><X className="w-4 h-4 mr-1" />Reject</Button>
                    </>
                  )}
                  <div className="flex items-center gap-1.5" title={disabled ? 'Disabled' : 'Enabled'}>
                    <Power className="w-4 h-4 text-muted-foreground" />
                    <Switch checked={!disabled} onCheckedChange={() => handleToggleEnabled(h)} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openView(h)}><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(h)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(h)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No homestays match this filter.</p>
        )}
      </div>

      <HomestayEditor open={editorOpen} onOpenChange={setEditorOpen} initial={editing} onSave={handleSave} />

      <HomestayDetailDrawer
        homestay={viewing}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onApprove={handleApprove}
        onReject={h => setRejectTarget(h)}
        onToggleEnabled={handleToggleEnabled}
        onEdit={openEdit}
      />

      {/* Reject reason dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={o => { if (!o) { setRejectTarget(null); setRejectReason(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject "{rejectTarget?.name}"</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (shared with host)..."
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject}>Reject homestay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the homestay from the platform. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
