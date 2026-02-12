import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Homestay } from '@/data/homestays';

interface NearbyHomestaysProps {
  homestays: Homestay[];
}

export function NearbyHomestays({ homestays }: NearbyHomestaysProps) {
  if (homestays.length === 0) return null;

  return (
    <section className="pt-12 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
          Nearby Homestays
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homestays.map((stay, i) => (
            <motion.div
              key={stay.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/homestay/${stay.id}`}
                className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={stay.images[0]}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {stay.host.isSuperhost && (
                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground text-xs">
                      Superhost
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-foreground truncate">{stay.name}</h4>
                    <div className="flex items-center gap-1 text-sm flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span className="font-medium">{stay.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{stay.location}, {stay.province}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      NPR {stay.pricePerNight.toLocaleString()}
                      <span className="text-muted-foreground font-normal text-sm"> /night</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {stay.maxGuests}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
