import { motion } from 'framer-motion';
import { Star, MapPin, Heart } from 'lucide-react';
import homestay1 from '@/assets/homestay-1.jpg';
import homestay2 from '@/assets/homestay-2.jpg';
import homestay3 from '@/assets/homestay-3.jpg';
import homestay4 from '@/assets/homestay-4.jpg';

const featuredHomestays = [
  {
    id: 1,
    name: 'Mountain View Retreat',
    location: 'Pokhara, Gandaki',
    price: 2500,
    rating: 4.9,
    reviews: 128,
    image: homestay1,
    featured: true,
  },
  {
    id: 2,
    name: 'Traditional Gurung House',
    location: 'Ghandruk, Kaski',
    price: 1800,
    rating: 4.8,
    reviews: 95,
    image: homestay2,
  },
  {
    id: 3,
    name: 'Himalayan Eco Lodge',
    location: 'Nagarkot, Bhaktapur',
    price: 3200,
    rating: 4.9,
    reviews: 156,
    image: homestay3,
  },
  {
    id: 4,
    name: 'Tharu Cultural Homestay',
    location: 'Chitwan, Narayani',
    price: 1500,
    rating: 4.7,
    reviews: 87,
    image: homestay4,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturedHomestays() {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Handpicked for You
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Featured Homestays
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved homestays, carefully selected for their authentic experiences
            and warm hospitality
          </p>
        </motion.div>

        {/* Homestay Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredHomestays.map((homestay) => (
            <motion.div
              key={homestay.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {homestay.featured && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                    Featured
                  </div>
                )}
                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {homestay.location}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {homestay.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium">{homestay.rating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({homestay.reviews})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-primary">
                      NPR {homestay.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">/night</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
            View All Homestays
          </button>
        </motion.div>
      </div>
    </section>
  );
}
