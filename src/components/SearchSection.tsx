import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Home, SlidersHorizontal, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'traditional', label: 'Traditional House' },
  { value: 'farmhouse', label: 'Farmhouse' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'villa', label: 'Villa' },
  { value: 'treehouse', label: 'Treehouse' },
];

export function SearchSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    if (guests) params.set('guests', guests);
    if (propertyType) params.set('type', propertyType);
    if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0]));
    if (priceRange[1] < 15000) params.set('maxPrice', String(priceRange[1]));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative z-30 mt-6 md:mt-10 mb-12 md:mb-16">
      {/* Decorative background */}
      <div className="absolute inset-0 -top-8 -bottom-8 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="search-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="hsl(var(--primary))" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#search-pattern)" />
        </svg>
      </div>

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-3xl shadow-floating border border-border overflow-hidden"
        >
          {/* Header strip */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 px-6 md:px-8 py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-foreground">Find Your Perfect Homestay</h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-5">
            {/* Main search row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/60 rounded-xl border border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              {/* Check-in */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Check-in
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "w-full px-4 py-3 bg-muted/60 rounded-xl border border-border/50 text-left text-sm transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none",
                      !checkIn && "text-muted-foreground"
                    )}>
                      {checkIn ? format(checkIn, 'PPP') : 'Select date'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Check-out
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "w-full px-4 py-3 bg-muted/60 rounded-xl border border-border/50 text-left text-sm transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none",
                      !checkOut && "text-muted-foreground"
                    )}>
                      {checkOut ? format(checkOut, 'PPP') : 'Select date'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < (checkIn || new Date())}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/60 rounded-xl border border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={String(n)}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expandable filters */}
            <motion.div
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-primary" />
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 bg-muted/60 rounded-xl border border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-primary" />
                    Price Range (NPR {priceRange[0].toLocaleString()} – {priceRange[1].toLocaleString()})
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={15000}
                      step={500}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 500), priceRange[1]])}
                      className="flex-1 accent-primary h-2"
                    />
                    <input
                      type="range"
                      min={0}
                      max={15000}
                      step={500}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 500)])}
                      className="flex-1 accent-primary h-2"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search button */}
            <div className="flex justify-center pt-1">
              <Button
                size="lg"
                onClick={handleSearch}
                className="px-10 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.03]"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Homestays
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
