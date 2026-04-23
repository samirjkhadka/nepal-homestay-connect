import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { homestaysData } from '@/data/homestays';
import { getBadgesFor } from '@/data/communityMock';
import { ExperienceBadges } from './ExperienceBadges';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CompareWidget() {
  const { ids, open, setOpen, toggle, clear } = useCompare();
  const { format } = useCurrency();
  const items = ids.map(id => homestaysData[id]).filter(Boolean);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {ids.length > 0 && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground rounded-full shadow-elevated px-5 py-3 flex items-center gap-2 font-semibold hover:bg-primary/90 transition-colors"
          >
            <Scale className="w-5 h-5" />
            Compare ({ids.length})
          </motion.button>
        )}
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center justify-between">
              <span>Compare homestays ({items.length}/4)</span>
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clear}>Clear all</Button>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Add homestays to compare them side by side.
            </p>
          ) : (
            <div className={`grid gap-4 ${items.length === 1 ? 'grid-cols-1' : items.length === 2 ? 'grid-cols-2' : items.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {items.map(h => (
                <div key={h.id} className="border border-border rounded-xl overflow-hidden bg-card flex flex-col">
                  <div className="relative aspect-video">
                    <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggle(h.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 hover:bg-card"
                      aria-label="Remove from compare"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2 text-sm flex-1 flex flex-col">
                    <h4 className="font-semibold text-foreground line-clamp-1">{h.name}</h4>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3" />{h.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="font-medium">{h.rating}</span>
                      <span className="text-muted-foreground">({h.reviews})</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {h.maxGuests} guests · {h.bedrooms} bed · {h.bathrooms} bath
                    </div>
                    <ExperienceBadges badges={getBadgesFor(h.id)} />
                    <div className="mt-auto pt-2">
                      <div className="font-semibold text-primary">{format(h.pricePerNight)}<span className="text-xs text-muted-foreground font-normal">/night</span></div>
                      <Link to={`/homestay/${h.id}`} onClick={() => setOpen(false)}>
                        <Button size="sm" variant="outline" className="w-full mt-2">View</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
