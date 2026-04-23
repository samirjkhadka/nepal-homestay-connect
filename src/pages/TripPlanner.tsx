import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, X, Route, Share2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { homestaysData } from '@/data/homestays';
import { tripRoutes } from '@/data/communityMock';
import { toast } from 'sonner';

export default function TripPlanner() {
  const all = Object.values(homestaysData);
  const [stops, setStops] = useState<string[]>([]);
  const [picker, setPicker] = useState(false);

  const add = (id: string) => {
    if (stops.includes(id)) return;
    setStops(s => [...s, id]);
    setPicker(false);
  };

  const remove = (id: string) => setStops(s => s.filter(x => x !== id));
  const move = (i: number, dir: -1 | 1) => {
    setStops(s => {
      const next = [...s];
      const j = i + dir;
      if (j < 0 || j >= next.length) return s;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Trip Planner</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Build your homestay journey
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chain multiple homestays into a multi-stop trip. Inspired by community routes across Nepal.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Builder */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Route className="w-5 h-5 text-primary" /> Your itinerary
                </h3>

                {stops.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-6 text-center">
                    Add stops below to start building your trip.
                  </p>
                ) : (
                  <ol className="space-y-3 mb-4">
                    {stops.map((id, i) => {
                      const h = homestaysData[id];
                      return (
                        <li key={id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {i + 1}
                          </div>
                          <img src={h.images[0]} alt={h.name} className="w-14 h-14 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{h.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{h.location}, {h.province}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 disabled:opacity-30 hover:bg-muted rounded">↑</button>
                            <button onClick={() => move(i, 1)} disabled={i === stops.length - 1} className="p-1 disabled:opacity-30 hover:bg-muted rounded">↓</button>
                            <button onClick={() => remove(id)} className="p-1 hover:bg-muted rounded text-destructive" aria-label="Remove">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}

                {!picker ? (
                  <Button variant="outline" onClick={() => setPicker(true)} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add a homestay
                  </Button>
                ) : (
                  <div className="border border-border rounded-xl p-3 max-h-72 overflow-y-auto space-y-2">
                    {all.filter(h => !stops.includes(h.id)).map(h => (
                      <button
                        key={h.id}
                        onClick={() => add(h.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted text-left"
                      >
                        <img src={h.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{h.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{h.location}</p>
                        </div>
                      </button>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => setPicker(false)} className="w-full">Cancel</Button>
                  </div>
                )}

                {stops.length > 1 && (
                  <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approx. trip length</p>
                      <p className="font-display text-xl font-bold text-foreground">
                        {stops.length * 2} – {stops.length * 4} days
                      </p>
                    </div>
                    <Button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Trip link copied!'); }}>
                      <Share2 className="w-4 h-4 mr-2" /> Share trip
                    </Button>
                  </div>
                )}
              </div>

              {/* Route map placeholder */}
              <div className="bg-muted/40 border border-dashed border-border rounded-2xl p-10 text-center">
                <Map className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Route map preview</p>
                <p className="text-xs text-muted-foreground mt-1">Connect a map provider to render the route between your stops.</p>
              </div>
            </div>

            {/* Suggested routes */}
            <aside>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Suggested routes</h3>
              <div className="space-y-3">
                {tripRoutes.map(r => (
                  <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{r.emoji}</span>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{r.name}</h4>
                        <p className="text-xs text-primary">{r.days} days</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{r.description}</p>
                    <p className="text-xs text-foreground/70">
                      <span className="font-medium">Stops:</span> {r.stops.join(' → ')}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
