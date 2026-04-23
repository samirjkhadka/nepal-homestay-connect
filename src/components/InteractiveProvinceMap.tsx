import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface Province {
  id: number;
  name: string;
  homestays: number;
  signature: string;
  bestSeason: string;
  // approximate rough position on a 600x400 svg of Nepal (left to right, west→east)
  cx: number;
  cy: number;
}

const provinces: Province[] = [
  { id: 7, name: 'Sudurpashchim',  homestays: 35,  signature: 'Khaptad National Park', bestSeason: 'Oct – May', cx: 80,  cy: 170 },
  { id: 6, name: 'Karnali',        homestays: 28,  signature: 'Rara Lake & Dolpo',     bestSeason: 'Apr – Oct', cx: 160, cy: 130 },
  { id: 5, name: 'Lumbini',        homestays: 56,  signature: 'Birthplace of Buddha',  bestSeason: 'Oct – Mar', cx: 220, cy: 230 },
  { id: 4, name: 'Gandaki',        homestays: 120, signature: 'Annapurna & Pokhara',   bestSeason: 'Sep – May', cx: 290, cy: 175 },
  { id: 3, name: 'Bagmati',        homestays: 89,  signature: 'Kathmandu Valley',      bestSeason: 'Oct – Apr', cx: 370, cy: 195 },
  { id: 2, name: 'Madhesh',        homestays: 32,  signature: 'Janakpur & plains',     bestSeason: 'Oct – Mar', cx: 415, cy: 260 },
  { id: 1, name: 'Koshi',          homestays: 45,  signature: 'Everest & Ilam tea',    bestSeason: 'Oct – May', cx: 510, cy: 175 },
];

export function InteractiveProvinceMap() {
  const [active, setActive] = useState<Province | null>(null);

  return (
    <section className="py-20 bg-muted/40 pattern-overlay">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Explore by Region</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Hover the map to discover provinces
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each of Nepal's seven provinces offers a different slice of culture, climate, and cuisine.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-center">
          {/* Map */}
          <div className="relative bg-card border border-border rounded-2xl p-6 shadow-soft">
            <svg viewBox="0 0 600 400" className="w-full h-auto">
              {/* Stylized Nepal shape (decorative) */}
              <path
                d="M40 200 Q 80 110 180 100 Q 280 90 360 130 Q 460 140 560 180 Q 580 230 520 290 Q 420 320 320 300 Q 220 310 140 290 Q 60 280 40 200 Z"
                fill="hsl(var(--muted))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              {provinces.map(p => (
                <g
                  key={p.id}
                  onMouseEnter={() => setActive(p)}
                  onClick={() => setActive(p)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={p.cx} cy={p.cy}
                    r={active?.id === p.id ? 18 : 12}
                    fill={active?.id === p.id ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
                    className="transition-all"
                    opacity={0.85}
                  />
                  <text
                    x={p.cx} y={p.cy + 30}
                    textAnchor="middle"
                    className="fill-foreground"
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    {p.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id ?? 'idle'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              {active ? (
                <>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4" /> {active.name} Province
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground mb-4">{active.homestays}<span className="text-base font-normal text-muted-foreground"> homestays</span></p>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">Signature</dt>
                      <dd className="text-foreground">{active.signature}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">Best season</dt>
                      <dd className="text-foreground">{active.bestSeason}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">Hover or tap a region on the map to see homestay counts and the best time to visit.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
