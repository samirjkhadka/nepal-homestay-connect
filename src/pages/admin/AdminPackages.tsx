import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Edit, Trash2, Power, Package as PackageIcon, Star, Lock, ShieldCheck,
  ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { usePackageStore, TravelPackage } from '@/contexts/PackageStoreContext';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_ROLE_LABELS } from '@/lib/permissions';

type SortKey = 'name' | 'price' | 'reviews' | 'rating';
const PAGE_SIZES = [10, 25, 50];

const emptyForm = {
  name: '', category: 'Trekking', duration: '', difficulty: 'Moderate', price: '',
  imageUrl: '/placeholder.svg', description: '', highlights: '', reviews: '', rating: '',
};

export default function AdminPackages() {
  const { packages, addPackage, updatePackage, deletePackage, setEnabled } = usePackageStore();
  const { log } = useAuditLog();
  const { user: me, can, adminRole } = useAuth();
  const actorName = me?.name ?? 'Admin';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('reviews');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<TravelPackage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<TravelPackage | null>(null);

  const canCreate = can('package.create');
  const canEdit = can('package.edit');
  const canDelete = can('package.delete');
  const canToggle = can('package.toggle');

  const categories = useMemo(() => Array.from(new Set(packages.map(p => p.category))).sort(), [packages]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return packages.filter(p => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchesCat = category === 'all' || p.category === category;
      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'enabled' && p.enabled)
        || (statusFilter === 'disabled' && !p.enabled)
        || (statusFilter === 'draft' && p.status === 'draft');
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [packages, search, category, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] as string | number; const bv = b[sortKey] as string | number;
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
    if (sortKey === k) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir(k === 'name' ? 'asc' : 'desc'); }
    setPage(1);
  };
  const sortIcon = (k: SortKey) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 inline ml-1" /> : <ArrowDown className="w-3 h-3 inline ml-1" />;
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setEditorOpen(true); };
  const openEdit = (p: TravelPackage) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, duration: p.duration, difficulty: p.difficulty, price: String(p.price), imageUrl: p.imageUrl, description: p.description, highlights: p.highlights.join('\n'), reviews: String(p.reviews), rating: String(p.rating) });
    setEditorOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (Number(form.price) <= 0) { toast.error('Price must be greater than 0'); return; }
    const payload = {
      name: form.name.trim(), category: form.category, duration: form.duration, difficulty: form.difficulty,
      price: Number(form.price), imageUrl: form.imageUrl, description: form.description,
      highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      reviews: Number(form.reviews) || 0, rating: Number(form.rating) || 0,
    };
    if (editing) {
      updatePackage(editing.id, payload);
      log({ actor: 'admin', actorName, action: 'update', entity: 'Package', entityId: editing.id, summary: `Updated package "${payload.name}"`, before: { price: editing.price }, after: { price: payload.price } });
      toast.success('Package updated');
    } else {
      const created = addPackage(payload);
      log({ actor: 'admin', actorName, action: 'create', entity: 'Package', entityId: created.id, summary: `Created package "${created.name}"` });
      toast.success('Package created');
    }
    setEditorOpen(false);
  };

  const handleToggle = (p: TravelPackage) => {
    const next = !p.enabled;
    setEnabled(p.id, next);
    log({ actor: 'admin', actorName, action: next ? 'publish' : 'unpublish', entity: 'Package', entityId: p.id, summary: `${next ? 'Enabled' : 'Disabled'} package "${p.name}"` });
    toast.success(`"${p.name}" ${next ? 'enabled' : 'disabled'}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deletePackage(deleteTarget.id);
    log({ actor: 'admin', actorName, action: 'delete', entity: 'Package', entityId: deleteTarget.id, summary: `Deleted package "${deleteTarget.name}"` });
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const SortTH = ({ k, children, className = '' }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <th className={`p-3 font-medium ${className}`}>
      <button onClick={() => toggleSort(k)} className="hover:text-foreground transition-colors">{children}{sortIcon(k)}</button>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Packages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {packages.length} packages · {packages.filter(p => !p.enabled).length} disabled
          </p>
        </div>
        <div className="flex items-center gap-3">
          {adminRole && <Badge variant="outline" className="gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" />{ADMIN_ROLE_LABELS[adminRole]}</Badge>}
          <Button onClick={openAdd} disabled={!canCreate} title={canCreate ? undefined : 'No permission to create'}>
            <Plus className="w-4 h-4 mr-2" />Add Package
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Name or category" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={v => { setCategory(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-muted-foreground">
                <SortTH k="name">Package</SortTH>
                <th className="p-3 font-medium hidden md:table-cell">Category</th>
                <SortTH k="reviews" className="hidden md:table-cell">Popularity</SortTH>
                <SortTH k="price">Price</SortTH>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No packages match these filters.</td></tr>
              )}
              {pageRows.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 6) * 0.03 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="font-medium text-foreground line-clamp-1">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.duration} · {p.difficulty}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell"><Badge variant="secondary">{p.category}</Badge></td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{p.rating} · {p.reviews} reviews
                    </div>
                  </td>
                  <td className="p-3 font-medium text-foreground">NPR {p.price.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <Badge className={p.enabled ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 w-fit' : 'bg-muted text-muted-foreground w-fit'}>
                        {p.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      {p.status === 'draft' && <Badge variant="outline" className="w-fit text-xs">Draft</Badge>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" disabled={!canToggle} onClick={() => handleToggle(p)}
                        title={canToggle ? (p.enabled ? 'Disable' : 'Enable') : 'No permission'}>
                        {canToggle ? <Power className={`w-4 h-4 ${p.enabled ? 'text-emerald-500' : ''}`} /> : <Lock className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" disabled={!canEdit} onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" disabled={!canDelete} onClick={() => setDeleteTarget(p)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows</span>
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
              <SelectContent>{PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <span>· {sorted.length} results</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm">Page {safePage} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Package' : 'Add Package'}</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="text-xs">Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Difficulty</Label>
              <Input value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Duration</Label>
              <Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 7-10 days" />
            </div>
            <div>
              <Label className="text-xs">Price (NPR)</Label>
              <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Rating</Label>
              <Input type="number" step="0.1" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Reviews (popularity)</Label>
              <Input type="number" value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Image URL</Label>
              <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Highlights (one per line)</Label>
              <Textarea value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save changes' : 'Create package'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete package?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes "{deleteTarget?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
