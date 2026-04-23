import { motion } from 'framer-motion';
import { Users, Home, MapPin, Star } from 'lucide-react';

const stats = [
  { icon: Users, value: '10,000+', label: 'Travelers hosted' },
  { icon: Home,  value: '200+',    label: 'Verified hosts' },
  { icon: MapPin,value: '7',       label: 'Provinces covered' },
  { icon: Star,  value: '4.8',     label: 'Average rating' },
];

export function TrustStrip() {
  return (
    <section className="bg-muted/40 border-y border-border">
      <div className="section-container py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-foreground text-lg leading-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
