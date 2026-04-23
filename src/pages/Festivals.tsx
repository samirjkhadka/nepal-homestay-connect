import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { festivals } from '@/data/communityMock';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Festivals() {
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

          <div className="space-y-10">
            {months.map((month, mi) => {
              const monthFestivals = festivals.filter(f => f.monthIndex === mi);
              if (!monthFestivals.length) return null;
              return (
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
                    {monthFestivals.map(f => (
                      <div key={f.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-soft transition-shadow">
                        <div className="text-4xl mb-3">{f.emoji}</div>
                        <h3 className="font-display text-xl font-bold text-foreground mb-1">{f.name}</h3>
                        <p className="text-xs text-primary mb-3">{f.region} · {f.duration}</p>
                        <p className="text-sm text-foreground/80">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
