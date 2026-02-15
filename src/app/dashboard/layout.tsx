"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// Переконайтеся, що GameProvider імпортується правильно
import { GameProvider, useGame } from "./context/GameContext"; 
import { HeartDisplay } from "@/components/ui/HeartDisplay";
import { ProfileScroll } from "./components/ProfileScroll";
import { FloatingTextLayer } from "./components/FloatingTextLayer";

// Цей компонент використовує хук useGame, тому він має бути ВНУТРІШНІМ
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { hp, gold, username, level, xp, controls, floatingTexts, setCreateQuestOpen } = useGame();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const xpProgress = xp % 100;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <motion.div
      animate={controls}
      className="h-screen w-screen overflow-hidden bg-cover bg-center font-pixel text-white relative"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      {/* VIGNETTE (Low HP) */}
      {hp < 30 && (
        <div className="absolute inset-0 pointer-events-none border-[20px] border-red-600/40 animate-pulse z-40" />
      )}

      {/* FLOATING TEXT LAYER */}
      <FloatingTextLayer items={floatingTexts} />

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <button onClick={() => router.push("/dashboard")}>
             <img src="/icons/logo.svg" alt="Logo" className="h-10 w-auto drop-shadow-md hover:scale-105 transition-transform" />
          </button>
        </div>

        <div className="flex items-start gap-4 pointer-events-auto">
          <div className="flex flex-col items-end gap-1">
            <div className="scale-110 origin-right filter drop-shadow-lg">
              <HeartDisplay currentHp={hp} />
            </div>
            <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
              <span>{gold}</span>
              <div className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-700 shadow-sm" />
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-12 h-12 bg-[#3e2723] rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform active:scale-95 cursor-pointer overflow-hidden flex items-center justify-center"
          >
             <span className="text-xl">🧙‍♂️</span>
          </button>
        </div>
      </div>

      {/* --- PROFILE DRAWER --- */}
      {isProfileOpen && (
          <ProfileScroll 
            username={username} 
            level={level} 
            xpProgress={xpProgress} 
            onLogout={handleLogout} 
          />
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="relative w-full h-full pt-10">
        {children}
      </main>

      {/* --- FOOTER NAV --- */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-6 z-40">
        <button onClick={() => router.push('/dashboard/shop')} className="hover:-translate-y-1 active:scale-95 transition-transform filter drop-shadow-lg">
          <img src="/images/Group shop.png" alt="Shop" className="h-20 w-auto object-contain" />
        </button>
        
        <button 
          onClick={() => setCreateQuestOpen(true)} 
          className="hover:-translate-y-2 active:scale-95 transition-transform filter drop-shadow-xl -mt-4"
        >
          <img src="/images/Group create quest.png" alt="Create" className="h-24 w-auto object-contain" />
        </button>
        
        <button onClick={() => router.push('/dashboard/inventory')} className="hover:-translate-y-1 active:scale-95 transition-transform filter drop-shadow-lg">
          <img src="/images/Group inventory.png" alt="Inv" className="h-20 w-auto object-contain" />
        </button>
      </footer>
    </motion.div>
  );
}

// ГОЛОВНИЙ ЕКСПОРТ
// Ми обгортаємо DashboardContent у GameProvider тут.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
       <DashboardContent>{children}</DashboardContent>
    </GameProvider>
  );
}