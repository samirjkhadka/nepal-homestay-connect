import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHostData } from '@/contexts/HostDataContext';
import { ChevronLeft, ChevronRight, X, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const fmt = (d: Date) => d.toISOString().slice(0, 10);
const eachDay = (start: string, end: string) => {
  const out: string[] = [];
  const s = new Date(start), e = new Date(end);
  if (isNaN(+s) || isNaN(+e) || s > e) return out;
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) out.push(fmt(d));
  return out;
};

export default function HostCalendar() {
  const { data, update } = useHostData();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string[]>([]);
  const [rangeFrom, setRangeFrom] = useState('');
  const [rangeTo, setRangeTo] = useState('');
  const [rangePrice, setRangePrice] = useState<number | ''>('');

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const offset = first.getDay();

  const toggleSelect = (date: string) => {
    setSelected(s => s.includes(date) ? s.filter(d => d !== date) : [...s, date]);
  };

  const blockSelected = () => {
    update('blockedDates', Array.from(new Set([...data.blockedDates, ...selected])));
    setSelected([]);
    toast({ title: `Blocked ${selected.length} date(s)` });
  };
  const unblockSelected = () => {
    update('blockedDates', data.blockedDates.filter(d => !selected.includes(d)));
    setSelected([]);
    toast({ title: `Unblocked ${selected.length} date(s)` });
  };
  const priceSelected = () => {
    const v = window.prompt('Custom price per night (NPR) for selected dates:', '3000');
    if (!v) return;
    const n = Number(v);
    if (!n || n < 0) return toast({ title: 'Invalid price', variant: 'destructive' as any });
    const next = { ...data.customPricing };
    selected.forEach(d => { next[d] = n; });
    update('customPricing', next);
    setSelected([]);
    toast({ title: `Price set on ${selected.length} date(s)`, description: `NPR ${n.toLocaleString()}/night` });
  };

  const applyRange = () => {
    const dates = eachDay(rangeFrom, rangeTo);
    if (!dates.length) return toast({ title: 'Pick a valid date range', variant: 'destructive' as any });
    if (rangePrice === '' || +rangePrice < 0) return toast({ title: 'Enter a price', variant: 'destructive' as any });
    const next = { ...data.customPricing };
    dates.forEach(d => { next[d] = +rangePrice; });
    update('customPricing', next);
    toast({ title: 'Pricing applied', description: `${dates.length} dates @ NPR ${(+rangePrice).toLocaleString()}` });
    setRangeFrom(''); setRangeTo(''); setRangePrice('');
  };

  const clearPriceFor = (date: string) => {
    const next = { ...data.customPricing };
    delete next[date];
    update('customPricing', next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Availability & Pricing</h1>
        <p className="text-muted-foreground text-sm mt-1">Click dates to select. Block, unblock, or set custom nightly pricing.</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft className="w-4 h-4" /></Button>
          <h2 className="font-semibold text-foreground">{cursor.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight className="w-4 h-4" /></Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }, (_, i) => <div key={`b${i}`} />)}
          {Array.from({ length: days }, (_, i) => {
            const d = new Date(year, month, i + 1);
            const iso = fmt(d);
            const blocked = data.blockedDates.includes(iso);
            const customPrice = data.customPricing[iso];
            const sel = selected.includes(iso);
            return (
              <button
                key={iso}
                onClick={() => toggleSelect(iso)}
                className={`relative aspect-square rounded text-sm transition-colors border flex flex-col items-center justify-center
                  ${sel ? 'border-primary ring-2 ring-primary/30' : 'border-border'}
                  ${blocked ? 'bg-destructive/15 text-destructive line-through'
                    : customPrice ? 'bg-accent/15 text-foreground'
                    : 'hover:bg-muted'}`}
              >
                <span>{i + 1}</span>
                {customPrice && !blocked && (
                  <span className="text-[9px] text-accent-foreground/80 leading-none mt-0.5">{customPrice >= 1000 ? `${Math.round(customPrice/1000)}k` : customPrice}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-destructive/15 border border-destructive/40" /> Blocked</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent/15 border border-accent/40" /> Custom price</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border border-primary ring-2 ring-primary/30" /> Selected</span>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground self-center mr-auto">{selected.length} selected</p>
            <Button variant="outline" size="sm" onClick={priceSelected}><Tag className="w-3 h-3 mr-1" />Set price</Button>
            <Button variant="outline" size="sm" onClick={unblockSelected}>Unblock</Button>
            <Button variant="destructive" size="sm" onClick={blockSelected}>Block</Button>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-3">Apply pricing to a date range</h3>
        <div className="grid sm:grid-cols-4 gap-3">
          <div><Label className="text-xs">From</Label><Input type="date" value={rangeFrom} onChange={e => setRangeFrom(e.target.value)} /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={rangeTo} onChange={e => setRangeTo(e.target.value)} /></div>
          <div><Label className="text-xs">Price/night (NPR)</Label><Input type="number" value={rangePrice} onChange={e => setRangePrice(e.target.value === '' ? '' : +e.target.value)} placeholder="e.g. 3500" /></div>
          <div className="flex items-end"><Button onClick={applyRange} className="w-full">Apply</Button></div>
        </div>

        {/* Range preview */}
        {(() => {
          const preview = eachDay(rangeFrom, rangeTo);
          if (!preview.length) return null;
          const blockedInRange = preview.filter(d => data.blockedDates.includes(d));
          const pricedInRange = preview.filter(d => data.customPricing[d] !== undefined);
          return (
            <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border text-sm space-y-2">
              <p className="font-medium text-foreground">
                Preview: {preview.length} night{preview.length === 1 ? '' : 's'}
                {rangePrice !== '' && ` · NPR ${(+rangePrice).toLocaleString()}/night · Total NPR ${(preview.length * +rangePrice).toLocaleString()}`}
              </p>
              {blockedInRange.length > 0 && (
                <p className="text-destructive text-xs">⚠ {blockedInRange.length} blocked date(s) in this range will remain blocked.</p>
              )}
              {pricedInRange.length > 0 && (
                <p className="text-amber-600 dark:text-amber-400 text-xs">{pricedInRange.length} date(s) already have a custom price — applying will overwrite.</p>
              )}
            </div>
          );
        })()}
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-2">Blocked dates</h3>
          <p className="text-sm text-muted-foreground">{data.blockedDates.length === 0 ? 'No blocked dates.' : data.blockedDates.sort().join(', ')}</p>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-2">Custom pricing</h3>
          {Object.keys(data.customPricing).length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom pricing set.</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto text-sm">
              {Object.entries(data.customPricing).sort().map(([date, price]) => (
                <div key={date} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                  <span className="text-foreground">{date}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">NPR {price.toLocaleString()}</span>
                    <button onClick={() => clearPriceFor(date)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
