import { useState } from 'react';
import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Plus, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export default function AdminCMSMedia() {
  const { content, update } = useCMS();
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [search, setSearch] = useState('');

  const add = () => {
    if (!url) return toast({ title: 'URL required', variant: 'destructive' });
    update('media', [
      { id: uid('m'), url, label: label || 'Untitled', createdAt: new Date().toISOString().slice(0, 10) },
      ...content.media,
    ]);
    setUrl(''); setLabel('');
    toast({ title: 'Added to library' });
  };
  const remove = (id: string) => {
    update('media', content.media.filter(m => m.id !== id));
  };
  const copy = async (u: string) => {
    await navigator.clipboard.writeText(u);
    toast({ title: 'URL copied' });
  };

  const filtered = content.media.filter(m =>
    m.label.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CMSPageShell title="Media Library" description="A catalog of image URLs you can paste anywhere in the CMS.">
      <div className="space-y-5">
        <Card className="p-4">
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Image URL (https://...)" />
            <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label" />
            <Button onClick={add}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </Card>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search media..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(m => (
            <Card key={m.id} className="overflow-hidden group">
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={m.url} alt={m.label} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{m.label}</p>
                <p className="text-xs text-muted-foreground truncate">{m.url}</p>
                <div className="flex gap-1 mt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => copy(m.url)}>
                    <Copy className="w-3 h-3 mr-1" />Copy
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(m.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </CMSPageShell>
  );
}
