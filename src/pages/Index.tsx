import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SearchSection } from '@/components/SearchSection';
import { TrustStrip } from '@/components/TrustStrip';
import { ImpactSection } from '@/components/ImpactSection';
import { FeaturedHomestays } from '@/components/FeaturedHomestays';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { InteractiveProvinceMap } from '@/components/InteractiveProvinceMap';
import { MobileAppSection } from '@/components/MobileAppSection';
import { YouTubeSection } from '@/components/YouTubeSection';
import { BlogSection } from '@/components/BlogSection';
import { PartnersSection } from '@/components/PartnersSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SearchSection />
      <TrustStrip />
      <ImpactSection />
      <FeaturedHomestays />
      <TestimonialsSection />
      <InteractiveProvinceMap />
      <MobileAppSection />
      <YouTubeSection />
      <BlogSection />
      <PartnersSection />
      <Footer />
    </div>
  );
};

export default Index;
