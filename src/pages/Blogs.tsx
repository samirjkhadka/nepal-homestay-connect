import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

const blogs = [
  {
    id: 1,
    title: 'Top 10 Homestays in the Himalayas for 2026',
    excerpt: 'Discover the most breathtaking homestay experiences nestled in the majestic Himalayan mountains, from traditional Sherpa homes to modern eco-lodges.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    author: 'Priya Sharma',
    date: '2026-01-28',
    readTime: '8 min read',
    category: 'Travel Guide',
  },
  {
    id: 2,
    title: 'A Complete Guide to Nepali Cuisine',
    excerpt: 'From dal bhat to momos, explore the rich culinary traditions of Nepal and learn what authentic dishes to expect at your homestay.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    author: 'Rajan Thapa',
    date: '2026-01-22',
    readTime: '6 min read',
    category: 'Food & Culture',
  },
  {
    id: 3,
    title: 'Trekking Tips for First-Time Visitors',
    excerpt: 'Essential tips and preparation advice for your first trekking adventure in Nepal, including what to pack and how to acclimatize.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    author: 'Tenzing Dorje',
    date: '2026-01-15',
    readTime: '10 min read',
    category: 'Adventure',
  },
  {
    id: 4,
    title: 'Cultural Etiquette: Respecting Nepali Traditions',
    excerpt: 'Learn the do\'s and don\'ts of visiting Nepali homes and communities. Understanding local customs enhances your travel experience.',
    image: 'https://images.unsplash.com/photo-1558799401-1dcba79f4c42?w=800',
    author: 'Maya Gurung',
    date: '2026-01-10',
    readTime: '5 min read',
    category: 'Culture',
  },
  {
    id: 5,
    title: 'Best Time to Visit Nepal: A Seasonal Guide',
    excerpt: 'Plan your perfect trip with our comprehensive guide to Nepal\'s seasons, festivals, and weather patterns throughout the year.',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800',
    author: 'Arjun Rai',
    date: '2026-01-05',
    readTime: '7 min read',
    category: 'Travel Tips',
  },
  {
    id: 6,
    title: 'Sustainable Tourism: How Homestays Help Communities',
    excerpt: 'Discover how choosing homestays over hotels directly benefits local families and contributes to sustainable tourism in Nepal.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    author: 'Sita Tamang',
    date: '2025-12-28',
    readTime: '6 min read',
    category: 'Sustainability',
  },
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Travel Stories & Insights
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover travel tips, cultural insights, and inspiring stories from our community of travelers and hosts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Blog */}
      <section className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden border border-border"
        >
          <div className="h-64 md:h-full">
            <img 
              src={blogs[0].image} 
              alt={blogs[0].title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {blogs[0].category}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {blogs[0].title}
            </h2>
            <p className="text-muted-foreground mb-6">{blogs[0].excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blogs[0].author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(blogs[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blogs[0].readTime}
              </span>
            </div>
            <Button className="group">
              Read More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="section-container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(1).map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
                  {blog.category}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;