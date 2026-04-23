import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Props {
  pricePerNight: number;
  onReserve?: () => void;
}

export function MobileStickyBar({ pricePerNight, onReserve }: Props) {
  const { format } = useCurrency();
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border p-3 flex items-center justify-between gap-3 shadow-elevated"
    >
      <div>
        <div className="font-display text-lg font-bold text-foreground leading-none">{format(pricePerNight)}</div>
        <div className="text-xs text-muted-foreground">per night</div>
      </div>
      <Button onClick={onReserve} className="px-6">Reserve</Button>
    </motion.div>
  );
}
