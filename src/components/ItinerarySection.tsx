import { motion } from 'framer-motion';
import { Sunrise, UtensilsCrossed, Mountain, Music, TreePine, Camera, Footprints, BookOpen } from 'lucide-react';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  sunrise: <Sunrise className="w-5 h-5" />,
  food: <UtensilsCrossed className="w-5 h-5" />,
  mountain: <Mountain className="w-5 h-5" />,
  culture: <Music className="w-5 h-5" />,
  nature: <TreePine className="w-5 h-5" />,
  photo: <Camera className="w-5 h-5" />,
  hike: <Footprints className="w-5 h-5" />,
  learn: <BookOpen className="w-5 h-5" />,
};

export function ItinerarySection({ itinerary }: { itinerary: ItineraryItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
        What to expect
      </h3>
      <p className="text-muted-foreground mb-8">
        Here's a suggested day-by-day experience to make the most of your stay.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-6">
          {itinerary.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 pl-0"
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center text-primary">
                {iconMap[item.icon] || <Sunrise className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="flex-1 bg-muted/50 rounded-xl p-4 hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Day {item.day}
                  </span>
                </div>
                <h4 className="font-display font-semibold text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
