import Link from 'next/link';
import Image from 'next/image';

const LandingHeader = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 py-6 px-6">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* ЛОГОТИП */}
        <div className="flex items-center gap-2">
           <span className="text-2xl font-bold text-white drop-shadow-md cursor-default font-pixel">
             ⚔️ QuestLog
           </span>
        </div>

        {/* НАВІГАЦІЯ ЛЕНДІНГУ (Тільки вхід) */}
        <nav>
          <Link href="/dashboard">
            <button className="
              px-6 py-2 
              bg-yellow-500 hover:bg-yellow-400 
              text-black font-bold font-pixel
              border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 
              transition-all rounded"
            >
              PLAY NOW
            </button>
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default LandingHeader;