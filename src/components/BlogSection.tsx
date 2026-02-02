import { motion } from 'framer-motion';
import { Clock, ArrowRight, User } from 'lucide-react';
import homestay3 from '@/assets/homestay-3.jpg';
import homestay5 from '@/assets/homestay-5.jpg';
import homestay6 from '@/assets/homestay-6.jpg';

const blogs = [
  {
    id: 1,
    title: '10 Best Homestays Near Annapurna Base Camp',
    excerpt: 'Discover the most authentic homestay experiences along the famous Annapurna trek...',
    author: 'Ramesh Sharma',
    date: 'Jan 28, 2026',
    readTime: '5 min read',
    image: homestay5,
    category: 'Travel Guide',
  },
  {
    id: 2,
    title: 'Understanding Nepali Culture Through Homestays',
    excerpt: 'Learn about the rich traditions and customs you will encounter during your homestay...',
    author: 'Sita Thapa',
    date: 'Jan 25, 2026',
    readTime: '7 min read',
    image: homestay3,
    category: 'Culture',
  },
  {
    id: 3,
    title: 'Sustainable Tourism: How Homestays Help Local Communities',
    excerpt: 'Explore how choosing homestays over hotels contributes to sustainable tourism...',
    author: 'Prakash Gurung',
    date: 'Jan 22, 2026',
    readTime: '6 min read',
    image: homestay6,
    category: 'News',
  },
];

export function BlogSection() {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Latest Updates
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">
              Blogs & News
            </h2>
          </div>
          <motion.a
            href="/blogs"
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-primary font-medium mt-4 md:mt-0 hover:gap-3 transition-all"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.readTime}
                  </span>
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{blog.date}</span>
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-primary font-medium text-sm flex items-center gap-1 cursor-pointer"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
