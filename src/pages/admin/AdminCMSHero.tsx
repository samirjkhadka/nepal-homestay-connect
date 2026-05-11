import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { CRUDList } from '@/components/admin/CRUDList';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function AdminCMSHero() {
  const { content, update } = useCMS();
  const { hero, sectionToggles } = content;

  const setHero = (patch: Partial<typeof hero>) => update('hero', { ...hero, ...patch });
  const save = () => toast({ title: 'Hero saved', description: 'Changes are live on the homepage.' });

  return (
    <CMSPageShell title="Hero & Landing" description="Edit the homepage hero, slides and section visibility.">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Headline</Label>
            <Input value={hero.headline} onChange={e => setHero({ headline: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Subheadline</Label>
            <Textarea value={hero.subheadline} onChange={e => setHero({ subheadline: e.target.value })} rows={2} />
          </div>
          <div>
            <Label>Primary CTA</Label>
            <Input value={hero.ctaPrimary} onChange={e => setHero({ ctaPrimary: e.target.value })} />
          </div>
          <div>
            <Label>Secondary CTA</Label>
            <Input value={hero.ctaSecondary} onChange={e => setHero({ ctaSecondary: e.target.value })} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Hero Slides</h3>
          <CRUDList
            items={hero.slides}
            onChange={(slides) => setHero({ slides })}
            fields={[
              { key: 'caption', label: 'Caption' },
              { key: 'imageUrl', label: 'Image URL', placeholder: 'https://...' },
            ]}
            defaults={{ caption: 'New slide', imageUrl: '/placeholder.svg' } as any}
            addLabel="Add slide"
          />
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Section Visibility</h3>
          <Card className="p-4 space-y-3">
            {Object.entries(sectionToggles).map(([key, val]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                <Switch checked={val} onCheckedChange={(v) => update('sectionToggles', { ...sectionToggles, [key]: v } as any)} />
              </label>
            ))}
          </Card>
        </div>

        <Button onClick={save}><Save className="w-4 h-4 mr-2" />Save</Button>
      </div>
    </CMSPageShell>
  );
}
