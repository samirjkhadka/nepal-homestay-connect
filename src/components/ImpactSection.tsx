import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, Users, MapPin, Star } from 'lucide-react';

function useCountUp(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
}

function StatCard({ icon: Icon, value, suffix, label, description, delay }: {
  icon: any; value: number; suffix: string; label: string; description: string; delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(value, 2000, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm hover:shadow-md transition-shadow text-center group"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-semibold text-foreground text-sm mb-1">{label}</div>
      <div className="text-muted-foreground text-xs">{description}</div>
    </motion.div>
  );
}

const stats = [
  { icon: Home, value: 500, suffix: '+', label: 'Homestays Listed', description: 'Authentic stays across Nepal' },
  { icon: Users, value: 50000, suffix: '+', label: 'Happy Guests', description: 'Travelers served worldwide' },
  { icon: MapPin, value: 75, suffix: '+', label: 'Destinations', description: 'Districts covered nationwide' },
  { icon: Star, value: 4.8, suffix: '', label: 'Average Rating', description: 'From verified guest reviews' },
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
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
