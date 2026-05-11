import { useCMS } from '@/contexts/CMSContext';
import { CMSPageShell } from '@/components/admin/CMSPageShell';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function AdminCMSTheme() {
  const { content, update, reset } = useCMS();
  const { theme } = content;

  // Live-apply primary/accent/background CSS variables.
  useEffect(() => {
    const root = document.documentElement;
    if (theme.primary) root.style.setProperty('--primary', theme.primary);
    if (theme.accent) root.style.setProperty('--accent', theme.accent);
    if (theme.background) root.style.setProperty('--background', theme.background);
  }, [theme]);

  const setTheme = (patch: Partial<typeof theme>) => update('theme', { ...theme, ...patch });

  return (
    <CMSPageShell title="Theme & Branding" description="Colors, logo, site name. HSL triplets like “20 65% 48%”.">
      <Card className="p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Site Name</Label>
            <Input value={theme.siteName} onChange={e => setTheme({ siteName: e.target.value })} />
          </div>
          <div>
            <Label>Logo URL</Label>
            <Input value={theme.logoUrl} onChange={e => setTheme({ logoUrl: e.target.value })} />
          </div>
          <div>
            <Label>Favicon URL</Label>
            <Input value={theme.faviconUrl} onChange={e => setTheme({ faviconUrl: e.target.value })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Default dark mode</Label>
            <Switch checked={theme.defaultDarkMode} onCheckedChange={(v) => setTheme({ defaultDarkMode: v })} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-3 border-t border-border">
          {(['primary', 'accent', 'background'] as const).map(k => (
            <div key={k}>
              <Label className="capitalize">{k} (HSL)</Label>
              <Input value={(theme as any)[k]} onChange={e => setTheme({ [k]: e.target.value } as any)} placeholder="20 65% 48%" />
              <div className="mt-2 h-8 rounded border border-border" style={{ background: `hsl(${(theme as any)[k]})` }} />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-3 border-t border-border">
          <Button onClick={() => toast({ title: 'Theme saved' })}><Save className="w-4 h-4 mr-2" />Save</Button>
          <Button variant="outline" onClick={() => { reset(); toast({ title: 'Reset to defaults' }); }}>
            <RotateCcw className="w-4 h-4 mr-2" />Reset all CMS
          </Button>
        </div>
      </Card>
    </CMSPageShell>
  );
}
