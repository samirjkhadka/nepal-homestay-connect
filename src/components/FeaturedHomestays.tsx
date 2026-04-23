import { motion } from 'framer-motion';
import { Star, MapPin, Heart, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedHomestays } from '@/data/homestays';
import { ExperienceBadges } from '@/components/ExperienceBadges';
import { getBadgesFor } from '@/data/communityMock';
import { useCompare } from '@/contexts/CompareContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturedHomestays() {
  const featuredHomestays = getFeaturedHomestays();
  const { has: inCompare, toggle: toggleCompare } = useCompare();
  const { collections, toggleInCollection, isSaved } = useWishlist();
  const { format } = useCurrency();
  const defaultCol = collections[0]?.id;

  return (
    <section className="py-20 bg-background">
      <div className="section-container">
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredHomestays.map((homestay, index) => {
            const badges = getBadgesFor(homestay.id);
            const saved = isSaved(homestay.id);
            const compareOn = inCompare(homestay.id);
            return (
              <motion.div
                key={homestay.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border"
              >
                <Link to={`/homestay/${homestay.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={homestay.images[0]}
                      alt={homestay.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {index === 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (defaultCol) {
                            toggleInCollection(defaultCol, homestay.id);
                            toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist');
                          }
                        }}
                        className="p-2 rounded-full bg-card/80 hover:bg-card transition-colors"
                        aria-label="Save to wishlist"
                      >
                        <Heart className={cn('w-4 h-4', saved ? 'text-primary fill-primary' : 'text-foreground')} />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); toggleCompare(homestay.id); }}
                        className={cn(
                          'p-2 rounded-full transition-colors',
                          compareOn ? 'bg-primary text-primary-foreground' : 'bg-card/80 hover:bg-card text-foreground',
                        )}
                        aria-label="Add to compare"
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    </div>
                    {badges.length > 0 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <ExperienceBadges badges={badges.slice(0, 4)} />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      {homestay.location}, {homestay.province}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {homestay.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-medium">{homestay.rating}</span>
                        <span className="text-muted-foreground text-sm">({homestay.reviews})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-primary">{format(homestay.pricePerNight)}</span>
                        <span className="text-muted-foreground text-sm">/night</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/search">
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
              View All Homestays
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
