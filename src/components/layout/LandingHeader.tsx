'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LandingHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`
        fixed top-0 left-0 w-full z-50 border-b-2 border-white/10 
        bg-[#2d1b4e]/90 backdrop-blur-md select-none  /* Змінив прозорість на 90% для кращого контрасту */
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'} 
      `}
    >
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 group cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
           <div className="relative h-12 md:h-16 w-auto aspect-[3/1]"> 
             <Image 
               src="/icons/logo.svg" 
               alt="QuestLog Logo"
               fill 
               className="object-contain object-left drop-shadow-md transition-transform duration-300 group-hover:scale-105"
               priority 
             />
           </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-white/80 hover:text-white font-pixel text-lg hover:underline decoration-white underline-offset-4 transition-all">
            Features
          </Link>
          <Link href="#how-to-play" className="text-white/80 hover:text-white font-pixel text-lg hover:underline decoration-white underline-offset-4 transition-all">
            How to Play
          </Link>
          <Link href="#faq" className="text-white/80 hover:text-white font-pixel text-lg hover:underline decoration-white underline-offset-4 transition-all">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="text-white font-pixel text-lg hover:text-gray-300 transition-colors px-4 py-2">
              Log In
            </button>
          </Link>

          <Link href="/signup">
            <button className="
              px-6 py-2 
              bg-white hover:bg-gray-200 
              text-black font-bold font-pixel text-lg
              border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 active:border-t-4 active:border-gray-400
              transition-all rounded shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            >
              SIGN UP
            </button>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default LandingHeader;