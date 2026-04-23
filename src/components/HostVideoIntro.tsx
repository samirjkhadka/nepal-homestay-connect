import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface Props { hostName: string; image: string; }

export function HostVideoIntro({ hostName, image }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <h3 className="font-display text-2xl font-semibold text-foreground mb-4">Meet {hostName}</h3>
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted group cursor-pointer" onClick={() => setPlaying(!playing)}>
        <img src={image} alt={hostName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {!playing && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-card/90 flex items-center justify-center shadow-elevated">
              <Play className="w-8 h-8 text-primary fill-primary ml-1" />
            </div>
          </motion.div>
        )}
        {playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm">
            <div className="text-center px-6">
              <div className="text-4xl mb-2">📹</div>
              <p>Video preview — connect a real video URL to play.</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm opacity-90">A 30-second welcome from</p>
          <p className="font-display text-xl font-bold">{hostName}</p>
        </div>
      </div>
    </motion.div>
  );
}
