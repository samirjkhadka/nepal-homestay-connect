import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Compass, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomestayStore } from '@/contexts/HomestayStoreContext';
import { useCMS } from '@/contexts/CMSContext';
import heroImage from '@/assets/hero-1.jpg';

const regions = ['Everest', 'Annapurna', 'Kathmandu Valley', 'Chitwan', 'Lumbini', 'Mustang'];
const SLIDE_MS = 6000;

export function HeroSection() {
  const { publicHomestays } = useHomestayStore();
  const { content } = useCMS();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const featured = useMemo(
    () => [...publicHomestays].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 4),
    [publicHomestays],
  );

  // Slide 0 renders immediately from the bundled local image; remote slides
  // only load when they become "next", so first paint is never blocked.
  const slides = useMemo(
    () => [
      { id: 'hero-static', image: heroImage, name: null as string | null, location: '', rating: 0, price: 0, link: null as string | null },
      ...featured.map((h) => ({
        id: h.id, image: h.images[0], name: h.name, location: h.location,
        rating: h.rating, price: h.pricePerNight, link: `/homestay/${h.id}`,
      })),
    ],
    [featured],
  );

  const total = slides.length;

  // Preload only the NEXT slide, one at a time.
  useEffect(() => {
    const next = slides[(current + 1) % total];
    if (next) {
      const img = new Image();
      img.src = next.image;
    }
  }, [current, slides, total]);

  useEffect(() => {
    if (paused || total < 2) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, total]);

  const slide = slides[current];

  return (
    <section
      className="relative min-h-[88vh] flex items-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Crossfade background stack — no layout swaps, images fade over each other */}
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.id}
          src={slide.image}
          alt={slide.name ?? 'Traditional Nepali village homestay beneath the Himalayas'}
          loading={current === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={current === 0 ? 'high' : 'auto'}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
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
        </div>
      </div>

      {/* Bottom-right: slide caption + dot progress, minimal */}
      {total > 1 && (
        <div className="absolute bottom-6 right-6 z-10 hidden md:flex flex-col items-end gap-3">
          <AnimatePresence mode="wait">
            {slide.name && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <Link
                  to={slide.link!}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{slide.name}</p>
                    <p className="text-white/70 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {slide.location}
                      <span className="mx-1">·</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {slide.rating}
                      <span className="mx-1">·</span> NPR {slide.price.toLocaleString()}/night
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1.5 pr-1">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group p-1"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 group-hover:bg-white/70'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
