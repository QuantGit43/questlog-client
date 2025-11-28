'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { cn } from '@/lib/utils';

export const LandingHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Community', href: '/community' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b font-pixel tracking-wide",
        isScrolled 
          ? "bg-[#2d1b4e]/80 backdrop-blur-md border-white/10 py-3 shadow-lg" // Напівпрозорий + розмиття
          : "bg-transparent border-transparent py-6"       // Прозорий, коли нагорі
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative w-40 h-10 transform group-hover:scale-105 transition-transform duration-200">
                <Image 
                    src="/icons/logo.svg"  
                    alt="QuestLog Logo"
                    fill
                    className="object-contain object-left" 
                />
            </div>
        </Link>

       {/* NAV LINKS */}
        <nav className="hidden md:flex items-center space-x-12 ml-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-lg text-white hover:text-purple-200 transition-colors relative group drop-shadow-md py-2"
            >
              {link.name}
 
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-purple-300 transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* MOBILE BUTTON */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none p-2"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div 
        className={cn(
            "md:hidden absolute top-full left-0 w-full bg-[#2d1b4e]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden",
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-8 flex flex-col space-y-4 items-center text-center font-pixel">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xl text-white hover:text-purple-300 transition-colors w-full py-2 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};