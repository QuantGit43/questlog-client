'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const LandingHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-gray-900/80 backdrop-blur-md border-white/10 py-3" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-70 h-10 transform group-hover:scale-110 transition-transform duration-200">
                <Image 
                    src="/icons/logo.svg"  
                    alt="QuestLog Logo"
                    fill
                    className="object-contain" 
                />
            </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
            </Link>
          ))}

          <div className="ml-4 flex items-center space-x-4">
             <Link 
                href="/login" 
                className="text-sm font-bold text-white hover:text-purple-300 transition-colors"
             >
                Log In
             </Link>
             <Link href="/signup">
                <Button variant="primary" className="px-6 py-2 text-sm">
                  Sign Up
                </Button>
             </Link>
          </div>
        </nav>
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
      <div 
        className={cn(
            "md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden",
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-8 flex flex-col space-y-4 items-center text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-lg font-medium text-white hover:text-purple-400 transition-colors w-full py-2 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex flex-col w-full space-y-3 pt-4">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="block text-white font-bold py-2 hover:text-purple-300 transition-colors">
                    Log In
                </span>
            </Link>
            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                    Sign Up Free
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};