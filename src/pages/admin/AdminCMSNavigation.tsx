import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export default function AdminCMSNavigation() {
  const { content, update } = useCMS();

  const updateCol = (idx: number, patch: any) => {
    const next = [...content.footerColumns];
    next[idx] = { ...next[idx], ...patch };
    update('footerColumns', next);
  };
  const addCol = () => {
    update('footerColumns', [...content.footerColumns, { id: uid('fc'), title: 'New column', links: [] }]);
  };

  return (
    <CMSPageShell title="Navigation & Footer" description="Manage navbar links, footer columns, tagline and socials.">
      <div className="space-y-8">
        <section>
          <h3 className="font-semibold text-foreground mb-3">Navbar Links</h3>
          <CRUDList
            items={content.navLinks}
            onChange={(navLinks) => update('navLinks', navLinks)}
            fields={[
              { key: 'label', label: 'Label' },
              { key: 'href', label: 'URL' },
              { key: 'visible', label: 'Visible', type: 'switch' },
            ]}
            defaults={{ label: 'New link', href: '/', visible: true } as any}
            addLabel="Add link"
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Footer Columns</h3>
            <Button size="sm" variant="outline" onClick={addCol}><Plus className="w-4 h-4 mr-1" />Column</Button>
          </div>
          <div className="space-y-4">
            {content.footerColumns.map((col, idx) => (
              <Card key={col.id} className="p-4 space-y-3">
                <Input value={col.title} onChange={e => updateCol(idx, { title: e.target.value })} placeholder="Column title" />
                <CRUDList
                  items={col.links}
                  onChange={(links) => updateCol(idx, { links })}
                  fields={[
                    { key: 'label', label: 'Label' },
                    { key: 'href', label: 'URL' },
                    { key: 'visible', label: 'Visible', type: 'switch' },
                  ]}
                  defaults={{ label: 'New link', href: '/', visible: true } as any}
                  addLabel="Add link"
                />
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-3">Footer Tagline & Socials</h3>
          <Card className="p-4 space-y-3">
            <div>
              <Label>Tagline</Label>
              <Input value={content.footerTagline} onChange={e => update('footerTagline', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {(['twitter', 'facebook', 'instagram', 'youtube'] as const).map(k => (
                <div key={k}>
                  <Label className="capitalize">{k}</Label>
                  <Input value={content.socials[k]} onChange={e => update('socials', { ...content.socials, [k]: e.target.value })} />
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </CMSPageShell>
  );
}
