import { Card } from '@/components/ui/card';
import { useHostData } from '@/contexts/HostDataContext';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

export default function HostEarnings() {
  const { data } = useHostData();
  const { earnings } = data;
  const total = earnings.monthly.reduce((s, m) => s + m.amount, 0);
  const max = Math.max(...earnings.monthly.map(m => m.amount));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Earnings & Payouts</h1>
        <p className="text-muted-foreground text-sm mt-1">Track revenue and payout history.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total revenue', value: `NPR ${total.toLocaleString()}`, icon: DollarSign },
          { label: 'Pending payout', value: `NPR ${earnings.pendingBalance.toLocaleString()}`, icon: TrendingUp },
          { label: 'Payout method', value: `${earnings.payoutMethod.type} · ${earnings.payoutMethod.account}`, icon: CreditCard },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="font-semibold text-foreground mb-4">Monthly earnings</h2>
        <div className="flex items-end gap-3 h-40">
          {earnings.monthly.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium">{(m.amount / 1000).toFixed(0)}K</span>
              <div className="w-full bg-primary/30 rounded-t" style={{ height: `${(m.amount / max) * 100}%` }} />
              <span className="text-xs text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border"><h2 className="font-semibold text-foreground">Payout history</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Method</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {earnings.payouts.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">{p.date}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">{p.status}</span></td>
                <td className="p-3 text-right font-medium">NPR {p.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
