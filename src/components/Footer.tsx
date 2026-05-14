import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter, Send, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCMS } from '@/contexts/CMSContext';

export function Footer() {
  const { content } = useCMS();
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('nepali-homestays-visits');
    const count = stored ? parseInt(stored, 10) + 1 : 1;
    localStorage.setItem('nepali-homestays-visits', count.toString());
    setVisitCount(count);
  }, []);

  const socialLinks = [
    { icon: Facebook, href: content.socials.facebook, label: 'Facebook' },
    { icon: Instagram, href: content.socials.instagram, label: 'Instagram' },
    { icon: Youtube, href: content.socials.youtube, label: 'YouTube' },
    { icon: Twitter, href: content.socials.twitter, label: 'Twitter' },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="prayer-flag-strip h-1" aria-hidden />

      <div className="border-b border-background/10">
        <div className="section-container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-background/70">Get the latest homestay deals and travel tips delivered to your inbox</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 bg-background/10 rounded-xl border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-2xl">N</span>
              </div>
              <span className="font-display text-2xl font-semibold">{content.theme.siteName}</span>
            </div>
            <p className="text-background/80 mb-6 leading-relaxed">{content.footerTagline}</p>
            <div className="space-y-3 text-background/70">
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-accent" /><span>Thamel, Kathmandu, Nepal</span></div>
              <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-accent" /><span>+977 1-4123456</span></div>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-accent" /><span>info@nepalihomestays.com</span></div>
            </div>
          </div>

          {content.footerColumns.map(col => (
            <div key={col.id}>
              <h4 className="font-display font-semibold text-lg mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.filter(l => l.visible).map(link => (
                  <li key={link.id}>
                    <Link to={link.href} className="text-background/80 hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-background/70 text-sm">
                © 2026 {content.theme.siteName}. All rights reserved.
              </p>
              <div className="flex items-center gap-1.5 text-background/60 text-sm">
                <Eye className="w-4 h-4" />
                <span>{visitCount.toLocaleString()} visit{visitCount !== 1 ? 's' : ''}</span>
              </div>
              <span className="text-background/70 text-sm flex items-center gap-1">
                Made with <span className="text-destructive">❤</span> in Nepal 🇳🇵
              </span>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors tap-target"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
