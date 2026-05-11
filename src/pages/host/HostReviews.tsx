import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useHostData } from '@/contexts/HostDataContext';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function HostReviews() {
  const { data, update } = useHostData();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const reply = (id: string) => {
    update('reviews', data.reviews.map(r => r.id === id ? { ...r, reply: drafts[id] } : r));
    toast({ title: 'Reply posted' });
    setDrafts(d => ({ ...d, [id]: '' }));
  };

  const counts = [5, 4, 3, 2, 1].map(n => ({ n, c: data.reviews.filter(r => r.rating === n).length }));
  const total = data.reviews.length;
  const avg = total ? data.reviews.reduce((s, r) => s + r.rating, 0) / total : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews & Ratings</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} reviews · avg {avg.toFixed(1)}</p>
      </div>

      <Card className="p-5">
        <div className="grid sm:grid-cols-[120px_1fr] gap-6 items-center">
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{avg.toFixed(1)}</p>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map(n => <Star key={n} className={`w-4 h-4 ${n <= avg ? 'fill-accent text-accent' : 'text-muted'}`} />)}
            </div>
          </div>
          <div className="space-y-1">
            {counts.map(({ n, c }) => (
              <div key={n} className="flex items-center gap-2 text-xs">
                <span className="w-4">{n}★</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: total ? `${(c / total) * 100}%` : 0 }} />
                </div>
                <span className="w-6 text-right text-muted-foreground">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {data.reviews.map(r => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{r.author}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <span className="text-sm flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" />{r.rating}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
            {r.reply ? (
              <div className="mt-3 pl-4 border-l-2 border-primary">
                <p className="text-xs font-medium text-primary">Your reply</p>
                <p className="text-sm text-foreground">{r.reply}</p>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Textarea rows={2} placeholder="Write a reply..." value={drafts[r.id] ?? ''} onChange={e => setDrafts(d => ({ ...d, [r.id]: e.target.value }))} />
                <Button size="sm" onClick={() => reply(r.id)} disabled={!drafts[r.id]}>Reply</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
