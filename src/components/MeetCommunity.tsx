import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { getCommunityFor } from '@/data/communityMock';

interface Props { homestayId: string; }

export function MeetCommunity({ homestayId }: Props) {
  const members = getCommunityFor(homestayId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-secondary" />
        <h3 className="font-display text-2xl font-semibold text-foreground">Meet the community</h3>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Homestays are about people. Here are some of the family and neighbours you'll meet.
      </p>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
        {members.map(m => (
          <div
            key={m.id}
            className="flex-shrink-0 w-44 snap-start bg-card border border-border rounded-2xl p-4 text-center hover:shadow-soft transition-shadow"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-4xl mb-3">
              {m.emoji}
            </div>
            <h4 className="font-semibold text-foreground text-sm">{m.name}</h4>
            <p className="text-xs text-primary mb-2">{m.role}</p>
            <p className="text-xs text-muted-foreground line-clamp-3">{m.bio}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
