import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'image' | 'switch';
  placeholder?: string;
}

interface Props<T extends { id: string }> {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldDef[];
  addLabel?: string;
  defaults: Omit<T, 'id'>;
  reorderable?: boolean;
}

const uid = () => `i-${Math.random().toString(36).slice(2, 8)}`;

export function CRUDList<T extends { id: string; [k: string]: any }>({
  items, onChange, fields, addLabel = 'Add item', defaults, reorderable = true,
}: Props<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const update = (id: string, key: string, val: any) => {
    onChange(items.map(i => i.id === id ? { ...i, [key]: val } : i));
  };
  const remove = (id: string) => {
    onChange(items.filter(i => i.id !== id));
    toast({ title: 'Deleted' });
  };
  const add = () => {
    const newItem = { ...defaults, id: uid() } as unknown as T;
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = editingId === item.id;
        return (
          <Card key={item.id} className="p-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingId(isOpen ? null : item.id)} className="flex-1 text-left">
                <p className="font-medium text-foreground">{item[fields[0].key] || '(untitled)'}</p>
                {fields[1] && <p className="text-xs text-muted-foreground truncate">{String(item[fields[1].key] ?? '')}</p>}
              </button>
              {reorderable && (
                <>
                  <Button size="icon" variant="ghost" onClick={() => move(idx, -1)} disabled={idx === 0}><ChevronUp className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => move(idx, 1)} disabled={idx === items.length - 1}><ChevronDown className="w-4 h-4" /></Button>
                </>
              )}
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(item.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
            {isOpen && (
              <div className="grid sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                {fields.map(f => (
                  <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <Textarea value={item[f.key] ?? ''} onChange={e => update(item.id, f.key, e.target.value)} rows={3} />
                    ) : f.type === 'switch' ? (
                      <Switch checked={!!item[f.key]} onCheckedChange={v => update(item.id, f.key, v)} />
                    ) : f.type === 'number' ? (
                      <Input type="number" value={item[f.key] ?? 0} onChange={e => update(item.id, f.key, Number(e.target.value))} />
                    ) : (
                      <Input value={item[f.key] ?? ''} placeholder={f.placeholder} onChange={e => update(item.id, f.key, e.target.value)} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
      <Button variant="outline" onClick={add} className="w-full">+ {addLabel}</Button>
    </div>
  );
}
