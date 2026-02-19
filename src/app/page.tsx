'use client';

import React, { useEffect, useRef, useState } from 'react';
import LandingHeader from '@/components/layout/LandingHeader';
import { HeroSection } from '@/components/layout/HeroSection';
import Image from 'next/image';

const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          if (entry.boundingClientRect.top > 0) {
            setIsVisible(false);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } 
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {children}
    </div>
  );
};

const WorldMapSection = () => {
  const steps = [
    { id: 1, title: "The Fog of Chaos", desc: "Start here. Your tasks are a mess, and procrastination is the boss.", icon: "🌫️", color: "from-gray-500 to-slate-700" },
    { id: 2, title: "Quest Log Initiated", desc: "Turn boring to-do lists into epic Quests. Assign XP to 'Buy Groceries'.", icon: "📜", color: "from-amber-400 to-orange-600" },
    { id: 3, title: "Gain Experience", desc: "Complete tasks to level up. Watch your INT and STR stats grow in real-time.", icon: "📊", color: "from-blue-400 to-indigo-600" },
    { id: 4, title: "The Loot Shop", desc: "Spend your hard-earned gold on real rewards: a Cheat Meal or a Movie Night.", icon: "🏆", color: "from-yellow-300 to-amber-500" },
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-10">
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 border-l-4 border-dashed border-white/20"></div>

      <div className="space-y-24 relative">
        {steps.map((step, index) => {
          const isEven = index % 2 === 0;
          return (
            <RevealOnScroll key={step.id} delay={index * 150}>
              <div className={`flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} gap-8 relative min-h-[120px]`}>
                
                <div className={`
                    flex-1 relative z-10 break-words 
                    pl-24 md:pl-0 
                    ${isEven ? 'md:text-left md:pl-20' : 'md:text-right md:pr-20'} 
                `}>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-pixel text-shadow leading-snug">{step.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed md:max-w-sm ml-auto mr-auto md:mx-0 font-sans">
                    {step.desc}
                  </p>
                </div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex justify-center items-center z-20 top-0 md:top-1/2 md:-translate-y-1/2">
                  <div className={`
                    w-16 h-16 rounded-xl border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.5)]
                    bg-gradient-to-br ${step.color}
                    flex items-center justify-center text-3xl
                    hover:scale-110 transition-transform duration-300 cursor-pointer group bg-[#2d1b4e]
                  `}>
                    <span className="group-hover:animate-bounce">{step.icon}</span>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-[#2d1b4e] border-2 border-white text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full z-30">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 hidden md:block"></div>
              </div>
            </RevealOnScroll>
          );
        })}
        
        <div className="relative flex justify-center mt-16 pl-8 md:pl-0">
            <RevealOnScroll delay={600}>
                <div className="bg-gradient-to-b from-cyan-400 to-blue-600 text-white px-8 py-3 rounded-full font-bold font-pixel border-4 border-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.4)] animate-pulse relative z-20">
                    READY?
                </div>
            </RevealOnScroll>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    { question: "Is QuestLog free to play?", answer: "Yes! The core game is free. You can track quests, stats, and streaks without paying a single gold coin." },
    { question: "What happens if I miss a streak?", answer: "You take damage! Your HP will decrease, but you can use potions (if you have earned them) to recover your streak." },
    { question: "Can I customize my class?", answer: "Currently, you can choose from 4 base classes. We are working on a skill tree update for advanced customization." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto relative z-10 scroll-mt-24">
      <RevealOnScroll>
        <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl text-white mb-4 font-pixel drop-shadow-md">Tavern Rumors (FAQ)</h2>
             <p className="text-white/60">Common questions from fellow adventurers.</p>
        </div>
      </RevealOnScroll>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <RevealOnScroll key={index} delay={index * 100}>
            <div className={`border-2 transition-colors duration-300 bg-[#1e1e2e] rounded-lg overflow-hidden ${openIndex === index ? 'border-cyan-400' : 'border-white/10 hover:border-white/30'}`}>
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex justify-between items-center group"
              >
                <span className={`font-bold font-pixel text-lg transition-colors ${openIndex === index ? 'text-cyan-400' : 'text-white group-hover:text-cyan-200'}`}>
                    {faq.question}
                </span>
                <span className={`text-2xl font-mono transition-transform duration-300 ${openIndex === index ? 'rotate-45 text-cyan-400' : 'text-white/50'}`}>
                    +
                </span>
              </button>
              
              <div 
                className={`px-6 text-gray-300 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out font-sans ${
                  openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
};

const Step = ({ num, title, text }: any) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-12 h-12 bg-white border-b-4 border-gray-400 rounded flex items-center justify-center text-black font-bold text-xl font-pixel shadow-lg">
      {num}
    </div>
    <div>
      <h4 className="text-xl font-bold text-white font-pixel mb-1">{title}</h4>
      <p className="text-white/80 text-sm">{text}</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <div className="min-h-screen font-pixel selection:bg-white selection:text-black">
      
      <LandingHeader />

      <HeroSection />

      <main className="relative z-10 bg-[#2d1b4e] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/5">
        
        <section id="features" className="py-24 px-6 overflow-hidden scroll-mt-24">
            <RevealOnScroll>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl text-white mb-4 drop-shadow-md">Your Adventure Begins</h2>
                    <p className="text-white/60 max-w-xl mx-auto">Follow the path from chaos to productivity.</p>
                </div>
            </RevealOnScroll>
            <WorldMapSection />
        </section>

        <section id="how-to-play" className="py-24 px-6 container mx-auto max-w-5xl bg-[#251640] border-y-4 border-[#3d2963] scroll-mt-24">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl text-center text-white mb-16 drop-shadow-md">
              How to Play
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-10">
              <RevealOnScroll delay={100}><Step num="1" title="Create Character" text="Sign up and start your journey instantly." /></RevealOnScroll>
              <RevealOnScroll delay={200}><Step num="2" title="Add Quests" text="Input your daily tasks. 'Clean Room' is now a Side Quest worth 50XP." /></RevealOnScroll>
              <RevealOnScroll delay={300}><Step num="3" title="Level Up" text="Complete tasks, gain levels, and unlock new features in your dashboard." /></RevealOnScroll>
            </div>

            <RevealOnScroll delay={400}>
              <div className="relative group flex justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[90%] bg-gradient-to-b from-purple-500 to-pink-500 rounded-lg blur-[60px] opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <Image 
                        src="/icons/menu.png" 
                        alt="Character Menu Scroll"
                        width={350} 
                        height={500}
                        style={{ imageRendering: 'pixelated' }}
                        className="drop-shadow-2xl"
                    />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <FAQSection />

        <RevealOnScroll>
          <section className="text-center py-28 px-6">
            <h2 className="text-4xl md:text-5xl text-white mb-10 drop-shadow-lg">
              Ready to Start the Adventure?
            </h2>
            <a href="/signup">
              <button 
                className="
                  relative px-16 py-5 rounded-full 
                  bg-gradient-to-b from-cyan-400 to-blue-600 
                  text-white text-2xl md:text-3xl font-bold tracking-widest uppercase font-pixel
                  shadow-[0_0_25px_rgba(56,189,248,0.5)] 
                  hover:shadow-[0_0_50px_rgba(56,189,248,0.8)] hover:scale-105 hover:-translate-y-1
                  border-2 border-cyan-200/50
                  transition-all duration-300 ease-out
                "
              >
                <span className="drop-shadow-md filter">ENTER THE WORLD</span>
              </button>
            </a>
          </section>
        </RevealOnScroll>

        <footer className="text-center text-white/30 py-10 border-t border-white/10 text-sm bg-[#0c0017]">
          <p>QuestLog v1.0 • Built with Next.js & ASP.NET Core</p>
        </footer>

      </main>
    </div>
  );
}