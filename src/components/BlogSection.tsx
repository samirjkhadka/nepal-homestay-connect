import { motion } from 'framer-motion';
import { Clock, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMS } from '@/contexts/CMSContext';

export function BlogSection() {
  const { content } = useCMS();
  const blogs = content.blogs.filter(b => b.published).slice(0, 3);

  return (
    <section className="py-20 bg-background">
      <div className="section-container">
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
          <Link
            to="/blogs"
            className="flex items-center gap-2 text-primary font-medium mt-4 md:mt-0 hover:gap-3 transition-all"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {blogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No published articles yet.</p>
        ) : (
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
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={blog.coverUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {blog.tags?.[0] && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full capitalize">
                      {blog.tags[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    5 min read
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{blog.publishedAt}</span>
                  <Link to={`/blog/${blog.slug}`} className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
