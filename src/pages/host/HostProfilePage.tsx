import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useHostData } from '@/contexts/HostDataContext';
import { Save, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CRUDList } from '@/components/admin/CRUDList';

export default function HostProfilePage() {
  const { data, update } = useHostData();
  const { profile } = data;
  const set = (patch: Partial<typeof profile>) => update('profile', { ...profile, ...patch });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Host Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">How guests see you and your community.</p>
      </div>

      <Card className="p-5 space-y-3">
        <Label>Bio</Label>
        <Textarea rows={4} value={profile.bio} onChange={e => set({ bio: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Video intro URL</Label>
            <Input value={profile.videoUrl} onChange={e => set({ videoUrl: e.target.value })} placeholder="YouTube or Vimeo URL" />
          </div>
          <div>
            <Label>Languages (comma separated)</Label>
            <Input value={profile.languages.join(', ')} onChange={e => set({ languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-3">Meet the Community</h3>
        <CRUDList
          items={profile.family}
          onChange={(family) => set({ family })}
          fields={[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]}
          defaults={{ name: 'New member', role: '' } as any}
          addLabel="Add member"
        />
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-3">Verification</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {Object.entries(profile.verified).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm capitalize text-foreground">{k}</span>
              {v ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={() => toast({ title: 'Profile saved' })}><Save className="w-4 h-4 mr-2" />Save Profile</Button>
    </div>
  );
}
