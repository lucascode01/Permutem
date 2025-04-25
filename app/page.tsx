import HydrationFix, { ClientOnly } from './components/HydrationFix';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import FeaturedProperties from './components/FeaturedProperties';
import CtaSection from './components/CtaSection';
import NewsSection from './components/NewsSection';

export default function Home() {
  return (
    <main>
      <HydrationFix>
        <HeroSection />
        <FeaturedProperties />
        <HowItWorks />
        <CtaSection />
        <NewsSection />
      </HydrationFix>
    </main>
  );
} 