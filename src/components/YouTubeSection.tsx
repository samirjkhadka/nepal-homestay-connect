import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'Experience Traditional Nepali Village Life',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    views: '125K',
    duration: '12:45',
  },
  {
    id: 2,
    title: 'Himalayan Homestay Tour - Annapurna Region',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    views: '89K',
    duration: '18:30',
  },
  {
    id: 3,
    title: 'Cooking Dal Bhat with a Local Family',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    views: '234K',
    duration: '15:20',
  },
  {
    id: 4,
    title: 'Sunrise at Nagarkot - Guest Experience',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    views: '67K',
    duration: '8:15',
  },
];

export function YouTubeSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-saffron font-medium text-sm uppercase tracking-wider">
            Watch & Explore
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mt-2 mb-4">
            Video Stories
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            Watch real experiences from travelers who stayed with our homestay families
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-7 h-7 text-primary fill-primary ml-1" />
                  </motion.div>
                </div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <h3 className="font-medium text-secondary-foreground group-hover:text-saffron transition-colors line-clamp-2">
                {video.title}
              </h3>
              <p className="text-sm text-secondary-foreground/60 mt-1">
                {video.views} views
              </p>
            </motion.div>
          ))}
        </div>

        {/* YouTube Channel Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all hover:scale-105"
          >
            Visit Our YouTube Channel
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
