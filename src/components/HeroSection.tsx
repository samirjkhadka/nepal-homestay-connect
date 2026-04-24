import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, MapPin, Users, User, Eye, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllHomestays } from '@/data/homestays';

const topHomestays = getAllHomestays()
  .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
  .slice(0, 4);


export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topHomestays.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % topHomestays.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + topHomestays.length) % topHomestays.length);
  const homestay = topHomestays[currentSlide];

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] md:max-h-none md:h-screen overflow-hidden">
      {/* Background Images with Ken-Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={homestay.images[0]}
            alt={homestay.name}
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Mountain silhouette at the bottom for depth */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-24 md:h-32 z-[5] pointer-events-none"
        aria-hidden
      >
        <path
          d="M0,200 L0,140 L120,80 L240,120 L360,40 L480,100 L600,30 L720,90 L840,50 L960,110 L1080,60 L1200,100 L1320,40 L1440,90 L1440,200 Z"
          fill="hsl(0 0% 0% / 0.55)"
        />
        <path
          d="M0,200 L0,170 L120,130 L240,160 L360,110 L480,150 L600,100 L720,140 L840,115 L960,155 L1080,120 L1200,150 L1320,105 L1440,140 L1440,200 Z"
          fill="hsl(0 0% 0% / 0.75)"
        />
      </svg>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-white/70 hidden md:flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest"
      >
        Scroll
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-8 md:pb-12">
        <div className="section-container w-full space-y-6 md:space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Top badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-semibold">{homestay.rating}</span>
                  <span className="text-white/60 text-xs">({homestay.reviews})</span>
                </div>
                {homestay.host.isSuperhost && (
                  <span className="text-xs bg-accent/90 text-accent-foreground px-3 py-1 rounded-full font-semibold">
                    ★ Superhost
                  </span>
                )}
                <span className="text-xs bg-secondary/80 text-secondary-foreground px-3 py-1 rounded-full font-medium">
                  {homestay.province}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 md:mb-3 leading-tight text-shadow-hero">
                {homestay.name}
              </h1>

              {/* Location & details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/80 mb-3 md:mb-4">
                <span className="flex items-center gap-1.5 text-sm md:text-base">
                  <MapPin className="w-4 h-4" />
                  {homestay.location}
                </span>
                <span className="hidden sm:inline text-white/40">•</span>
                <span className="flex items-center gap-1.5 text-sm md:text-base">
                  <Users className="w-4 h-4" />
                  {homestay.maxGuests} guests · {homestay.bedrooms} bed · {homestay.bathrooms} bath
                </span>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-white/70 mb-4 md:mb-5 max-w-xl line-clamp-2">
                {homestay.description}
              </p>

              {/* Host + Price + CTA row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Host */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{homestay.host.name}</p>
                    <p className="text-white/50 text-xs">Hosting since {homestay.host.since}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-white/20" />

                {/* Price */}
                <div>
                  <span className="text-white text-xl md:text-2xl font-bold">
                    NPR {homestay.pricePerNight.toLocaleString()}
                  </span>
                  <span className="text-white/50 text-sm"> / night</span>
                </div>

                {/* CTA */}
                <Link
                  to={`/homestay/${homestay.id}`}
                  className="btn-cta inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-warm text-primary-foreground rounded-xl font-semibold text-sm md:text-base shadow-lg sm:ml-auto tap-target"
                >
                  <Eye className="w-4 h-4" />
                  View & Book
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>


          {/* Bottom row: indicators */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {topHomestays.map((h, index) => (
                <button
                  key={h.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full h-2 ${
                    index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
