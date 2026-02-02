import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Star, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BookingCardProps {
  pricePerNight: number;
  rating: number;
  reviews: number;
  maxGuests: number;
}

export function BookingCard({ pricePerNight, rating, reviews, maxGuests }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const subtotal = nights * pricePerNight;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }
    toast.success('Booking request sent! The host will confirm shortly.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-24 bg-card rounded-2xl border border-border shadow-elevated p-6"
    >
      {/* Price and Rating */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold text-foreground">
            NPR {pricePerNight.toLocaleString()}
          </span>
          <span className="text-muted-foreground"> /night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">({reviews})</span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-foreground outline-none text-sm mt-1"
            />
          </div>
          <div className="p-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              className="w-full bg-transparent text-foreground outline-none text-sm mt-1"
            />
          </div>
        </div>
        
        {/* Guest Picker */}
        <div className="border-t border-border">
          <button
            onClick={() => setShowGuestPicker(!showGuestPicker)}
            className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
                Guests
              </label>
              <span className="text-sm text-foreground">{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
            {showGuestPicker ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {showGuestPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground">Adults</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    disabled={guests <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{guests}</span>
                  <button
                    onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    disabled={guests >= maxGuests}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Maximum {maxGuests} guests
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Book Button */}
      <Button
        onClick={handleBooking}
        className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
      >
        Reserve Now
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-3">
        You won't be charged yet
      </p>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex justify-between text-foreground">
            <span className="underline">
              NPR {pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
            </span>
            <span>NPR {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span className="underline">Service fee</span>
            <span>NPR {serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground pt-3 border-t border-border">
            <span>Total</span>
            <span>NPR {total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="w-4 h-4 text-secondary" />
          <span>Free cancellation for 48 hours</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="w-4 h-4 text-secondary" />
          <span>Verified homestay host</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="w-4 h-4 text-secondary" />
          <span>Secure payment process</span>
        </div>
      </div>
    </motion.div>
  );
}
