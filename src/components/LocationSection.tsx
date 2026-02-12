import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationSectionProps {
  location: string;
  province: string;
  coordinates: { lat: number; lng: number };
}

export function LocationSection({ location, province, coordinates }: LocationSectionProps) {
  const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.02},${coordinates.lat - 0.015},${coordinates.lng + 0.02},${coordinates.lat + 0.015}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
        Location & Directions
      </h3>
      <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
        <MapPin className="w-4 h-4" />
        <span>{location}, {province}</span>
      </div>

      {/* Map Embed */}
      <div className="rounded-2xl overflow-hidden border border-border mb-4 aspect-[16/9]">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          loading="lazy"
          title={`Map of ${location}`}
          style={{ border: 0 }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="gap-2" asChild>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            View on Google Maps
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
