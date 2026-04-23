import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { currencies, Currency } from '@/data/communityMock';

interface Ctx {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  format: (nprAmount: number) => string;
  currencies: Currency[];
}

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<string>(() => localStorage.getItem('nh-currency') || 'NPR');
  const currency = currencies.find(c => c.code === code) || currencies[0];

  useEffect(() => { localStorage.setItem('nh-currency', code); }, [code]);

  const format = (npr: number) => {
    const converted = npr * currency.rate;
    const value = currency.code === 'NPR' || currency.code === 'INR'
      ? Math.round(converted).toLocaleString()
      : converted.toFixed(2);
    return `${currency.symbol}${value}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode: setCode, format, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
