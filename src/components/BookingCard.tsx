import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, Users, Star, ChevronDown, ChevronUp, Check, AlertCircle, CreditCard } from 'lucide-react';
import { format, differenceInDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getUnavailableDates } from '@/data/homestays';
import { useParams } from 'react-router-dom';

interface BookingCardProps {
  pricePerNight: number;
  rating: number;
  reviews: number;
  maxGuests: number;
}

export function BookingCard({ pricePerNight, rating, reviews, maxGuests }: BookingCardProps) {
  const { id } = useParams<{ id: string }>();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  // Get unavailable dates for this homestay
  const unavailableDates = useMemo(() => {
    if (!id) return [];
    return getUnavailableDates(id);
  }, [id]);

  // Check if a date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    // Past dates are unavailable
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
    // Check if date is in booked dates
    return unavailableDates.some(unavailable => isSameDay(date, unavailable));
  };

  // Check if selected range has any unavailable dates
  const hasUnavailableDatesInRange = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    const daysInRange = eachDayOfInterval({ start: checkIn, end: checkOut });
    return daysInRange.some(day => unavailableDates.some(unavailable => isSameDay(day, unavailable)));
  }, [checkIn, checkOut, unavailableDates]);

  const nights = checkIn && checkOut 
    ? differenceInDays(checkOut, checkIn)
    : 0;
  
  const subtotal = nights * pricePerNight;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckIn(date);
    setCheckInOpen(false);
    // Reset checkout if it's before the new check-in
    if (date && checkOut && checkOut <= date) {
      setCheckOut(undefined);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOut(date);
    setCheckOutOpen(false);
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }
    if (hasUnavailableDatesInRange) {
      toast.error('Some dates in your selection are unavailable');
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

      {/* Date Selection with Calendar */}
      <div className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Check-in Date Picker */}
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <button className="p-3 text-left hover:bg-muted/50 transition-colors w-full">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
                  Check-in
                </label>
                <div className={cn(
                  "text-sm mt-1 flex items-center gap-2",
                  !checkIn && "text-muted-foreground"
                )}>
                  <CalendarIcon className="w-4 h-4" />
                  {checkIn ? format(checkIn, "MMM d, yyyy") : "Select date"}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                disabled={isDateUnavailable}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="px-3 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-muted border" />
                  <span>Available</span>
                  <div className="w-3 h-3 rounded bg-muted-foreground/30 ml-2" />
                  <span>Unavailable</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Check-out Date Picker */}
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <button className="p-3 text-left hover:bg-muted/50 transition-colors w-full">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
                  Check-out
                </label>
                <div className={cn(
                  "text-sm mt-1 flex items-center gap-2",
                  !checkOut && "text-muted-foreground"
                )}>
                  <CalendarIcon className="w-4 h-4" />
                  {checkOut ? format(checkOut, "MMM d, yyyy") : "Select date"}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={handleCheckOutSelect}
                disabled={(date) => {
                  if (isDateUnavailable(date)) return true;
                  if (checkIn && date <= checkIn) return true;
                  return false;
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="px-3 pb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-muted border" />
                  <span>Available</span>
                  <div className="w-3 h-3 rounded bg-muted-foreground/30 ml-2" />
                  <span>Unavailable</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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

      {/* Availability Warning */}
      {hasUnavailableDatesInRange && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Some dates in your selection are unavailable</span>
        </div>
      )}

      {/* Book Button */}
      <Button
        onClick={handleBooking}
        disabled={hasUnavailableDatesInRange}
        className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl disabled:opacity-50"
      >
        Reserve Now
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-3">
        You won't be charged yet
      </p>

      {/* Price Breakdown */}
      {nights > 0 && !hasUnavailableDatesInRange && (
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
