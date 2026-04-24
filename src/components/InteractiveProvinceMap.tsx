import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface Province {
  id: number;
  name: string;
  homestays: number;
  signature: string;
  bestSeason: string;
  // Polygon path approximating each province on a 900x500 map of Nepal.
  // Coordinates are designed so the union resembles Nepal's actual outline
  // (wider in the middle, narrower & taller at the western & eastern ends).
  path: string;
  // Centroid for label & marker placement.
  cx: number;
  cy: number;
}

// Province polygons — hand-tuned to approximate Nepal's real shape and
// the relative positions of its 7 federal provinces (west → east).
// Outline is the union of all 7 paths.
const provinces: Province[] = [
  {
    id: 7, name: 'Sudurpashchim', homestays: 35,
    signature: 'Khaptad National Park', bestSeason: 'Oct – May',
    path: 'M 60,180 L 130,120 L 175,135 L 175,235 L 145,275 L 90,265 L 55,235 Z',
    cx: 115, cy: 200,
  },
  {
    id: 6, name: 'Karnali', homestays: 28,
    signature: 'Rara Lake & Dolpo', bestSeason: 'Apr – Oct',
    path: 'M 175,135 L 295,105 L 340,140 L 320,235 L 230,260 L 175,235 Z',
    cx: 250, cy: 175,
  },
  {
    id: 5, name: 'Lumbini', homestays: 56,
    signature: 'Birthplace of Buddha', bestSeason: 'Oct – Mar',
    path: 'M 175,235 L 230,260 L 320,235 L 360,275 L 340,330 L 240,335 L 145,275 Z',
    cx: 255, cy: 290,
  },
  {
    id: 4, name: 'Gandaki', homestays: 120,
    signature: 'Annapurna & Pokhara', bestSeason: 'Sep – May',
    path: 'M 320,235 L 340,140 L 460,125 L 510,170 L 490,250 L 410,275 L 360,275 Z',
    cx: 420, cy: 200,
  },
  {
    id: 3, name: 'Bagmati', homestays: 89,
    signature: 'Kathmandu Valley', bestSeason: 'Oct – Apr',
    path: 'M 410,275 L 490,250 L 560,180 L 620,200 L 615,290 L 540,330 L 460,320 L 360,275 Z',
    cx: 510, cy: 270,
  },
  {
    id: 2, name: 'Madhesh', homestays: 32,
    signature: 'Janakpur & plains', bestSeason: 'Oct – Mar',
    path: 'M 360,275 L 460,320 L 540,330 L 555,375 L 470,385 L 380,365 L 340,330 Z',
    cx: 455, cy: 345,
  },
  {
    id: 1, name: 'Koshi', homestays: 45,
    signature: 'Everest & Ilam tea', bestSeason: 'Oct – May',
    path: 'M 560,180 L 700,160 L 820,200 L 840,275 L 770,335 L 670,355 L 555,375 L 540,330 L 615,290 L 620,200 Z',
    cx: 710, cy: 260,
  },
];

const minStays = Math.min(...provinces.map(p => p.homestays));
const maxStays = Math.max(...provinces.map(p => p.homestays));

// Fill intensity scaled by homestay count (choropleth).
function fillFor(p: Province, isActive: boolean) {
  if (isActive) return 'hsl(var(--primary))';
  const t = (p.homestays - minStays) / (maxStays - minStays); // 0..1
  // opacity 0.18 (low) → 0.65 (high) on terracotta
  const opacity = 0.18 + t * 0.47;
  return `hsl(var(--primary) / ${opacity.toFixed(2)})`;
}

export function InteractiveProvinceMap() {
  const [active, setActive] = useState<Province | null>(provinces[3]); // default to Gandaki

  return (
    <section className="py-16 md:py-24 bg-muted/40 pattern-overlay">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Explore by Region</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4 tracking-tight">
            The Map of Nepal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hover or tap any of Nepal's seven federal provinces to discover its homestays,
            signature experience, and best season to visit.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Map */}
          <div className="relative bg-card border border-border rounded-2xl p-4 md:p-6 shadow-soft">
            <svg
              viewBox="0 0 900 500"
              className="w-full h-auto"
              role="img"
              aria-label="Map of Nepal showing 7 provinces"
            >
              {/* Soft glow under map */}
              <defs>
                <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                  <feOffset dx="0" dy="4" result="off" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.25" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <pattern id="map-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.15" />
                </pattern>
              </defs>

              {/* Subtle background hatch behind map */}
              <rect x="0" y="0" width="900" height="500" fill="url(#map-hatch)" opacity="0.4" />

              {/* Province polygons */}
              <g filter="url(#map-shadow)">
                {provinces.map(p => {
                  const isActive = active?.id === p.id;
                  return (
                    <path
                      key={p.id}
                      d={p.path}
                      fill={fillFor(p, isActive)}
                      stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--card))'}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      onMouseEnter={() => setActive(p)}
                      onClick={() => setActive(p)}
                      className="cursor-pointer transition-all duration-200 hover:brightness-110 focus-visible:outline-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${p.name} province, ${p.homestays} homestays`}
                    />
                  );
                })}
              </g>

              {/* Province labels */}
              {provinces.map(p => {
                const isActive = active?.id === p.id;
                return (
                  <g key={`lbl-${p.id}`} className="pointer-events-none">
                    <text
                      x={p.cx} y={p.cy - 4}
                      textAnchor="middle"
                      className={isActive ? 'fill-primary-foreground' : 'fill-foreground'}
                      style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}
                    >
                      {p.name}
                    </text>
                    <text
                      x={p.cx} y={p.cy + 14}
                      textAnchor="middle"
                      className={isActive ? 'fill-primary-foreground/80' : 'fill-muted-foreground'}
                      style={{ fontSize: 11, fontWeight: 500 }}
                    >
                      {p.homestays} stays
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Fewer homestays</span>
                <span className="inline-flex h-2.5 w-32 rounded-full overflow-hidden border border-border">
                  <span className="flex-1" style={{ background: 'hsl(var(--primary) / 0.18)' }} />
                  <span className="flex-1" style={{ background: 'hsl(var(--primary) / 0.32)' }} />
                  <span className="flex-1" style={{ background: 'hsl(var(--primary) / 0.46)' }} />
                  <span className="flex-1" style={{ background: 'hsl(var(--primary) / 0.65)' }} />
                </span>
                <span>More homestays</span>
              </div>
              <span className="hidden sm:inline">7 provinces · {provinces.reduce((s, p) => s + p.homestays, 0)} total stays</span>
            </div>
          </div>

          {/* Info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id ?? 'idle'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft sticky top-24"
            >
              {active ? (
                <>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4" /> {active.name} Province
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground mb-4 tracking-tight">
                    {active.homestays}
                    <span className="text-base font-normal text-muted-foreground"> homestays</span>
                  </p>
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
                <p className="text-muted-foreground text-sm">
                  Hover or tap a region on the map to see homestay counts and the best time to visit.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
