 import { useState, useRef } from 'react';
 import { motion } from 'framer-motion';
 import { Play, ExternalLink, Pause } from 'lucide-react';

 const videos = [
   {
     id: 1,
     title: 'Experience Traditional Nepali Village Life',
     thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
     videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
     views: '125K',
     duration: '12:45',
   },
   {
     id: 2,
     title: 'Himalayan Homestay Tour - Annapurna Region',
     thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
     videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
     views: '89K',
     duration: '18:30',
   },
   {
     id: 3,
     title: 'Cooking Dal Bhat with a Local Family',
     thumbnail: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
     videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
     views: '234K',
     duration: '15:20',
   },
   {
     id: 4,
     title: 'Sunrise at Nagarkot - Guest Experience',
     thumbnail: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800',
     videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
     views: '67K',
     duration: '8:15',
   },
 ];
 
 interface VideoCardProps {
   video: typeof videos[0];
   index: number;
 }
 
 function VideoCard({ video, index }: VideoCardProps) {
   const [isHovered, setIsHovered] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);
 
   const handleMouseEnter = () => {
     setIsHovered(true);
     if (videoRef.current) {
       videoRef.current.play().catch(() => {});
     }
   };
 
   const handleMouseLeave = () => {
     setIsHovered(false);
     if (videoRef.current) {
       videoRef.current.pause();
       videoRef.current.currentTime = 0;
     }
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 30 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ delay: index * 0.1 }}
       whileHover={{ y: -8 }}
       className="group cursor-pointer"
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
     >
       {/* Thumbnail / Video */}
       <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
         {/* Thumbnail Image */}
         <img
           src={video.thumbnail}
           alt={video.title}
           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
         />
         
         {/* Video */}
         <video
           ref={videoRef}
           src={video.videoUrl}
           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
           muted
           loop
           playsInline
         />
 
         {/* Overlay */}
         <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/40 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
         
         {/* Play Button */}
         <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
           <motion.div
             whileHover={{ scale: 1.1 }}
             className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
           >
             <Play className="w-7 h-7 text-primary fill-primary ml-1" />
           </motion.div>
         </div>
 
         {/* Playing Indicator */}
         <div className={`absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs rounded flex items-center gap-1 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <Pause className="w-3 h-3" />
           Playing
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
   );
 }

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
             <VideoCard key={video.id} video={video} index={index} />
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
