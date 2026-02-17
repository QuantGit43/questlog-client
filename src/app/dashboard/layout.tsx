"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GameProvider, useGame } from "./context/GameContext"; 
import { HeartDisplay } from "@/components/ui/HeartDisplay";
import { ProfileScroll } from "./components/ProfileScroll";
import { FloatingTextLayer } from "./components/FloatingTextLayer";

// Мапінг іконок класів
const CLASS_ICONS: Record<string, string> = {
  warrior: "/images/dashboard/warrior.png",
  crafter: "/images/dashboard/crafter.png",
  mage: "/images/dashboard/mage.png",
  healer: "/images/dashboard/healer.png",
};

function DashboardContent({ children }: { children: React.ReactNode }) {
  // 1. Дістаємо всі дані з контексту, включаючи нові стати
  const { 
    hp, 
    gold, 
    username, 
    level, 
    xp, 
    // Характеристики для скролу
    strength, 
    intellect, 
    dexterity, 
    wisdom, 
    
    controls, 
    floatingTexts, 
    setCreateQuestOpen, 
    userClass 
  } = useGame(); 
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  // Розрахунок прогресу для XP бару (залишок від ділення на 100 або ваша формула)
  const xpProgress = xp % 100;

  // Визначення іконки класу
  const currentClassIcon = userClass ? CLASS_ICONS[userClass.toLowerCase()] : null;

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
      {/* Ефект низького здоров'я */}
      {hp < 30 && (
        <div className="absolute inset-0 pointer-events-none border-[20px] border-red-600/40 animate-pulse z-40" />
      )}

      {/* Шар спливаючих текстів */}
      <FloatingTextLayer items={floatingTexts} />

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30 pointer-events-none">
        {/* Логотип */}
        <div className="pointer-events-auto">
          <button onClick={() => router.push("/dashboard")}>
             <img src="/icons/logo.svg" alt="Logo" className="h-10 w-auto drop-shadow-md hover:scale-105 transition-transform" />
          </button>
        </div>

        {/* Правий блок: HP, Gold, Аватар */}
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

          {/* Кнопка Аватара */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-12 h-12 bg-[#3e2723] rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform active:scale-95 cursor-pointer overflow-hidden flex items-center justify-center"
          >
             {currentClassIcon ? (
               <img 
                 src={currentClassIcon} 
                 alt={userClass || "Hero"} 
                 className="w-full h-full object-cover p-1"
               />
             ) : (
               <span className="text-xl">🧙‍♂️</span>
             )}
          </button>
        </div>
      </div>

      {/* --- SCROLL MENU (PROFILE) --- */}
      {isProfileOpen && (
          <ProfileScroll 
            username={username} 
            level={level} 
            xpProgress={xpProgress} 
            // 2. Передаємо "розпаковані" стати в компонент скролу
            stats={{
              strength,
              intellect,
              dexterity,
              wisdom
            }}
            onLogout={handleLogout} 
          />
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="relative w-full h-full pt-10">
        {children}
      </main>

      {/* --- FOOTER --- */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-6 z-40">
        <button onClick={() => router.push('/shop')} className="hover:-translate-y-1 active:scale-95 transition-transform filter drop-shadow-lg">
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

// Головний компонент Layout, що огортає все в провайдер
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
       <DashboardContent>{children}</DashboardContent>
    </GameProvider>
  );
}