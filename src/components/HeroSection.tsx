import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Compass, Search, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomestayStore } from '@/contexts/HomestayStoreContext';
import { useCMS } from '@/contexts/CMSContext';
import heroImage from '@/assets/hero-1.jpg';

const regions = ['Everest', 'Annapurna', 'Kathmandu Valley', 'Chitwan', 'Lumbini', 'Mustang'];

export function HeroSection() {
  const { publicHomestays } = useHomestayStore();
  const { content } = useCMS();

  const featured = useMemo(
    () => [...publicHomestays].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 3),
    [publicHomestays],
  );

  return (
    <section className="relative min-h-[88vh] flex items-end overflow-hidden">
      {/* Static hero image — loads once, no carousel swapping */}
      <img
        src={heroImage}
        alt="Traditional Nepali village homestay beneath the Himalayas"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      <div className="relative z-10 w-full pt-28 pb-10 md:pb-14">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Community-verified stays across all 7 provinces
            </span>

            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-shadow-hero">
              {content.hero.headline}
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/80 max-w-xl">
              {content.hero.subheadline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/homestays"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3 bg-gradient-warm text-primary-foreground rounded-xl font-semibold shadow-lg tap-target"
              >
                <Search className="w-4 h-4" />
                {content.hero.ctaPrimary}
              </Link>
              <Link
                to="/trip-planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/20 transition-colors tap-target"
              >
                <Compass className="w-4 h-4" />
                {content.hero.ctaSecondary}
              </Link>
            </div>

            {/* Region quick links */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {regions.map((r) => (
                <Link
                  key={r}
                  to={`/search?location=${encodeURIComponent(r)}`}
                  className="whitespace-nowrap text-xs md:text-sm px-3 py-1.5 rounded-full border border-white/25 text-white/85 hover:bg-white/15 transition-colors"
                >
                  {r}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Featured stays strip — static, no autoplay */}
          {featured.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 grid sm:grid-cols-3 gap-3 max-w-4xl"
            >
              {featured.map((h) => (
                <Link
                  key={h.id}
                  to={`/homestay/${h.id}`}
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-colors"
                >
                  <img
                    src={h.images[0]}
                    alt={h.name}
                    loading="eager"
                    decoding="async"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{h.name}</p>
                    <p className="text-white/60 text-xs flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {h.location}
                    </p>
                    <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {h.rating} · NPR {h.pricePerNight.toLocaleString()}/night
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-white/60 hidden md:flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest"
      >
        Scroll
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
