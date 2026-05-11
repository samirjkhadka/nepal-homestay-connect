import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminCMSPages() {
  const { content, update } = useCMS();

  const setPage = (slug: string, patch: any) => {
    update('staticPages', content.staticPages.map(p => p.slug === slug ? { ...p, ...patch } : p));
  };

  return (
    <CMSPageShell title="Static Pages" description="Edit copy for About, Contact, Privacy, Terms, etc.">
      <div className="space-y-4">
        {content.staticPages.map(page => (
          <Card key={page.slug} className="p-4 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <Label>Slug</Label>
                <Input value={page.slug} disabled />
              </div>
              <div className="sm:col-span-2">
                <Label>Title</Label>
                <Input value={page.title} onChange={e => setPage(page.slug, { title: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Body</Label>
              <Textarea value={page.body} onChange={e => setPage(page.slug, { body: e.target.value })} rows={6} />
            </div>
          </Card>
        ))}
        <Button onClick={() => toast({ title: 'Pages saved' })}><Save className="w-4 h-4 mr-2" />Save</Button>
      </div>
    </CMSPageShell>
  );
}
