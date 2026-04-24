import { motion } from 'framer-motion';
import { CreditCard, Plane, PartyPopper, Building2, Handshake } from 'lucide-react';

const partnerCategories = [
  {
    title: 'Payment Partners',
    icon: CreditCard,
    description: 'Secure payments across Nepal and worldwide',
    partners: [
      { name: 'eSewa', tag: 'Digital Wallet' },
      { name: 'Khalti', tag: 'Mobile Payment' },
      { name: 'IME Pay', tag: 'Wallet' },
      { name: 'Visa', tag: 'Card Network' },
      { name: 'Mastercard', tag: 'Card Network' },
      { name: 'Stripe', tag: 'Global Gateway' },
    ],
  },
  {
    title: 'Travel & Tours Partners',
    icon: Plane,
    description: 'Trusted operators for treks, transfers and tours',
    partners: [
      { name: 'Himalayan Glacier', tag: 'Trekking' },
      { name: 'Nepal Trekking Routes', tag: 'Adventure' },
      { name: 'Buddha Air', tag: 'Domestic Flights' },
      { name: 'Yeti Airlines', tag: 'Mountain Flights' },
      { name: 'Greenline Tours', tag: 'Transfers' },
      { name: 'Annapurna Treks', tag: 'Guided Tours' },
    ],
  },
  {
    title: 'Event Partners',
    icon: PartyPopper,
    description: 'Cultural festivals and community celebrations',
    partners: [
      { name: 'Nepal Tourism Board', tag: 'Official' },
      { name: 'Indra Jatra Committee', tag: 'Festival' },
      { name: 'Tihar Lights Fest', tag: 'Cultural' },
      { name: 'Himalayan Film Fest', tag: 'Arts' },
      { name: 'Kathmandu Jazz', tag: 'Music' },
      { name: 'Lhosar Society', tag: 'Heritage' },
    ],
  },
  {
    title: 'Community & NGO Partners',
    icon: Building2,
    description: 'Driving sustainable, women-led tourism',
    partners: [
      { name: 'HomeNet Nepal', tag: 'Women Empowerment' },
      { name: 'WWF Nepal', tag: 'Conservation' },
      { name: 'Sasane Sisterhood', tag: 'Anti-Trafficking' },
      { name: 'Mountain Trust', tag: 'Eco Tourism' },
    ],
  },
];

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
                      whileHover={{ y: -2 }}
                      className="bg-background border border-border rounded-xl p-3 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      <div className="font-semibold text-sm text-foreground truncate">
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
