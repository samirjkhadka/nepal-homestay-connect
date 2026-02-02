import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share, 
  Heart, 
  MapPin, 
  Star, 
  Users, 
  BedDouble, 
  Bath,
  Home,
  MessageCircle,
  Award,
  Calendar
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { PhotoGallery } from '@/components/PhotoGallery';
import { AmenitiesList } from '@/components/AmenitiesList';
import { ReviewsSection } from '@/components/ReviewsSection';
import { BookingCard } from '@/components/BookingCard';
import { Footer } from '@/components/Footer';

// Import images
import homestay1 from '@/assets/homestay-1.jpg';
import homestay2 from '@/assets/homestay-2.jpg';
import homestay3 from '@/assets/homestay-3.jpg';
import room1 from '@/assets/room-1.jpg';
import room2 from '@/assets/room-2.jpg';
import room3 from '@/assets/room-3.jpg';

// Mock data for homestays
const homestaysData: Record<string, {
  id: string;
  name: string;
  location: string;
  province: string;
  description: string;
  longDescription: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  host: {
    name: string;
    since: string;
    responseRate: number;
    responseTime: string;
    isSuperhost: boolean;
  };
  images: string[];
  amenities: string[];
  reviewsList: {
    id: number;
    author: string;
    avatar: string;
    date: string;
    rating: number;
    comment: string;
    helpful: number;
  }[];
}> = {
  'mountain-view-retreat': {
    id: 'mountain-view-retreat',
    name: 'Mountain View Retreat',
    location: 'Sarangkot',
    province: 'Gandaki Province',
    description: 'A stunning traditional homestay with panoramic Himalayan views',
    longDescription: `Welcome to Mountain View Retreat, a beautiful traditional Nepali homestay perched on the hills of Sarangkot. Wake up to breathtaking views of the Annapurna range and Machapuchare (Fishtail) mountain right from your window.

Our family has been welcoming travelers for over 15 years, offering authentic Nepali hospitality and home-cooked organic meals. The homestay features traditional stone architecture with modern comforts, surrounded by terraced gardens and rhododendron forests.

Experience village life, join us for morning yoga sessions, or simply relax on the terrace watching the sunset paint the mountains in golden hues. We're perfectly located for day hikes to nearby viewpoints and just 30 minutes from Pokhara city.`,
    pricePerNight: 2500,
    rating: 4.9,
    reviews: 128,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    host: {
      name: 'Deepak Gurung',
      since: '2010',
      responseRate: 98,
      responseTime: 'within an hour',
      isSuperhost: true,
    },
    images: [homestay1, room1, room2, room3, homestay2, homestay3],
    amenities: ['wifi', 'meals', 'mountainView', 'hotWater', 'heating', 'breakfast', 'garden', 'terrace', 'familyFriendly', 'bedroom', 'bathroom', 'cleaning'],
    reviewsList: [
      {
        id: 1,
        author: 'Sarah Mitchell',
        avatar: '',
        date: 'January 2026',
        rating: 5,
        comment: 'Absolutely magical experience! Deepak and his family made us feel like part of their home. The views are even better than the photos, and the dal bhat was the best we had in Nepal.',
        helpful: 24,
      },
      {
        id: 2,
        author: 'James Chen',
        avatar: '',
        date: 'December 2025',
        rating: 5,
        comment: 'The perfect escape from the busy tourist areas. Peaceful, authentic, and the sunrise views of the Annapurna range are unforgettable. Highly recommend the cooking class!',
        helpful: 18,
      },
      {
        id: 3,
        author: 'Emma Watson',
        avatar: '',
        date: 'November 2025',
        rating: 5,
        comment: 'We stayed for 4 nights and didnt want to leave. The hospitality is genuine, the food is incredible, and Deepak knows all the best hiking trails. Book this place!',
        helpful: 31,
      },
      {
        id: 4,
        author: 'Michael Brown',
        avatar: '',
        date: 'November 2025',
        rating: 4,
        comment: 'Great location and wonderful hosts. The room was clean and comfortable. Only minor issue was the WiFi being a bit slow, but thats expected in the mountains.',
        helpful: 12,
      },
    ],
  },
};

export default function HomestayDetail() {
  const { id } = useParams<{ id: string }>();
  const homestay = homestaysData[id || 'mountain-view-retreat'] || homestaysData['mountain-view-retreat'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to homestays
            </Link>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {homestay.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium">{homestay.rating}</span>
                <span className="text-muted-foreground">({homestay.reviews} reviews)</span>
              </div>
              {homestay.host.isSuperhost && (
                <div className="flex items-center gap-1 text-primary">
                  <Award className="w-4 h-4" />
                  <span>Superhost</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{homestay.location}, {homestay.province}</span>
              </div>
              
              <div className="flex items-center gap-3 ml-auto">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  <Share className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Photo Gallery */}
          <div className="relative mb-10">
            <PhotoGallery images={homestay.images} title={homestay.name} />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Host Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start justify-between pb-8 border-b border-border"
              >
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    Entire homestay hosted by {homestay.host.name}
                  </h2>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {homestay.maxGuests} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4" />
                      {homestay.bedrooms} bedroom{homestay.bedrooms > 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {homestay.bathrooms} bathroom{homestay.bathrooms > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl">
                  {homestay.host.name.charAt(0)}
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 pb-8 border-b border-border"
              >
                <div className="flex gap-4">
                  <Award className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground">{homestay.host.name} is a Superhost</h3>
                    <p className="text-sm text-muted-foreground">
                      Superhosts are experienced, highly rated hosts committed to providing great stays.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground">Free cancellation for 48 hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Get a full refund if you change your mind within 48 hours of booking.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MessageCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground">Great communication</h3>
                    <p className="text-sm text-muted-foreground">
                      {homestay.host.responseRate}% response rate · Typically responds {homestay.host.responseTime}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pb-8 border-b border-border"
              >
                <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                  About this place
                </h3>
                <div className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {homestay.longDescription}
                </div>
              </motion.div>

              {/* Amenities */}
              <AmenitiesList amenities={homestay.amenities as any} />

              {/* Reviews */}
              <ReviewsSection
                reviews={homestay.reviewsList}
                averageRating={homestay.rating}
                totalReviews={homestay.reviews}
              />
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <BookingCard
                pricePerNight={homestay.pricePerNight}
                rating={homestay.rating}
                reviews={homestay.reviews}
                maxGuests={homestay.maxGuests}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
