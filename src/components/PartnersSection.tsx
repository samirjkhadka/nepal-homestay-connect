import { motion } from 'framer-motion';
import { CreditCard, Plane, PartyPopper, Building2, Handshake } from 'lucide-react';
import { useCMS } from '@/contexts/CMSContext';

const ICON_MAP: Record<string, any> = {
  CreditCard, Plane, PartyPopper, Building2, Handshake,
};

export function PartnersSection() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
      
      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Handshake className="w-4 h-4" />
            Our Partners
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Powered by Trusted Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading payment providers, tour operators, event organizers and
            community organizations to bring you authentic, safe and seamless experiences.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {partnerCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {category.partners.map((partner) => (
                    <motion.div
                      key={partner.name}
                      whileHover={{ y: -3 }}
                      className="relative bg-background border border-border rounded-xl p-3 text-center transition-all hover:shadow-md group/partner overflow-hidden"
                    >
                      {/* Gradient border accent on hover */}
                      <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-warm opacity-0 group-hover/partner:opacity-100 transition-opacity" />
                      <div className="font-display font-semibold text-sm text-foreground truncate">
                        {partner.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">
                        {partner.tag}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm">
            Interested in partnering with us?{' '}
            <a href="/contact" className="text-primary font-semibold hover:underline">
              Get in touch →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
