import { motion } from 'framer-motion';
import {
  Wifi,
  Car,
  Utensils,
  Mountain,
  Droplets,
  Flame,
  Shirt,
  Coffee,
  TreePine,
  Home,
  Users,
  BedDouble,
  Bath,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react';

const allAmenities = {
  wifi: { icon: Wifi, label: 'Free WiFi' },
  parking: { icon: Car, label: 'Free Parking' },
  meals: { icon: Utensils, label: 'Home-cooked Meals' },
  mountainView: { icon: Mountain, label: 'Mountain View' },
  hotWater: { icon: Droplets, label: 'Hot Water' },
  heating: { icon: Flame, label: 'Room Heating' },
  laundry: { icon: Shirt, label: 'Laundry Service' },
  breakfast: { icon: Coffee, label: 'Breakfast Included' },
  garden: { icon: TreePine, label: 'Garden Access' },
  kitchen: { icon: Home, label: 'Shared Kitchen' },
  familyFriendly: { icon: Users, label: 'Family Friendly' },
  bedroom: { icon: BedDouble, label: 'Private Bedroom' },
  bathroom: { icon: Bath, label: 'Attached Bathroom' },
  cleaning: { icon: Sparkles, label: 'Daily Cleaning' },
  terrace: { icon: Sun, label: 'Sun Terrace' },
  ventilation: { icon: Wind, label: 'Good Ventilation' },
};

interface AmenitiesListProps {
  amenities: (keyof typeof allAmenities)[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  return (
    <div className="py-8 border-t border-border">
      <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
        What this place offers
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenityKey, index) => {
          const amenity = allAmenities[amenityKey];
          if (!amenity) return null;
          
          return (
            <motion.div
              key={amenityKey}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <amenity.icon className="w-5 h-5 text-primary" />
              <span className="text-foreground">{amenity.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export { allAmenities };
