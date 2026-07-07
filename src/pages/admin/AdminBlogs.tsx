import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Edit, Trash2, Newspaper, FileText, Eye, EyeOff,
  ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, Lock, ShieldCheck,
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
import { useArticleStore, Article, ArticleType } from '@/contexts/ArticleStoreContext';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_ROLE_LABELS } from '@/lib/permissions';

type SortKey = 'title' | 'status' | 'createdAt' | 'author';
const PAGE_SIZES = [10, 25, 50];

const emptyForm = {
  type: 'blog' as ArticleType, title: '', slug: '', excerpt: '', body: '',
  coverUrl: '/placeholder.svg', author: 'Editor', category: 'General', tags: '',
};

export default function AdminBlogs() {
  const { articles, addArticle, updateArticle, deleteArticle, setPublished } = useArticleStore();
  const { log } = useAuditLog();
  const { user: me, can, adminRole } = useAuth();
  const actorName = me?.name ?? 'Admin';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const canCreate = can('blog.create');
  const canEdit = can('blog.edit');
  const canDelete = can('blog.delete');
  const canPublish = can('blog.publish');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter(a => {
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      const matchesType = typeFilter === 'all' || a.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [articles, search, typeFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] as string; const bv = b[sortKey] as string;
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

  const openAdd = () => { setEditing(null); setForm(emptyForm); setEditorOpen(true); };
  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ type: a.type, title: a.title, slug: a.slug, excerpt: a.excerpt, body: a.body, coverUrl: a.coverUrl, author: a.author, category: a.category, tags: a.tags.join(', ') });
    setEditorOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editing) {
      updateArticle(editing.id, { ...form, tags });
      log({ actor: 'admin', actorName, action: 'update', entity: editing.type === 'news' ? 'News' : 'Blog', entityId: editing.id, summary: `Updated ${editing.type} "${form.title}"`, before: { title: editing.title }, after: { title: form.title } });
      toast.success('Article updated');
    } else {
      const created = addArticle({ ...form, tags });
      log({ actor: 'admin', actorName, action: 'create', entity: form.type === 'news' ? 'News' : 'Blog', entityId: created.id, summary: `Created ${form.type} "${created.title}"` });
      toast.success('Article created (draft)');
    }
    setEditorOpen(false);
  };

  const handleTogglePublish = (a: Article) => {
    const publish = a.status !== 'published';
    setPublished(a.id, publish);
    log({ actor: 'admin', actorName, action: publish ? 'publish' : 'unpublish', entity: a.type === 'news' ? 'News' : 'Blog', entityId: a.id, summary: `${publish ? 'Published' : 'Unpublished'} ${a.type} "${a.title}"` });
    toast.success(`"${a.title}" ${publish ? 'published' : 'unpublished'}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteArticle(deleteTarget.id);
    log({ actor: 'admin', actorName, action: 'delete', entity: deleteTarget.type === 'news' ? 'News' : 'Blog', entityId: deleteTarget.id, summary: `Deleted ${deleteTarget.type} "${deleteTarget.title}"` });
    toast.success(`"${deleteTarget.title}" deleted`);
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
          <h1 className="text-2xl font-bold text-foreground">Blogs & News</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {articles.length} articles · {articles.filter(a => a.status === 'draft').length} drafts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {adminRole && <Badge variant="outline" className="gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" />{ADMIN_ROLE_LABELS[adminRole]}</Badge>}
          <Button onClick={openAdd} disabled={!canCreate} title={canCreate ? undefined : 'No permission to create'}>
            <Plus className="w-4 h-4 mr-2" />New Article
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Title, author, category" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Type</Label>
            <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="news">News</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
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
                <SortTH k="title">Title</SortTH>
                <th className="p-3 font-medium">Type</th>
                <SortTH k="author" className="hidden md:table-cell">Author</SortTH>
                <SortTH k="status">Status</SortTH>
                <SortTH k="createdAt" className="hidden lg:table-cell">Created</SortTH>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No articles match these filters.</td></tr>
              )}
              {pageRows.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 6) * 0.03 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="font-medium text-foreground line-clamp-1">{a.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{a.excerpt}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="gap-1">
                      {a.type === 'news' ? <Newspaper className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {a.type}
                    </Badge>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{a.author}</td>
                  <td className="p-3">
                    <Badge className={a.status === 'published' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" disabled={!canPublish} onClick={() => handleTogglePublish(a)}
                        title={canPublish ? (a.status === 'published' ? 'Unpublish' : 'Publish') : 'No permission'}>
                        {!canPublish ? <Lock className="w-4 h-4" /> : a.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" disabled={!canEdit} onClick={() => openEdit(a)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" disabled={!canDelete} onClick={() => setDeleteTarget(a)}><Trash2 className="w-4 h-4" /></Button>
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

      {/* Editor */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Article' : 'New Article'}</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as ArticleType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Slug (optional)</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated from title" />
            </div>
            <div>
              <Label className="text-xs">Author</Label>
              <Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Cover image URL</Label>
              <Input value={form.coverUrl} onChange={e => setForm(f => ({ ...f, coverUrl: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Tags (comma separated)</Label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Excerpt</Label>
              <Textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Body</Label>
              <Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save changes' : 'Create draft'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete article?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes "{deleteTarget?.title}". This action cannot be undone.
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
