'use client';

import Link from 'next/link';
import Image from 'next/image';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#2d1b4e] flex flex-col justify-center items-center text-center pt-10 font-pixel">

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#a56cc1] via-[#d6889f] to-[#5e3060]" />
       <Image 
            src="/images/main_background.svg"
            alt="Pixel Landscape"
            fill
            priority
            style={{ imageRendering: 'pixelated' }} 
            className="object-cover object-bottom opacity-100"
         />
         <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#2d1b4e] to-transparent opacity-80" />
      </div>
      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center">
        <div className="relative w-full max-w-4xl h-[300px] md:h-[450px] translate-y-12 md:translate-y-24 -mb-10">
            <div className="absolute top-[10%] left-[10%] md:left-[10%] w-40 md:w-110 h-auto aspect-square animate-float-slow">
                 <Image 
                   src="/images/island_small.png" 
                   alt="Small Island"
                   fill
                   style={{ imageRendering: 'pixelated' }}
                   className="object-contain drop-shadow-2xl"
                />
            </div>
            <div className="absolute bottom-[-15%] right-[5%] md:right-[0%] w-72 md:w-145 h-auto aspect-square animate-float-delayed">
                <Image 
                   src="/images/island_big.png" 
                   alt="Big Island"
                   fill
                   style={{ imageRendering: 'pixelated' }} 
                   className="object-contain drop-shadow-2xl"
                />
            </div>
            <div className="absolute top-[-6%] left-[45%] -translate-x-1/2 w-24 md:w-48 aspect-square z-50 animate-float">
                <Image 
                   src="/images/character.svg" 
                   alt="Hero Character"
                   fill
                   style={{ imageRendering: 'pixelated' }}
                   className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
            </div>
        </div>
        <div className="relative z-30 mt-10 md:mt-0 mb-10 md:mb-20">
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-wide leading-tight text-white drop-shadow-[3px_2px_0_#000]">
              Turn Your Life into an <br className="hidden md:block" /> Epic RPG.
            </h1>
            
            <p className="text-lg md:text-2xl text-purple-100 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md font-sans opacity-90">
              Ditch the boring to-do list. Complete real-life quests, defeat bad habits, 
              and level up your character.
            </p>
            <Link href="/signup">
              <button 
                className="
                  relative px-14 py-4 rounded-full 
                  bg-gradient-to-b from-cyan-400 to-blue-600 
                  text-white text-2xl md:text-3xl font-bold tracking-widest uppercase font-pixel
                  shadow-[0_0_20px_rgba(56,189,248,0.6)] 
                  hover:shadow-[0_0_40px_rgba(56,189,248,1)] hover:scale-105 hover:-translate-y-1
                  border-2 border-cyan-200/50
                  transition-all duration-300 ease-out
                "
              >
                <span className="drop-shadow-md filter">Start</span>
              </button>
            </Link>
        </div>
      </div>
    </section>
  );
};