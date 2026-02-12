import { motion } from 'framer-motion';
import { Home, Users, MapPin, Star } from 'lucide-react';

const stats = [
  { icon: Home, value: '500+', label: 'Homestays Listed', description: 'Authentic stays across Nepal' },
  { icon: Users, value: '50,000+', label: 'Happy Guests', description: 'Travelers served worldwide' },
  { icon: MapPin, value: '75+', label: 'Destinations', description: 'Districts covered nationwide' },
  { icon: Star, value: '4.8', label: 'Average Rating', description: 'From verified guest reviews' },
];

export function ImpactSection() {
  return (
    <section className="py-20 bg-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our Impact</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
            Transforming Communities Through Tourism
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Every booking supports local families and preserves Nepal's rich cultural heritage.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="font-semibold text-foreground text-sm mb-1">{stat.label}</div>
              <div className="text-muted-foreground text-xs">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
