import LandingHeader from '@/components/layout/LandingHeader';
import { HeroSection } from '@/components/layout/HeroSection';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-white bg-gray-900">
      
      {/* 1. Навігація (прозора, накладається зверху) */}
      <LandingHeader />

      {/* 2. Головний екран (на весь екран) */}
      <main>
        <HeroSection />
        
        {/* Тут будуть наступні секції: Features, Pricing, Footer... */}
      </main>

    </div>
  );
}