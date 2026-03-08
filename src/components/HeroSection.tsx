import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, MapPin, Users, Search, Calendar, User, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllHomestays } from '@/data/homestays';

const topHomestays = getAllHomestays()
  .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
  .slice(0, 4);

function HeroSearch() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (guests) params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 md:p-3">
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          {/* Location */}
          <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
            <MapPin className="w-5 h-5 text-white/70 shrink-0" />
            <input
              type="text"
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-white placeholder:text-white/50 text-sm w-full outline-none"
            />
          </div>

          {/* Date */}
          <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
            <Calendar className="w-5 h-5 text-white/70 shrink-0" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent text-white text-sm w-full outline-none [color-scheme:dark]"
            />
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 md:w-32">
            <Users className="w-5 h-5 text-white/70 shrink-0" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="bg-transparent text-white text-sm w-full outline-none appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n} className="text-foreground bg-card">
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 font-semibold transition-all hover:scale-[1.02] shrink-0"
          >
            <Search className="w-5 h-5" />
            <span className="md:hidden lg:inline">Search</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

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
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={homestay.images[0]}
            alt={homestay.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

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
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 md:mb-3 leading-tight drop-shadow-lg">
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
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm md:text-base hover:bg-primary/90 transition-all hover:scale-105 shadow-lg sm:ml-auto"
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
