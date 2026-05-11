import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useHostData } from '@/contexts/HostDataContext';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function HostSettings() {
  const { data, update, reset } = useHostData();
  const { settings, earnings } = data;

  const setS = (patch: Partial<typeof settings>) => update('settings', { ...settings, ...patch });
  const setPayout = (patch: Partial<typeof earnings.payoutMethod>) =>
    update('earnings', { ...earnings, payoutMethod: { ...earnings.payoutMethod, ...patch } });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Notifications, payouts and account preferences.</p>
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        {[
          { key: 'notifyEmail', label: 'Email alerts for new bookings' },
          { key: 'notifySMS', label: 'SMS alerts for urgent updates' },
          { key: 'autoAcceptBookings', label: 'Auto-approve bookings under 3 nights' },
          { key: 'instantBook', label: 'Allow Instant Book' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">{label}</span>
            <Switch checked={(settings as any)[key]} onCheckedChange={v => setS({ [key]: v } as any)} />
          </label>
        ))}
      </Card>

      <Card className="p-5 space-y-3">
        <h3 className="font-semibold text-foreground">Payout Method</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Type</Label>
            <Input value={earnings.payoutMethod.type} onChange={e => setPayout({ type: e.target.value })} />
          </div>
          <div>
            <Label>Account</Label>
            <Input value={earnings.payoutMethod.account} onChange={e => setPayout({ account: e.target.value })} />
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button onClick={() => toast({ title: 'Settings saved' })}><Save className="w-4 h-4 mr-2" />Save</Button>
        <Button variant="outline" onClick={() => { reset(); toast({ title: 'Reset host data' }); }}>
          <RotateCcw className="w-4 h-4 mr-2" />Reset all data
        </Button>
      </div>
    </div>
  );
}
