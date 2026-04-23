import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sprout, BookOpen, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Stat { icon: typeof Sprout; label: string; value: number; suffix: string; }

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

interface Props { nights: number; onClose?: () => void; }

export function ImpactReceipt({ nights, onClose }: Props) {
  const stats: Stat[] = [
    { icon: BookOpen, label: 'Days of school lunches', value: nights * 2, suffix: '' },
    { icon: Sprout,   label: 'Trees planted',          value: Math.max(1, Math.floor(nights / 2)), suffix: '' },
    { icon: Heart,    label: 'Local artisans supported', value: Math.max(1, Math.floor(nights / 3)), suffix: '' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-elevated max-w-md"
    >
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🌱</div>
        <h3 className="font-display text-2xl font-bold text-foreground">Your impact receipt</h3>
        <p className="text-sm text-muted-foreground">Thanks for choosing community tourism.</p>
      </div>

      <div className="space-y-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <s.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-display font-bold text-foreground">
                <Counter to={s.value} />{s.suffix}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => { navigator.clipboard?.writeText('I just booked a community homestay in Nepal!'); toast.success('Shared text copied!'); }}
        >
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
        {onClose && <Button onClick={onClose} className="flex-1">Done</Button>}
      </div>
    </motion.div>
  );
}
