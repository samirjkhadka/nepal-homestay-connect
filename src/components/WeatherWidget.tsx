import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind } from 'lucide-react';
import { bestTimeData, currentWeather } from '@/data/communityMock';

export function WeatherWidget() {
  const data = bestTimeData.default;
  const max = Math.max(...data.map(d => d.high));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="w-5 h-5 text-primary" />
        <h3 className="font-display text-2xl font-semibold text-foreground">Weather & best time to visit</h3>
      </div>

      <div className="grid sm:grid-cols-[200px_1fr] gap-6 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 text-center">
          <div className="text-5xl mb-2">{currentWeather.emoji}</div>
          <div className="text-3xl font-display font-bold text-foreground">{currentWeather.tempC}°C</div>
          <p className="text-sm text-muted-foreground mb-3">{currentWeather.condition}</p>
          <div className="flex justify-around text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{currentWeather.humidity}%</span>
            <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{currentWeather.wind} km/h</span>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Best months to visit</p>
          <div className="grid grid-cols-12 gap-1 items-end h-32">
            {data.map(m => (
              <div key={m.month} className="flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${(m.high / max) * 100}%`,
                    background:
                      m.rating >= 4 ? 'hsl(var(--secondary))' :
                      m.rating >= 3 ? 'hsl(var(--accent))' :
                                      'hsl(var(--muted-foreground) / 0.4)',
                  }}
                  title={`${m.month}: ${m.high}°/${m.low}° — ${'★'.repeat(m.rating)}`}
                />
                <span className="text-[10px] text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground mt-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" />Excellent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />Good</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/40" />Avoid</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
