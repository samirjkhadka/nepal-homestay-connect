import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Bell, Globe, Shield, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform configuration</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">General</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Platform Name</label>
            <Input defaultValue="Nepali Homestays" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Contact Email</label>
            <Input defaultValue="info@nepalihomestays.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Service Fee (%)</label>
            <Input type="number" defaultValue="10" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-3">
          {['New booking alerts', 'Host registration alerts', 'Payment notifications', 'Review alerts'].map(n => (
            <label key={n} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">{n}</span>
              <input type="checkbox" defaultChecked className="rounded border-border" />
            </label>
          ))}
        </div>
      </Card>

      <Button>
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
}
