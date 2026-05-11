import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHostData } from '@/contexts/HostDataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const fmt = (d: Date) => d.toISOString().slice(0, 10);

export default function HostCalendar() {
  const { data, update } = useHostData();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string[]>([]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Availability Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">Click dates to select, then block or unblock.</p>
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
            const sel = selected.includes(iso);
            return (
              <button
                key={iso}
                onClick={() => toggleSelect(iso)}
                className={`aspect-square rounded text-sm transition-colors border
                  ${sel ? 'border-primary ring-2 ring-primary/30' : 'border-border'}
                  ${blocked ? 'bg-destructive/15 text-destructive line-through' : 'hover:bg-muted'}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground self-center mr-auto">{selected.length} selected</p>
            <Button variant="outline" onClick={unblockSelected}>Unblock</Button>
            <Button variant="destructive" onClick={blockSelected}>Block</Button>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-2">Currently blocked</h3>
        <p className="text-sm text-muted-foreground">{data.blockedDates.length === 0 ? 'No blocked dates.' : data.blockedDates.sort().join(', ')}</p>
      </Card>
    </div>
  );
}
