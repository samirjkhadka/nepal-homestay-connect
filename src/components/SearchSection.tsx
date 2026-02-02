import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchSection() {
  return (
    <section className="relative -mt-24 z-30 section-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-2xl shadow-floating p-6 md:p-8 border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Location
            </label>
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full px-4 py-3 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Check-in */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Check-in
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Check-out */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Check-out
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Guests
            </label>
            <select className="w-full px-4 py-3 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none transition-all">
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4+ Guests</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Homestays
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
