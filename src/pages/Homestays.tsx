import { motion } from 'framer-motion';
import { Star, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { homestaysData } from '@/data/homestays';

const Homestays = () => {
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
              All Homestays
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our collection of verified homestays across Nepal
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(homestaysData).map((homestay, index) => (
            <motion.div
              key={homestay.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/homestay/${homestay.id}`} className="block group">
                <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all">
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={homestay.images[0]} 
                      alt={homestay.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {homestay.host.isSuperhost && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                        Superhost
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {homestay.name}
                      </h3>
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {homestay.rating}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4" />
                      {homestay.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        Up to {homestay.maxGuests} guests
                      </span>
                      <p className="text-foreground font-semibold">
                        Rs. {homestay.pricePerNight}<span className="text-muted-foreground font-normal text-sm">/night</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homestays;