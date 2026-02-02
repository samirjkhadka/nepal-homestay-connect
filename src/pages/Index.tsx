import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SearchSection } from '@/components/SearchSection';
import { FeaturedHomestays } from '@/components/FeaturedHomestays';
import { ProvinceSection } from '@/components/ProvinceSection';
import { YouTubeSection } from '@/components/YouTubeSection';
import { BlogSection } from '@/components/BlogSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SearchSection />
      <FeaturedHomestays />
      <ProvinceSection />
      <YouTubeSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
