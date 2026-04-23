import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

interface Props { images: string[]; }

export function GuestPhotoWall({ images }: Props) {
  // Use the homestay's own gallery as a stand-in for guest-uploaded photos.
  const wall = [...images, ...images].slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-accent" />
        <h3 className="font-display text-2xl font-semibold text-foreground">Photos from past guests</h3>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">Real moments shared by travelers who stayed here.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {wall.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`overflow-hidden rounded-lg ${i % 5 === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
          >
            <img src={src} alt={`Guest photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
