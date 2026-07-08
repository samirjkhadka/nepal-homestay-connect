import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Shield, UserCheck, UserX, Plus, Edit, Trash2, Power,
  ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, Lock, ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useUserStore, ManagedUser, ManagedUserRole, ManagedUserStatus } from '@/contexts/UserStoreContext';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_ROLE_LABELS } from '@/lib/permissions';
import { BulkConfirmDialog, BulkTarget, BulkItemResult } from '@/components/admin/BulkConfirmDialog';

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  host: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  guest: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};
const statusColors: Record<string, string> = {
  active: 'text-green-600',
  pending: 'text-yellow-600',
  inactive: 'text-muted-foreground',
};

type SortKey = 'name' | 'role' | 'status' | 'joinDate' | 'bookings';
const PAGE_SIZES = [10, 25, 50];

const emptyForm = { name: '', email: '', role: 'guest' as ManagedUserRole, status: 'active' as ManagedUserStatus };

export default function AdminUsers() {
  const { users, addUser, updateUser, deleteUser, setStatus } = useUserStore();
  const { log } = useAuditLog();
  const { user: me, can, adminRole } = useAuth();
  const actorName = me?.name ?? 'Admin';

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('joinDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [bulkAction, setBulkAction] = useState<null | 'activate' | 'deactivate' | 'delete'>(null);

  const canCreate = can('user.create');
  const canEdit = can('user.edit');
  const canDelete = can('user.delete');
  const canToggle = can('user.toggle');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = role === 'all' || u.role === role;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
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
    else { setSortKey(k); setSortDir('asc'); }
    setPage(1);
  };
  const sortIcon = (k: SortKey) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 inline ml-1" /> : <ArrowDown className="w-3 h-3 inline ml-1" />;
  };

  const pageIds = pageRows.map(u => u.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selected.has(id));
  const toggleRow = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAllPage = () => setSelected(prev => { const n = new Set(prev); if (allPageSelected) pageIds.forEach(id => n.delete(id)); else pageIds.forEach(id => n.add(id)); return n; });
  const clearSelection = () => setSelected(new Set());
  const selectedList = useMemo(() => users.filter(u => selected.has(u.id)), [users, selected]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setEditorOpen(true); };
  const openEdit = (u: ManagedUser) => { setEditing(u); setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setEditorOpen(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email are required'); return; }
    if (editing) {
      updateUser(editing.id, { ...form });
      log({ actor: 'admin', actorName, action: 'update', entity: 'User', entityId: editing.id, summary: `Updated user "${form.name}"`, before: { role: editing.role, status: editing.status }, after: { role: form.role, status: form.status } });
      toast.success('User updated');
    } else {
      const created = addUser({ ...form });
      log({ actor: 'admin', actorName, action: 'create', entity: 'User', entityId: created.id, summary: `Created user "${created.name}" (${created.role})` });
      toast.success('User created');
    }
    setEditorOpen(false);
  };

  const handleToggle = (u: ManagedUser) => {
    const next: ManagedUserStatus = u.status === 'active' ? 'inactive' : 'active';
    setStatus(u.id, next);
    log({ actor: 'admin', actorName, action: next === 'active' ? 'publish' : 'unpublish', entity: 'User', entityId: u.id, summary: `${next === 'active' ? 'Activated' : 'Deactivated'} user "${u.name}"` });
    toast.success(`"${u.name}" ${next === 'active' ? 'activated' : 'deactivated'}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    log({ actor: 'admin', actorName, action: 'delete', entity: 'User', entityId: deleteTarget.id, summary: `Deleted user "${deleteTarget.name}"` });
    toast.success(`"${deleteTarget.name}" deleted`);
    setSelected(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n; });
    setDeleteTarget(null);
  };

  // Bulk actions (via BulkConfirmDialog for per-item feedback)
  const bulkTargets: BulkTarget[] = useMemo(
    () => selectedList.map(u => ({ id: u.id, label: `${u.name} (${u.email})` })),
    [selectedList],
  );

  const runBulkItem = (target: BulkTarget): BulkItemResult => {
    const u = users.find(x => x.id === target.id);
    if (!u) return { id: target.id, label: target.label, ok: false, message: 'Not found' };
    switch (bulkAction) {
      case 'activate':
        if (u.status === 'active') return { id: u.id, label: target.label, ok: false, message: 'Already active' };
        setStatus(u.id, 'active');
        return { id: u.id, label: target.label, ok: true, message: 'Activated' };
      case 'deactivate':
        if (u.status === 'inactive') return { id: u.id, label: target.label, ok: false, message: 'Already inactive' };
        setStatus(u.id, 'inactive');
        return { id: u.id, label: target.label, ok: true, message: 'Deactivated' };
      case 'delete':
        deleteUser(u.id);
        return { id: u.id, label: target.label, ok: true, message: 'Deleted' };
      default:
        return { id: u.id, label: target.label, ok: false, message: 'Unknown action' };
    }
  };

  const completeBulk = (results: BulkItemResult[]) => {
    const done = results.filter(r => r.ok);
    if (done.length > 0) {
      const action = bulkAction === 'delete' ? 'delete' : bulkAction === 'activate' ? 'publish' : 'unpublish';
      log({
        actor: 'admin', actorName, action, entity: 'User',
        summary: `Bulk ${bulkAction}d ${done.length} user${done.length === 1 ? '' : 's'}`,
        after: { ids: done.map(r => r.id) },
      });
      clearSelection();
    }
    setBulkAction(null);
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
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-3">
          {adminRole && <Badge variant="outline" className="gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" />{ADMIN_ROLE_LABELS[adminRole]}</Badge>}
          <Button onClick={openAdd} disabled={!canCreate}><Plus className="w-4 h-4 mr-2" />Add User</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Admins', count: users.filter(u => u.role === 'admin').length, icon: Shield },
          { label: 'Hosts', count: users.filter(u => u.role === 'host').length, icon: UserCheck },
          { label: 'Guests', count: users.filter(u => u.role === 'guest').length, icon: UserCheck },
          { label: 'Pending', count: users.filter(u => u.status === 'pending').length, icon: UserX },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><s.icon className="w-4 h-4 text-primary" /></div>
            <div><p className="text-xl font-bold text-foreground">{s.count}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Name or email" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={v => { setRole(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-3 flex flex-wrap items-center gap-2 border-primary/40 bg-primary/[0.04]">
            <span className="text-sm font-medium mr-2">{selected.size} selected</span>
            <Button size="sm" variant="outline" disabled={!canToggle} onClick={() => bulkSetStatus('active')}>{canToggle ? <Power className="w-4 h-4 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}Activate</Button>
            <Button size="sm" variant="outline" disabled={!canToggle} onClick={() => bulkSetStatus('inactive')}>{canToggle ? <Power className="w-4 h-4 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}Deactivate</Button>
            <Button size="sm" variant="outline" className="text-destructive" disabled={!canDelete} onClick={bulkDelete}>{canDelete ? <Trash2 className="w-4 h-4 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}Delete</Button>
            <Button size="sm" variant="ghost" className="ml-auto" onClick={clearSelection}>Clear</Button>
          </Card>
        </motion.div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-muted-foreground">
                <th className="p-3 w-10"><Checkbox checked={allPageSelected} onCheckedChange={toggleAllPage} aria-label="Select all" /></th>
                <SortTH k="name">User</SortTH>
                <SortTH k="role">Role</SortTH>
                <SortTH k="status" className="hidden md:table-cell">Status</SortTH>
                <SortTH k="joinDate" className="hidden lg:table-cell">Joined</SortTH>
                <SortTH k="bookings" className="hidden md:table-cell">Bookings</SortTH>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No users match these filters.</td></tr>
              )}
              {pageRows.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 6) * 0.03 }}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <td className="p-3"><Checkbox checked={selected.has(u.id)} onCheckedChange={() => toggleRow(u.id)} aria-label={`Select ${u.name}`} /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{u.name.charAt(0)}</div>
                      <div><p className="font-medium text-foreground">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role]}`}>{u.role}</span></td>
                  <td className={`p-3 capitalize font-medium hidden md:table-cell ${statusColors[u.status]}`}>{u.status}</td>
                  <td className="p-3 text-muted-foreground hidden lg:table-cell">{u.joinDate}</td>
                  <td className="p-3 hidden md:table-cell">{u.bookings}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title={u.status === 'active' ? 'Deactivate' : 'Activate'} disabled={!canToggle} onClick={() => handleToggle(u)}><Power className={`w-4 h-4 ${u.status === 'active' ? 'text-emerald-600' : 'text-muted-foreground'}`} /></Button>
                      <Button variant="ghost" size="icon" title="Edit" disabled={!canEdit} onClick={() => openEdit(u)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" title="Delete" className="text-destructive" disabled={!canDelete} onClick={() => setDeleteTarget(u)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(+v); setPage(1); }}>
              <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
              <SelectContent>{PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Page {safePage} of {totalPages} · {sorted.length} result{sorted.length !== 1 ? 's' : ''}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={safePage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" disabled={safePage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit user' : 'Add user'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Full name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label className="text-xs">Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Role</Label>
                <Select value={form.role} onValueChange={(v: ManagedUserRole) => setForm(f => ({ ...f, role: v }))} disabled={!can('user.role') && !!editing}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={(v: ManagedUserStatus) => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save changes' : 'Create user'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the user. This action cannot be undone.</AlertDialogDescription>
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
