import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import homestay1 from '@/assets/homestay-1.jpg';
import homestay2 from '@/assets/homestay-2.jpg';
import homestay3 from '@/assets/homestay-3.jpg';
import homestay4 from '@/assets/homestay-4.jpg';
import homestay5 from '@/assets/homestay-5.jpg';
import homestay6 from '@/assets/homestay-6.jpg';
import hero2 from '@/assets/hero-2.jpg';

const provinces = [
  {
    id: 1,
    name: 'Koshi Province',
    homestays: 45,
    image: homestay5,
    color: 'from-blue-500/80',
  },
  {
    id: 2,
    name: 'Madhesh Province',
    homestays: 32,
    image: homestay4,
    color: 'from-green-500/80',
  },
  {
    id: 3,
    name: 'Bagmati Province',
    homestays: 89,
    image: homestay3,
    color: 'from-amber-500/80',
  },
  {
    id: 4,
    name: 'Gandaki Province',
    homestays: 120,
    image: homestay1,
    color: 'from-cyan-500/80',
  },
  {
    id: 5,
    name: 'Lumbini Province',
    homestays: 56,
    image: homestay2,
    color: 'from-orange-500/80',
  },
  {
    id: 6,
    name: 'Karnali Province',
    homestays: 28,
    image: hero2,
    color: 'from-indigo-500/80',
  },
  {
    id: 7,
    name: 'Sudurpashchim Province',
    homestays: 35,
    image: homestay6,
    color: 'from-rose-500/80',
  },
];

export function ProvinceSection() {
  return (
    <section className="py-20 bg-muted/50 pattern-overlay">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Explore by Region
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Homestays by Province
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nepal is divided into seven beautiful provinces, each offering unique cultural
            experiences and breathtaking landscapes
          </p>
        </motion.div>

        {/* Province Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {provinces.slice(0, 4).map((province, index) => (
            <motion.div
              key={province.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={province.image}
                alt={province.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${province.color} to-transparent opacity-90`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  {province.homestays} Homestays
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  {province.name}
                </h3>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-white font-medium"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {provinces.slice(4).map((province, index) => (
            <motion.div
              key={province.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={province.image}
                alt={province.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${province.color} to-transparent opacity-90`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  {province.homestays} Homestays
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {province.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
