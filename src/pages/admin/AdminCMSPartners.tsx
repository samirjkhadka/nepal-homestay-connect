import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ICONS = ['CreditCard', 'Plane', 'PartyPopper', 'Building2'] as const;
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export default function AdminCMSPartners() {
  const { content, update } = useCMS();
  const { partners } = content;

  const updateCat = (idx: number, patch: any) => {
    const next = [...partners];
    next[idx] = { ...next[idx], ...patch };
    update('partners', next);
  };
  const removeCat = (idx: number) => {
    update('partners', partners.filter((_, i) => i !== idx));
    toast({ title: 'Category deleted' });
  };
  const addCat = () => {
    update('partners', [...partners, { id: uid('cat'), title: 'New category', icon: 'Handshake' as any, description: '', partners: [] }]);
  };

  return (
    <CMSPageShell title="Partners" description="Manage payment, travel, event and community partners." action={{ label: 'Add Category', onClick: addCat }}>
      <div className="space-y-6">
        {partners.map((cat, idx) => (
          <Card key={cat.id} className="p-4 space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <Input value={cat.title} onChange={e => updateCat(idx, { title: e.target.value })} placeholder="Category title" />
              <select
                value={cat.icon}
                onChange={e => updateCat(idx, { icon: e.target.value })}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <div className="flex gap-2">
                <Input value={cat.description} onChange={e => updateCat(idx, { description: e.target.value })} placeholder="Description" />
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => removeCat(idx)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>

            <CRUDList
              items={cat.partners}
              onChange={(arr) => updateCat(idx, { partners: arr })}
              fields={[
                { key: 'name', label: 'Name' },
                { key: 'tag', label: 'Tag' },
                { key: 'website', label: 'Website URL' },
                { key: 'logoUrl', label: 'Logo URL' },
              ]}
              defaults={{ name: 'New partner', tag: '', website: '', logoUrl: '' } as any}
              addLabel="Add partner"
            />
          </Card>
        ))}
      </div>
    </CMSPageShell>
  );
}
