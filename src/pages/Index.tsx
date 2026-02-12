import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ImpactSection } from '@/components/ImpactSection';
import { FeaturedHomestays } from '@/components/FeaturedHomestays';
import { ProvinceSection } from '@/components/ProvinceSection';
import { MobileAppSection } from '@/components/MobileAppSection';
import { YouTubeSection } from '@/components/YouTubeSection';
import { BlogSection } from '@/components/BlogSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ImpactSection />
      <FeaturedHomestays />
      <ProvinceSection />
      <MobileAppSection />
      <YouTubeSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
