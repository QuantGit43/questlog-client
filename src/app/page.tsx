import Link from 'next/link';
import { HeroSection } from '@/components/layout/HeroSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2d1b4e]">
      <HeroSection />
    </main>
  );
}