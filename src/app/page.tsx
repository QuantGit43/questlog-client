import Button from '@/components/ui/Button';
import { LandingHeader } from '@/components/layout/LandingHeader';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-gray-900 text-white font-sans">
      
      {/* 1. Наш новий Хедер */}
      <LandingHeader />

      {/* 2. Hero Section (Тимчасова заглушка для тестування хедера) */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        
        {/* Тимчасовий фон (замість картинки поки що градієнт) */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 z-0" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Turn Your Life into an <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Epic RPG
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Ditch the boring to-do list. Complete real-life quests, defeat bad habits, 
            and level up your character and yourself with every task.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" className="px-8 py-4 text-lg shadow-purple-500/20 shadow-lg">
              Start Your Adventure
            </Button>
            <Button variant="primary" className="px-8 py-4 text-lg bg-transparent border-2 border-white/20 hover:bg-white/10 shadow-none">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Додаткова секція, щоб можна було поскролити і перевірити ефект хедера */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Scroll down to test the header effect!</h2>
          <p className="text-gray-400">
            Notice how the header background blurs when you scroll past the top.
          </p>
          <div className="h-screen"></div> {/* Пустий простір для скролу */}
        </div>
      </section>
    </div>
  );
}