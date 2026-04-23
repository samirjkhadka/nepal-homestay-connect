import { motion } from 'framer-motion';
import { priceBreakdown } from '@/data/communityMock';
import { Heart } from 'lucide-react';

export function PriceTransparency() {
  // SVG donut chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="font-display text-2xl font-semibold text-foreground">Where your money goes</h3>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Transparency is core to community tourism. Here's exactly how every rupee is split.
      </p>

      <div className="grid sm:grid-cols-[180px_1fr] gap-8 items-center bg-muted/40 rounded-2xl p-6">
        <svg viewBox="0 0 160 160" className="w-40 h-40 mx-auto -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="20" />
          {priceBreakdown.map(s => {
            const length = (s.percent / 100) * circumference;
            const el = (
              <circle
                key={s.label}
                cx="80" cy="80" r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth="20"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
              />
            );
            offset += length;
            return el;
          })}
        </svg>
        <ul className="space-y-3">
          {priceBreakdown.map(s => (
            <li key={s.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="text-foreground font-medium">{s.label}</span>
              </div>
              <span className="font-display font-bold text-foreground">{s.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
