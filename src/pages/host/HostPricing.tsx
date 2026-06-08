import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, Percent, CalendarRange, Zap, Save, Sparkles,
} from 'lucide-react';
import { useHostData } from '@/contexts/HostDataContext';
import { useAuditLog } from '@/contexts/AuditLogContext';
import { toast } from 'sonner';

interface SeasonRule { id: string; label: string; multiplier: number; }

const DEFAULT_SEASONS: SeasonRule[] = [
  { id: 's1', label: 'Peak (Oct–Nov)', multiplier: 1.4 },
  { id: 's2', label: 'Festival (Dashain/Tihar)', multiplier: 1.6 },
  { id: 's3', label: 'Monsoon (Jun–Aug)', multiplier: 0.8 },
];

export default function HostPricing() {
  const { data } = useHostData();
  const { log } = useAuditLog();
  const base = data.properties[0]?.pricePerNight ?? 2500;

  const [seasons, setSeasons] = useState<SeasonRule[]>(DEFAULT_SEASONS);
  const [weekly, setWeekly] = useState(10);
  const [monthly, setMonthly] = useState(25);
  const [lastMinute, setLastMinute] = useState(false);
  const [lastMinutePct, setLastMinutePct] = useState(15);
  const [minStay, setMinStay] = useState(2);

  const competitorAvg = Math.round(base * 1.08);

  const save = () => {
    log({ actor: 'host', actorName: 'Ram Host', action: 'update', entity: 'Pricing Rules', summary: `Updated dynamic pricing: weekly ${weekly}%, monthly ${monthly}%, last-minute ${lastMinute ? lastMinutePct + '%' : 'off'}` });
    toast.success('Pricing rules saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />Dynamic Pricing
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Maximise revenue with smart pricing rules</p>
        </div>
        <Button onClick={save}><Save className="w-4 h-4 mr-2" />Save rules</Button>
      </div>

      {/* Competitor suggestion */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5 bg-gradient-to-br from-accent/10 via-card to-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Similar homestays nearby average <span className="font-semibold">NPR {competitorAvg.toLocaleString()}</span>/night.</p>
              <p className="text-xs text-muted-foreground">Your base rate is NPR {base.toLocaleString()}. Consider a small increase on peak dates.</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Seasonal multipliers */}
      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><CalendarRange className="w-4 h-4 text-primary" />Seasonal pricing</h2>
        <div className="space-y-3">
          {seasons.map(s => (
            <div key={s.id} className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground flex-1">{s.label}</span>
              <div className="flex items-center gap-2">
                <Input type="number" step="0.05" value={s.multiplier} onChange={e =>
                  setSeasons(prev => prev.map(x => x.id === s.id ? { ...x, multiplier: +e.target.value } : x))
                } className="w-20 text-right" />
                <span className="text-xs text-muted-foreground">×</span>
                <Badge variant="secondary" className="w-24 justify-center">NPR {Math.round(base * s.multiplier).toLocaleString()}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Length of stay discounts */}
      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Percent className="w-4 h-4 text-primary" />Length-of-stay discounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-foreground block mb-1">Weekly (7+ nights) %</label>
            <Input type="number" value={weekly} onChange={e => setWeekly(+e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-foreground block mb-1">Monthly (28+ nights) %</label>
            <Input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} />
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          7-night stay ≈ NPR {Math.round(base * 7 * (1 - weekly / 100)).toLocaleString()} · 28-night ≈ NPR {Math.round(base * 28 * (1 - monthly / 100)).toLocaleString()}
        </div>
      </Card>

      {/* Last minute + min stay */}
      <Card className="p-5 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Smart rules</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Last-minute discount</p>
            <p className="text-xs text-muted-foreground">Auto-reduce price for bookings within 7 days</p>
          </div>
          <Switch checked={lastMinute} onCheckedChange={setLastMinute} />
        </div>
        {lastMinute && (
          <div className="pl-1">
            <label className="text-sm text-foreground block mb-1">Discount %</label>
            <Input type="number" value={lastMinutePct} onChange={e => setLastMinutePct(+e.target.value)} className="w-32" />
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-sm text-foreground">Minimum stay</p>
            <p className="text-xs text-muted-foreground">Auto-decline shorter bookings</p>
          </div>
          <Input type="number" value={minStay} onChange={e => setMinStay(+e.target.value)} className="w-24" />
        </div>
      </Card>
    </div>
  );
}
