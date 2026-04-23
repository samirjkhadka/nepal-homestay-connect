import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function CurrencySwitcher() {
  const { currency, currencies, setCurrencyCode } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          aria-label="Change currency"
        >
          <span>{currency.symbol}</span>
          <span>{currency.code}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        {currencies.map(c => (
          <button
            key={c.code}
            onClick={() => { setCurrencyCode(c.code); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex items-center justify-between ${
              c.code === currency.code ? 'bg-muted' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 text-center">{c.symbol}</span>
              <span>{c.code}</span>
            </span>
            <span className="text-xs text-muted-foreground">{c.name}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
