import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Power, Lock, ShieldCheck, MapPin, Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useContentStore, ContentItem, ContentKind } from '@/contexts/ContentStoreContext';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_ROLE_LABELS } from '@/lib/permissions';

const KIND_LABEL: Record<ContentKind, string> = { province: 'Province', amenity: 'Amenity' };

export default function AdminContent() {
  const { items, addItem, updateItem, deleteItem, setEnabled } = useContentStore();
  const { log } = useAuditLog();
  const { user: me, can, adminRole } = useAuth();
  const actorName = me?.name ?? 'Admin';

  const [kind, setKind] = useState<ContentKind>('province');
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '' });
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  const canCreate = can('content.create');
  const canEdit = can('content.edit');
  const canDelete = can('content.delete');
  const canToggle = can('content.toggle');

  const list = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(i => i.kind === kind && (!q || i.name.toLowerCase().includes(q)));
  }, [items, kind, search]);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', icon: '' }); setEditorOpen(true); };
  const openEdit = (i: ContentItem) => { setEditing(i); setForm({ name: i.name, description: i.description, icon: i.icon ?? '' }); setEditorOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (editing) {
      updateItem(editing.id, { name: form.name.trim(), description: form.description, icon: form.icon });
      log({ actor: 'admin', actorName, action: 'update', entity: KIND_LABEL[editing.kind], entityId: editing.id, summary: `Updated ${editing.kind} "${form.name}"`, before: { name: editing.name }, after: { name: form.name } });
      toast.success(`${KIND_LABEL[editing.kind]} updated`);
    } else {
      const created = addItem({ kind, name: form.name.trim(), description: form.description, icon: form.icon || undefined });
      log({ actor: 'admin', actorName, action: 'create', entity: KIND_LABEL[kind], entityId: created.id, summary: `Created ${kind} "${created.name}"` });
      toast.success(`${KIND_LABEL[kind]} created`);
    }
    setEditorOpen(false);
  };

  const handleToggle = (i: ContentItem) => {
    const next = !i.enabled;
    setEnabled(i.id, next);
    log({ actor: 'admin', actorName, action: next ? 'publish' : 'unpublish', entity: KIND_LABEL[i.kind], entityId: i.id, summary: `${next ? 'Enabled' : 'Disabled'} ${i.kind} "${i.name}"` });
    toast.success(`"${i.name}" ${next ? 'enabled' : 'disabled'}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteItem(deleteTarget.id);
    log({ actor: 'admin', actorName, action: 'delete', entity: KIND_LABEL[deleteTarget.kind], entityId: deleteTarget.id, summary: `Deleted ${deleteTarget.kind} "${deleteTarget.name}"` });
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const renderTable = () => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-muted-foreground">
              <th className="p-3 font-medium">{KIND_LABEL[kind]}</th>
              <th className="p-3 font-medium hidden md:table-cell">Description</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">No {kind}s found.</td></tr>
            )}
            {list.map((i, idx) => (
              <motion.tr key={i.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(idx, 6) * 0.03 }}
                className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    {kind === 'province' ? <MapPin className="w-4 h-4 text-primary" /> : <Wifi className="w-4 h-4 text-primary" />}
                    {i.name}
                  </div>
                  {i.icon && <span className="text-xs text-muted-foreground ml-6">icon: {i.icon}</span>}
                </td>
                <td className="p-3 hidden md:table-cell text-muted-foreground line-clamp-1">{i.description || '—'}</td>
                <td className="p-3">
                  <Badge className={i.enabled ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
                    {i.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" disabled={!canToggle} onClick={() => handleToggle(i)}
                      title={canToggle ? (i.enabled ? 'Disable' : 'Enable') : 'No permission'}>
                      {canToggle ? <Power className={`w-4 h-4 ${i.enabled ? 'text-emerald-500' : ''}`} /> : <Lock className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" disabled={!canEdit} onClick={() => openEdit(i)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" disabled={!canDelete} onClick={() => setDeleteTarget(i)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content & Taxonomy</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage provinces and amenities used across listings</p>
        </div>
        <div className="flex items-center gap-3">
          {adminRole && <Badge variant="outline" className="gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" />{ADMIN_ROLE_LABELS[adminRole]}</Badge>}
          <Button onClick={openAdd} disabled={!canCreate} title={canCreate ? undefined : 'No permission to create'}>
            <Plus className="w-4 h-4 mr-2" />Add {KIND_LABEL[kind]}
          </Button>
        </div>
      </div>

      <Tabs value={kind} onValueChange={v => setKind(v as ContentKind)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="province">Provinces</TabsTrigger>
            <TabsTrigger value="amenity">Amenities</TabsTrigger>
          </TabsList>
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <TabsContent value="province" className="mt-4">{renderTable()}</TabsContent>
        <TabsContent value="amenity" className="mt-4">{renderTable()}</TabsContent>
      </Tabs>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? `Edit ${KIND_LABEL[editing.kind]}` : `Add ${KIND_LABEL[kind]}`}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            {(editing?.kind ?? kind) === 'amenity' && (
              <div>
                <Label className="text-xs">Lucide icon name (optional)</Label>
                <Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="e.g. Wifi" />
              </div>
            )}
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save changes' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.kind}?</AlertDialogTitle>
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
