import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'esewa' | 'khalti' | 'bank';
  label: string;     // e.g. "Visa •••• 4242" or "eSewa 98XXXXXX21"
  primary: boolean;
}

export interface PointsEntry {
  id: string;
  at: string;
  delta: number;     // positive earn, negative redeem
  reason: string;
}

export interface WalletTransaction {
  id: string;
  at: string;
  description: string;
  amount: number;        // NPR; negative = charge, positive = refund/credit
  status: 'completed' | 'pending' | 'refunded';
  method: string;
}

export interface LoyaltyState {
  points: number;
  history: PointsEntry[];
  methods: PaymentMethod[];
  transactions: WalletTransaction[];
  referralCode: string;
  referrals: number;
}

export const TIERS = [
  { name: 'Traveler', min: 0, perks: ['Member rates', 'Email support'] },
  { name: 'Explorer', min: 500, perks: ['5% off experiences', 'Priority support'] },
  { name: 'Mountaineer', min: 1500, perks: ['Late checkout', 'Free welcome meal'] },
  { name: 'Sherpa', min: 4000, perks: ['Room upgrades', 'Dedicated concierge'] },
] as const;

export function tierFor(points: number) {
  let current = TIERS[0];
  for (const t of TIERS) if (points >= t.min) current = t;
  const next = TIERS.find(t => t.min > points);
  return { current, next };
}

const STORAGE_KEY = 'nh-loyalty-v1';
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const seed = (): LoyaltyState => ({
  points: 820,
  history: [
    { id: uid('pt'), at: '2026-04-12', delta: 405, reason: 'Stay at Mountain View Retreat' },
    { id: uid('pt'), at: '2026-03-23', delta: 480, reason: 'Stay at Lakeside Heritage Home' },
    { id: uid('pt'), at: '2026-03-01', delta: -65, reason: 'Redeemed for experience discount' },
  ],
  methods: [
    { id: uid('pm'), type: 'esewa', label: 'eSewa 98XXXXXX21', primary: true },
    { id: uid('pm'), type: 'card', label: 'Visa •••• 4242', primary: false },
  ],
  transactions: [
    { id: uid('tx'), at: '2026-04-12', description: 'Mountain View Retreat · 3 nights', amount: -8100, status: 'completed', method: 'eSewa' },
    { id: uid('tx'), at: '2026-03-23', description: 'Lakeside Heritage Home · 3 nights', amount: -9600, status: 'completed', method: 'Visa •••• 4242' },
    { id: uid('tx'), at: '2026-02-15', description: 'Refund · cancelled booking', amount: 5500, status: 'refunded', method: 'eSewa' },
  ],
  referralCode: 'SARAH-NEP24',
  referrals: 2,
});

interface LoyaltyContextType {
  state: LoyaltyState;
  tier: ReturnType<typeof tierFor>;
  earn: (delta: number, reason: string) => void;
  redeem: (delta: number, reason: string) => boolean;
  addMethod: (m: Omit<PaymentMethod, 'id'>) => void;
  removeMethod: (id: string) => void;
  setPrimary: (id: string) => void;
}

const LoyaltyContext = createContext<LoyaltyContextType | null>(null);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoyaltyState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...seed(), ...JSON.parse(stored) };
    } catch (e) { /* ignore */ }
    return seed();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }, [state]);

  const earn = useCallback((delta: number, reason: string) => {
    setState(s => ({
      ...s, points: s.points + delta,
      history: [{ id: uid('pt'), at: new Date().toISOString().slice(0, 10), delta, reason }, ...s.history],
    }));
  }, []);

  const redeem = useCallback((delta: number, reason: string): boolean => {
    let ok = false;
    setState(s => {
      if (s.points < delta) return s;
      ok = true;
      return {
        ...s, points: s.points - delta,
        history: [{ id: uid('pt'), at: new Date().toISOString().slice(0, 10), delta: -delta, reason }, ...s.history],
      };
    });
    return ok;
  }, []);

  const addMethod = useCallback((m: Omit<PaymentMethod, 'id'>) =>
    setState(s => ({ ...s, methods: [...s.methods, { ...m, id: uid('pm') }] })), []);

  const removeMethod = useCallback((id: string) =>
    setState(s => ({ ...s, methods: s.methods.filter(m => m.id !== id) })), []);

  const setPrimary = useCallback((id: string) =>
    setState(s => ({ ...s, methods: s.methods.map(m => ({ ...m, primary: m.id === id })) })), []);

  return (
    <LoyaltyContext.Provider value={{ state, tier: tierFor(state.points), earn, redeem, addMethod, removeMethod, setPrimary }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error('useLoyalty must be used within LoyaltyProvider');
  return ctx;
}
