import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCMS } from '@/contexts/CMSContext';

const Experiences = () => {
  const { content } = useCMS();
  const experiences = content.experiences;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Unique Experiences
            </h1>
            <p className="text-lg text-muted-foreground">
              Immerse yourself in Nepali culture with activities hosted by locals
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-container py-12">
        {experiences.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No experiences listed yet.</p>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow group"
            >
              <div className="h-48 overflow-hidden bg-muted">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-primary uppercase tracking-wider font-medium">{exp.category}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-1">{exp.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">Hosted by {exp.host}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exp.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground font-semibold">
                    NPR {exp.price.toLocaleString()} <span className="text-muted-foreground font-normal text-sm">/ person</span>
                  </p>
                  <Button variant="outline" size="sm" className="group/btn">
                    Book
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Experiences;
