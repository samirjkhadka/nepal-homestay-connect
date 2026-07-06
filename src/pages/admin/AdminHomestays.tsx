import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Edit, Trash2, Eye, Star, Check, X, Power,
  ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, ShieldCheck, Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
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
import { ADMIN_ROLE_LABELS } from '@/lib/permissions';
import { HomestayEditor } from '@/components/admin/HomestayEditor';
import { HomestayDetailDrawer } from '@/components/admin/HomestayDetailDrawer';

const statusStyle: Record<HomestayStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

type SortKey = 'name' | 'province' | 'status' | 'pricePerNight' | 'rating' | 'createdAt';
const PAGE_SIZES = [10, 25, 50];

export default function AdminHomestays() {
  const {
    homestays, addHomestay, updateHomestay, deleteHomestay,
    approveHomestay, rejectHomestay, setEnabled,
  } = useHomestayStore();
  const { log } = useAuditLog();
  const { push } = useNotifications();
  const { user, can, adminRole } = useAuth();
  const actorName = user?.name ?? 'Admin';

  // Filters / sort / pagination
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [province, setProvince] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Editor / drawer / dialogs
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Homestay | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewing, setViewing] = useState<Homestay | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Homestay | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Homestay | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [bulkReject, setBulkReject] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('');

  const provinces = useMemo(
    () => Array.from(new Set(homestays.map(h => h.province))).sort(),
    [homestays],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return homestays.filter(h => {
      const matchesSearch = !q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.province.toLowerCase().includes(q);
      const matchesStatus =
        status === 'all' ? true :
        status === 'disabled' ? h.enabled === false :
        (h.status ?? 'approved') === status;
      const matchesProvince = province === 'all' || h.province === province;
      const created = (h.createdAt ?? '').slice(0, 10);
      if (from && created && created < from) return false;
      if (to && created && created > to) return false;
      return matchesSearch && matchesStatus && matchesProvince;
    });
  }, [homestays, search, status, province, from, to]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = (a[sortKey] ?? '') as string | number;
      const bv = (b[sortKey] ?? '') as string | number;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const counts = useMemo(() => ({
    all: homestays.length,
    pending: homestays.filter(h => h.status === 'pending').length,
  }), [homestays]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('asc'); }
    setPage(1);
  };
  const sortIcon = (k: SortKey) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 inline ml-1" /> : <ArrowDown className="w-3 h-3 inline ml-1" />;
  };

  const resetFilters = () => {
    setSearch(''); setStatus('all'); setProvince('all'); setFrom(''); setTo(''); setPage(1);
  };

  // Selection helpers
  const pageIds = pageRows.map(h => h.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selected.has(id));
  const toggleRow = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleAllPage = () => setSelected(prev => {
    const next = new Set(prev);
    if (allPageSelected) pageIds.forEach(id => next.delete(id));
    else pageIds.forEach(id => next.add(id));
    return next;
  });
  const clearSelection = () => setSelected(new Set());
  const selectedList = useMemo(() => homestays.filter(h => selected.has(h.id)), [homestays, selected]);

  // Single-row actions
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
    setRejectTarget(null); setRejectReason(''); setDrawerOpen(false);
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
    setSelected(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n; });
    setDeleteTarget(null);
  };

  // Bulk actions
  const bulkApprove = () => {
    const targets = selectedList.filter(h => h.status !== 'approved');
    targets.forEach(h => approveHomestay(h.id));
    log({ actor: 'admin', actorName, action: 'approve', entity: 'Homestay', summary: `Bulk approved ${targets.length} homestays`, after: { ids: targets.map(t => t.id) } });
    toast.success(`Approved ${targets.length} homestays`);
    clearSelection();
  };
  const confirmBulkReject = () => {
    const targets = selectedList;
    targets.forEach(h => rejectHomestay(h.id, bulkRejectReason.trim() || 'No reason provided'));
    log({ actor: 'admin', actorName, action: 'reject', entity: 'Homestay', summary: `Bulk rejected ${targets.length} homestays`, after: { rejectionReason: bulkRejectReason, ids: targets.map(t => t.id) } });
    toast.success(`Rejected ${targets.length} homestays`);
    setBulkReject(false); setBulkRejectReason(''); clearSelection();
  };
  const bulkSetEnabled = (enabled: boolean) => {
    const targets = selectedList.filter(h => (h.enabled !== false) !== enabled);
    targets.forEach(h => setEnabled(h.id, enabled));
    log({ actor: 'admin', actorName, action: enabled ? 'publish' : 'unpublish', entity: 'Homestay', summary: `Bulk ${enabled ? 'enabled' : 'disabled'} ${targets.length} homestays`, after: { ids: targets.map(t => t.id) } });
    toast.success(`${enabled ? 'Enabled' : 'Disabled'} ${targets.length} homestays`);
    clearSelection();
  };

  const canApprove = can('homestay.approve');
  const canToggle = can('homestay.toggle');
  const canEdit = can('homestay.edit');
  const canDelete = can('homestay.delete');
  const canCreate = can('homestay.create');

  const SortTH = ({ k, children, className = '' }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <th className={`p-3 font-medium ${className}`}>
      <button onClick={() => toggleSort(k)} className="hover:text-foreground transition-colors">{children}{sortIcon(k)}</button>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Homestays</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {homestays.length} homestays · {counts.pending} pending approval
          </p>
        </div>
        <div className="flex items-center gap-3">
          {adminRole && (
            <Badge variant="outline" className="gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" />{ADMIN_ROLE_LABELS[adminRole]}</Badge>
          )}
          <Button onClick={openAdd} disabled={!canCreate} title={canCreate ? undefined : 'You do not have permission to add homestays'}>
            <Plus className="w-4 h-4 mr-2" />Add Homestay
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Name, location, province" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Province</Label>
            <Select value={province} onValueChange={v => { setProvince(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All provinces</SelectItem>
                {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Created from</Label>
            <Input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} />
          </div>
          <div>
            <Label className="text-xs">Created to</Label>
            <Input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} />
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Button variant="ghost" size="sm" onClick={resetFilters}>Reset filters</Button>
        </div>
      </Card>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-3 flex flex-wrap items-center gap-2 border-primary/40 bg-primary/[0.04]">
            <span className="text-sm font-medium mr-2">{selected.size} selected</span>
            <Button size="sm" variant="outline" disabled={!canApprove} onClick={bulkApprove}>
              {canApprove ? <Check className="w-4 h-4 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}Approve
            </Button>
            <Button size="sm" variant="outline" className="text-destructive" disabled={!canApprove} onClick={() => setBulkReject(true)}>
              {canApprove ? <X className="w-4 h-4 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}Reject
            </Button>
            <Button size="sm" variant="outline" disabled={!canToggle} onClick={() => bulkSetEnabled(true)}>
              {canToggle ? <Power className="w-4 h-4 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}Enable
            </Button>
            <Button size="sm" variant="outline" disabled={!canToggle} onClick={() => bulkSetEnabled(false)}>
              {canToggle ? <Power className="w-4 h-4 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}Disable
            </Button>
            <Button size="sm" variant="ghost" className="ml-auto" onClick={clearSelection}>Clear</Button>
          </Card>
        </motion.div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-muted-foreground">
                <th className="p-3 w-10"><Checkbox checked={allPageSelected} onCheckedChange={toggleAllPage} aria-label="Select all" /></th>
                <SortTH k="name">Homestay</SortTH>
                <SortTH k="province" className="hidden lg:table-cell">Location</SortTH>
                <SortTH k="status">Status</SortTH>
                <SortTH k="rating" className="hidden md:table-cell">Rating</SortTH>
                <SortTH k="pricePerNight" className="hidden md:table-cell">Price</SortTH>
                <SortTH k="createdAt" className="hidden lg:table-cell">Created</SortTH>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No homestays match these filters.</td></tr>
              )}
              {pageRows.map((h, i) => {
                const st = (h.status ?? 'approved') as HomestayStatus;
                const disabled = h.enabled === false;
                return (
                  <motion.tr key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 6) * 0.03 }}
                    className={cn('border-t border-border hover:bg-muted/30 transition-colors', st === 'pending' && 'bg-amber-500/[0.04]')}
                  >
                    <td className="p-3"><Checkbox checked={selected.has(h.id)} onCheckedChange={() => toggleRow(h.id)} aria-label={`Select ${h.name}`} /></td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
                          {h.images[0] && <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{h.name}</p>
                          {disabled && <Badge variant="outline" className="text-[10px] mt-0.5">Disabled</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{h.location}, {h.province}</td>
                    <td className="p-3"><Badge className={statusStyle[st]}>{st}</Badge></td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" />{h.rating || '—'} <span className="text-muted-foreground">({h.reviews})</span></span>
                    </td>
                    <td className="p-3 whitespace-nowrap hidden md:table-cell">NPR {h.pricePerNight.toLocaleString()}</td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{(h.createdAt ?? '').slice(0, 10) || '—'}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {st === 'pending' && canApprove && (
                          <>
                            <Button variant="ghost" size="icon" title="Approve" onClick={() => handleApprove(h)}><Check className="w-4 h-4 text-emerald-600" /></Button>
                            <Button variant="ghost" size="icon" title="Reject" className="text-destructive" onClick={() => setRejectTarget(h)}><X className="w-4 h-4" /></Button>
                          </>
                        )}
                        <div className="mx-1" title={canToggle ? (disabled ? 'Disabled' : 'Enabled') : 'No permission'}>
                          <Switch checked={!disabled} disabled={!canToggle} onCheckedChange={() => handleToggleEnabled(h)} />
                        </div>
                        <Button variant="ghost" size="icon" title="View" onClick={() => openView(h)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Edit" disabled={!canEdit} onClick={() => openEdit(h)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Delete" className="text-destructive" disabled={!canDelete} onClick={() => setDeleteTarget(h)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(+v); setPage(1); }}>
              <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
              <SelectContent>{PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              Page {safePage} of {totalPages} · {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={safePage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" disabled={safePage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </Card>

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

      {/* Single reject dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={o => { if (!o) { setRejectTarget(null); setRejectReason(''); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject "{rejectTarget?.name}"</DialogTitle></DialogHeader>
          <Textarea placeholder="Reason for rejection (shared with host)..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject}>Reject homestay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk reject dialog */}
      <Dialog open={bulkReject} onOpenChange={o => { if (!o) { setBulkReject(false); setBulkRejectReason(''); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject {selected.size} homestays</DialogTitle></DialogHeader>
          <Textarea placeholder="Reason for rejection (applied to all selected)..." value={bulkRejectReason} onChange={e => setBulkRejectReason(e.target.value)} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setBulkReject(false); setBulkRejectReason(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmBulkReject}>Reject all</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the homestay from the platform. This action cannot be undone.</AlertDialogDescription>
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
