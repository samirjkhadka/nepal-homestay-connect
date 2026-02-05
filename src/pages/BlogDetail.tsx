 import { useParams, Link, useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { Calendar, User, Clock, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
 import { Navbar } from '@/components/Navbar';
 import { Footer } from '@/components/Footer';
 import { Button } from '@/components/ui/button';
 import { blogsData, getBlogBySlug } from '@/data/blogs';
 import { toast } from 'sonner';
 
 const BlogDetail = () => {
   const { slug } = useParams();
   const navigate = useNavigate();
   const blog = getBlogBySlug(slug || '');
 
   if (!blog) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="text-center">
           <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
           <Button onClick={() => navigate('/blogs')}>Back to Blogs</Button>
         </div>
       </div>
     );
   }
 
   const relatedBlogs = blogsData.filter(b => b.id !== blog.id && b.category === blog.category).slice(0, 3);
 
   const handleShare = (platform: string) => {
     const url = window.location.href;
     const text = blog.title;
     
     const shareUrls: Record<string, string> = {
       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
       twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
       linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
     };
 
     if (platform === 'copy') {
       navigator.clipboard.writeText(url);
       toast.success('Link copied to clipboard!');
     } else {
       window.open(shareUrls[platform], '_blank', 'width=600,height=400');
     }
   };
 
   return (
     <div className="min-h-screen bg-background">
       <Navbar />
       
       {/* Hero */}
       <section className="pt-24 pb-12">
         <div className="section-container">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-4xl mx-auto"
           >
             <Link 
               to="/blogs" 
               className="inline-flex items-center text-muted-foreground hover:text-primary mb-6"
             >
               <ArrowLeft className="w-4 h-4 mr-2" />
               Back to Blogs
             </Link>
 
             <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
               {blog.category}
             </span>
 
             <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
               {blog.title}
             </h1>
 
             <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
               <div className="flex items-center gap-3">
                 <img 
                   src={blog.authorImage} 
                   alt={blog.author}
                   className="w-10 h-10 rounded-full object-cover"
                 />
                 <span className="font-medium text-foreground">{blog.author}</span>
               </div>
               <span className="flex items-center gap-2">
                 <Calendar className="w-4 h-4" />
                 {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </span>
               <span className="flex items-center gap-2">
                 <Clock className="w-4 h-4" />
                 {blog.readTime}
               </span>
             </div>
           </motion.div>
         </div>
       </section>
 
       {/* Featured Image */}
       <motion.div
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.2 }}
         className="section-container mb-12"
       >
         <div className="max-w-4xl mx-auto">
           <div className="aspect-video rounded-2xl overflow-hidden">
             <img 
               src={blog.image} 
               alt={blog.title}
               className="w-full h-full object-cover"
             />
           </div>
         </div>
       </motion.div>
 
       {/* Content */}
       <section className="section-container pb-12">
         <div className="max-w-4xl mx-auto">
           <div className="grid lg:grid-cols-[1fr,250px] gap-12">
             {/* Main Content */}
             <motion.article
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="prose prose-lg max-w-none dark:prose-invert
                 prose-headings:font-display prose-headings:text-foreground
                 prose-p:text-muted-foreground prose-p:leading-relaxed
                 prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                 prose-strong:text-foreground
                 prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                 prose-li:marker:text-primary"
             >
               {blog.content.split('\n').map((paragraph, index) => {
                 if (paragraph.startsWith('# ')) {
                   return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
                 } else if (paragraph.startsWith('## ')) {
                   return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(3)}</h2>;
                 } else if (paragraph.startsWith('### ')) {
                   return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.slice(4)}</h3>;
                 } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                   return <p key={index} className="font-semibold">{paragraph.slice(2, -2)}</p>;
                 } else if (paragraph.startsWith('- ')) {
                   return <li key={index} className="ml-6">{paragraph.slice(2)}</li>;
                 } else if (paragraph.match(/^\d+\. /)) {
                   return <li key={index} className="ml-6">{paragraph.replace(/^\d+\. /, '')}</li>;
                 } else if (paragraph.trim()) {
                   return <p key={index} className="mb-4">{paragraph}</p>;
                 }
                 return null;
               })}
             </motion.article>
 
             {/* Sidebar */}
             <aside className="space-y-8">
               {/* Share */}
               <div className="bg-card rounded-xl border border-border p-6">
                 <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                   <Share2 className="w-4 h-4" />
                   Share Article
                 </h3>
                 <div className="flex gap-2">
                   <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                     <Facebook className="w-4 h-4" />
                   </Button>
                   <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
                     <Twitter className="w-4 h-4" />
                   </Button>
                   <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
                     <Linkedin className="w-4 h-4" />
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => handleShare('copy')}>
                     Copy Link
                   </Button>
                 </div>
               </div>
 
               {/* Tags */}
               <div className="bg-card rounded-xl border border-border p-6">
                 <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                   <Tag className="w-4 h-4" />
                   Tags
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {blog.tags.map(tag => (
                     <span 
                       key={tag}
                       className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                     >
                       {tag}
                     </span>
                   ))}
                 </div>
               </div>
             </aside>
           </div>
         </div>
       </section>
 
       {/* Related Articles */}
       {relatedBlogs.length > 0 && (
         <section className="section-container py-16 border-t border-border">
           <div className="max-w-4xl mx-auto">
             <h2 className="font-display text-2xl font-bold text-foreground mb-8">Related Articles</h2>
             <div className="grid md:grid-cols-3 gap-6">
               {relatedBlogs.map(related => (
                 <Link 
                   key={related.id} 
                   to={`/blog/${related.slug}`}
                   className="group"
                 >
                   <div className="aspect-video rounded-lg overflow-hidden mb-3">
                     <img 
                       src={related.image} 
                       alt={related.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                   </div>
                   <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                     {related.title}
                   </h3>
                   <p className="text-sm text-muted-foreground mt-1">{related.readTime}</p>
                 </Link>
               ))}
             </div>
           </div>
         </section>
       )}
 
       <Footer />
     </div>
   );
 };
 
 export default BlogDetail;