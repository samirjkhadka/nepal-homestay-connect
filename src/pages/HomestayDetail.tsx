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
  MessageCircle,
  Award,
  Calendar
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { PhotoGallery } from '@/components/PhotoGallery';
import { ItinerarySection } from '@/components/ItinerarySection';
import { AmenitiesList } from '@/components/AmenitiesList';
import { ReviewsSection } from '@/components/ReviewsSection';
import { BookingCard } from '@/components/BookingCard';
import { HostProfile } from '@/components/HostProfile';
import { LocationSection } from '@/components/LocationSection';
import { NearbyHomestays } from '@/components/NearbyHomestays';
import { Footer } from '@/components/Footer';
import { ExperienceBadges } from '@/components/ExperienceBadges';
import { LocalExperiences } from '@/components/LocalExperiences';
import { MeetCommunity } from '@/components/MeetCommunity';
import { PriceTransparency } from '@/components/PriceTransparency';
import { WeatherWidget } from '@/components/WeatherWidget';
import { VillageStories } from '@/components/VillageStories';
import { GuestPhotoWall } from '@/components/GuestPhotoWall';
import { HostVideoIntro } from '@/components/HostVideoIntro';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { getBadgesFor } from '@/data/communityMock';
import { getHomestayById, getNearbyHomestays } from '@/data/homestays';

export default function HomestayDetail() {
  const { id } = useParams<{ id: string }>();
  const homestay = getHomestayById(id || 'mountain-view-retreat') || getHomestayById('mountain-view-retreat')!;
  const nearbyHomestays = getNearbyHomestays(id || 'mountain-view-retreat');

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
            <ExperienceBadges badges={getBadgesFor(homestay.id)} showLabels className="mt-4" />
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

              {/* What to Expect */}
              <ItinerarySection itinerary={homestay.itinerary} />

              {/* Amenities */}
              <AmenitiesList amenities={homestay.amenities as any} />

              {/* Host Profile */}
              <HostProfile host={homestay.host} />

              {/* Host video introduction */}
              <HostVideoIntro hostName={homestay.host.name} image={homestay.images[0]} />

              {/* Local experiences add-ons */}
              <LocalExperiences />

              {/* Meet the community */}
              <MeetCommunity homestayId={homestay.id} />

              {/* Price transparency */}
              <PriceTransparency />

              {/* Weather + best time to visit */}
              <WeatherWidget />

              {/* Location & Directions */}
              <LocationSection
                location={homestay.location}
                province={homestay.province}
                coordinates={homestay.coordinates}
              />

              {/* Stories from the village */}
              <VillageStories />

              {/* Guest photo wall */}
              <GuestPhotoWall images={homestay.images} />

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

          {/* Nearby Homestays */}
          <NearbyHomestays homestays={nearbyHomestays} />
        </div>
      </main>

      <MobileStickyBar pricePerNight={homestay.pricePerNight} />
      <Footer />
    </div>
  );
}
