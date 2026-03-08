import { motion } from 'framer-motion';
import { Star, ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: number;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  helpful: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ratingCategories = [
  { name: 'Cleanliness', rating: 4.9 },
  { name: 'Communication', rating: 5.0 },
  { name: 'Location', rating: 4.8 },
  { name: 'Value', rating: 4.7 },
  { name: 'Authenticity', rating: 5.0 },
  { name: 'Hospitality', rating: 4.9 },
];

export function ReviewsSection({ reviews, averageRating, totalReviews }: ReviewsSectionProps) {
  return (
    <div className="py-8 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-6 h-6 fill-accent text-accent" />
        <span className="font-display text-2xl font-semibold">{averageRating}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{totalReviews} reviews</span>
      </div>

      {/* Rating Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {ratingCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{category.name}</span>
              <span className="text-sm font-medium">{category.rating}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(category.rating / 5) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-foreground rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
                {review.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-foreground">{review.author}</h4>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-foreground leading-relaxed">{review.comment}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show All Reviews Button */}
      <div className="mt-8">
        <Button variant="outline" size="lg" className="font-medium">
          <Eye className="w-4 h-4 mr-2" />
          Show all {totalReviews} reviews
        </Button>
      </div>
    </div>
  );
}
