import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { villageStories } from '@/data/communityMock';

export function VillageStories() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-secondary" />
        <h3 className="font-display text-2xl font-semibold text-foreground">Stories from the village</h3>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">Short reads written by the host family.</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {villageStories.map(s => (
          <button
            key={s.id}
            className="text-left p-4 bg-muted/40 hover:bg-muted/70 rounded-xl border border-border transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{s.excerpt}</p>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />{s.readMins} min read
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
