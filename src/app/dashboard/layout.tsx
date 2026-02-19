"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GameProvider, useGame } from "./context/GameContext"; 
import { HeartDisplay } from "@/components/ui/HeartDisplay";
import { ProfileScroll } from "./components/ProfileScroll";
import { FloatingTextLayer } from "./components/FloatingTextLayer";

const CLASS_ICONS: Record<string, string> = {
  warrior: "/images/dashboard/warrior.png",
  crafter: "/images/dashboard/crafter.png",
  mage: "/images/dashboard/mage.png",
  healer: "/images/dashboard/healer.png",
};

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { 
    hp, gold, username, level, xp, 
    strength, intellect, dexterity, wisdom, 
    controls, floatingTexts, 
    setCreateQuestOpen, 
    isCreateQuestOpen,
    isDetailsOpen, // <--- Використовуємо новий стейт 
    userClass 
  } = useGame(); 
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isFullScreenPage = pathname === '/dashboard/inventory' || pathname === '/dashboard/shop';
  if (isFullScreenPage) {
     return <>{children}</>;
  }

  const xpProgress = xp % 100;
  const currentClassIcon = userClass ? CLASS_ICONS[userClass.toLowerCase()] : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  // Головний "рубильник" для приховування UI
  const hideUI = isCreateQuestOpen || isDetailsOpen;

  return (
    <motion.div
      animate={controls}
      className="h-screen w-screen overflow-hidden bg-cover bg-center font-pixel text-white relative flex flex-col justify-between"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      {hp < 30 && (
        <div className="absolute inset-0 pointer-events-none border-[20px] border-red-600/40 animate-pulse z-50" />
      )}

      <FloatingTextLayer items={floatingTexts} />

      {/* HEADER: Ховаємо, якщо відкрита модалка створення АБО деталей */}
      {!hideUI && (
        <header className="w-full p-4 flex justify-between items-start z-30 pointer-events-none absolute top-0 left-0">
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
                    
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                            <span>{gold}</span>
                            <div className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-700 shadow-sm" />
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-12 h-12 bg-[#3e2723] rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform active:scale-95 cursor-pointer overflow-hidden flex items-center justify-center relative z-40"
                >
                    {currentClassIcon ? (
                        <img src={currentClassIcon} alt={userClass || "Hero"} className="w-full h-full object-cover p-1"/>
                    ) : (
                        <span className="text-xl">🧙‍♂️</span>
                    )}
                </button>
            </div>
        </header>
      )}

      {isProfileOpen && !hideUI && (
          <ProfileScroll 
            username={username} level={level} xpProgress={xpProgress} 
            stats={{ strength, intellect, dexterity, wisdom }}
            onLogout={handleLogout} 
          />
      )}

      {/* Головний контент (Дошка) */}
      <main className={`relative w-full h-full flex flex-col items-center justify-center pt-20 pb-32 px-4 pointer-events-none transition-all ${hideUI ? 'z-50' : 'z-10'}`}>
        <div className="pointer-events-auto w-full h-full flex items-center justify-center">
            {children}
        </div>
      </main>

      {/* FOOTER: Ховаємо так само, як і хедер */}
      {!hideUI && (
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-6 z-40 pointer-events-auto">
            <button onClick={() => router.push('/dashboard/shop')} className="hover:-translate-y-1 active:scale-95 transition-transform filter drop-shadow-lg">
                <img src="/images/Group shop.png" alt="Shop" className="h-16 md:h-20 w-auto object-contain" />
            </button>
            
            <button 
                onClick={() => setCreateQuestOpen(true)} 
                className="hover:-translate-y-2 active:scale-95 transition-transform filter drop-shadow-xl -mt-4"
            >
                <img src="/images/Group create quest.png" alt="Create" className="h-20 md:h-24 w-auto object-contain" />
            </button>
            
            <button onClick={() => router.push('/dashboard/inventory')} className="hover:-translate-y-1 active:scale-95 transition-transform filter drop-shadow-lg">
                <img src="/images/Group inventory.png" alt="Inv" className="h-16 md:h-20 w-auto object-contain" />
            </button>
        </footer>
      )}
    </motion.div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
       <DashboardContent>{children}</DashboardContent>
    </GameProvider>
  );
}