import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { localExperiences } from '@/data/communityMock';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function LocalExperiences() {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const { format } = useCurrency();

  const update = (id: string, delta: number) =>
    setSelected(s => {
      const next = (s[id] || 0) + delta;
      const out = { ...s };
      if (next <= 0) delete out[id];
      else out[id] = next;
      return out;
    });

  const total = Object.entries(selected).reduce((sum, [id, qty]) => {
    const exp = localExperiences.find(e => e.id === id);
    return exp ? sum + exp.pricePerPerson * qty : sum;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-display text-2xl font-semibold text-foreground">Add local experiences</h3>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Hosted by your family and neighbours — every booking directly supports the community.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {localExperiences.map(exp => {
          const qty = selected[exp.id] || 0;
          return (
            <div key={exp.id} className="border border-border rounded-xl p-4 bg-card flex gap-3">
              <div className="text-3xl flex-shrink-0">{exp.emoji}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{exp.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{exp.duration} · {format(exp.pricePerPerson)} / person</p>
                <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{exp.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update(exp.id, -1)}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center disabled:opacity-40 hover:bg-muted"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{qty}</span>
                    <button
                      onClick={() => update(exp.id, 1)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {qty > 0 && (
                    <span className="text-sm font-semibold text-primary">
                      {format(exp.pricePerPerson * qty)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-xl"
        >
          <div>
            <p className="text-xs text-muted-foreground">Add-ons subtotal</p>
            <p className="text-xl font-display font-bold text-primary">{format(total)}</p>
          </div>
          <Button onClick={() => toast.success('Experiences added to your booking!')}>
            Add to booking
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
