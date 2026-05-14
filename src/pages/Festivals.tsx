import { motion } from 'framer-motion';
import { Calendar, MapPin, Star } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCMS } from '@/contexts/CMSContext';

const monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Festivals() {
  const { content } = useCMS();
  const festivals = content.festivals;

  const grouped = monthOrder.map(m => ({ month: m, items: festivals.filter(f => f.month === m) })).filter(g => g.items.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Cultural Calendar</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Festivals of Nepal
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Time your visit with one of Nepal's vibrant festivals to experience the country at its most alive.
            </p>
          </motion.div>

          {grouped.length === 0 && <p className="text-center text-muted-foreground">No festivals listed yet.</p>}

          <div className="space-y-10">
            {grouped.map(({ month, items }) => (
              <motion.section
                key={month}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {month}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(f => (
                    <div key={f.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-soft transition-shadow">
                      <div className="aspect-[16/10] bg-muted overflow-hidden">
                        <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-display text-xl font-bold text-foreground">{f.name}</h3>
                          {f.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground flex items-center gap-1"><Star className="w-3 h-3" />Featured</span>}
                        </div>
                        <p className="text-xs text-primary mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{f.region}</p>
                        <p className="text-sm text-foreground/80">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
