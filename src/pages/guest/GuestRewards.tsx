import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles, Gift, CreditCard, Plus, Trash2, Star, Copy, TrendingUp, Wallet,
} from 'lucide-react';
import { useLoyalty, TIERS, PaymentMethod } from '@/contexts/LoyaltyContext';
import { toast } from 'sonner';

const methodIcon = (t: PaymentMethod['type']) => CreditCard;

const REWARDS = [
  { id: 'r1', label: 'NPR 500 off next booking', cost: 250 },
  { id: 'r2', label: 'Free welcome meal', cost: 400 },
  { id: 'r3', label: 'Free local experience', cost: 700 },
  { id: 'r4', label: 'Donate to a village school', cost: 300 },
];

export default function GuestRewards() {
  const { state, tier, redeem, addMethod, removeMethod, setPrimary } = useLoyalty();
  const [newType, setNewType] = useState<PaymentMethod['type']>('card');

  const pct = tier.next
    ? Math.min(100, Math.round(((state.points - tier.current.min) / (tier.next.min - tier.current.min)) * 100))
    : 100;

  const handleRedeem = (cost: number, label: string) => {
    if (redeem(cost, `Redeemed: ${label}`)) toast.success(`Redeemed "${label}"`);
    else toast.error('Not enough points');
  };

  const addCard = () => {
    const labels: Record<PaymentMethod['type'], string> = {
      card: 'Visa •••• ' + Math.floor(1000 + Math.random() * 9000),
      esewa: 'eSewa 98XXXXXX' + Math.floor(10 + Math.random() * 89),
      khalti: 'Khalti 98XXXXXX' + Math.floor(10 + Math.random() * 89),
      bank: 'NIC Asia •••• ' + Math.floor(1000 + Math.random() * 9000),
    };
    addMethod({ type: newType, label: labels[newType], primary: state.methods.length === 0 });
    toast.success('Payment method added');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />Rewards & Wallet
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Himalayan Hearts loyalty programme</p>
      </div>

      {/* Tier card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Badge className="mb-2">{tier.current.name}</Badge>
              <p className="text-3xl font-bold text-foreground">{state.points.toLocaleString()} <span className="text-base font-normal text-muted-foreground">points</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Referral code</p>
              <button className="font-mono font-semibold text-foreground flex items-center gap-1" onClick={() => { navigator.clipboard?.writeText(state.referralCode); toast.success('Code copied'); }}>
                {state.referralCode}<Copy className="w-3.5 h-3.5" />
              </button>
              <p className="text-xs text-muted-foreground mt-1">{state.referrals} friends joined</p>
            </div>
          </div>
          {tier.next && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{tier.current.name}</span>
                <span>{tier.next.min - state.points} pts to {tier.next.name}</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          )}
        </Card>
      </motion.div>

      {/* Tier benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS.map(t => {
          const isCurrent = t.name === tier.current.name;
          return (
            <Card key={t.name} className={`p-4 ${isCurrent ? 'border-primary ring-1 ring-primary/30' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">{t.name}</p>
                {isCurrent && <Star className="w-4 h-4 fill-primary text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{t.min.toLocaleString()}+ pts</p>
              <ul className="space-y-1">
                {t.perks.map(p => <li key={p} className="text-xs text-foreground flex gap-1.5"><span className="text-primary">•</span>{p}</li>)}
              </ul>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Redeem */}
        <Card className="p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Gift className="w-4 h-4 text-primary" />Redeem points</h2>
          <div className="space-y-2">
            {REWARDS.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.cost} points</p>
                </div>
                <Button size="sm" variant="outline" disabled={state.points < r.cost} onClick={() => handleRedeem(r.cost, r.label)}>Redeem</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Wallet methods */}
        <Card className="p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" />Payment methods</h2>
          <div className="space-y-2 mb-4">
            {state.methods.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{m.label}</span>
                  {m.primary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  {!m.primary && <Button size="sm" variant="ghost" onClick={() => setPrimary(m.id)}>Set primary</Button>}
                  <Button size="sm" variant="ghost" onClick={() => removeMethod(m.id)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <select value={newType} onChange={e => setNewType(e.target.value as PaymentMethod['type'])} className="flex-1 rounded-md border border-border bg-background text-sm px-3">
              <option value="card">Card</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="bank">Bank</option>
            </select>
            <Button onClick={addCard}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Transaction history</h2>
        <div className="space-y-2">
          {state.transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm text-foreground">{t.description}</p>
                <p className="text-xs text-muted-foreground">{t.at} · {t.method} · {t.status}</p>
              </div>
              <span className={`text-sm font-medium ${t.amount >= 0 ? 'text-emerald-600' : 'text-foreground'}`}>
                {t.amount >= 0 ? '+' : '−'}NPR {Math.abs(t.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
