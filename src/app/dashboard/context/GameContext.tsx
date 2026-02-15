"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAnimation } from "framer-motion"; 
import { taskService } from "@/services/taskService";

// Визначаємо тип анімації динамічно, щоб уникнути помилок версій
type AnimationControls = ReturnType<typeof useAnimation>;

export interface FloatingTextItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

// Інтерфейс старого зразка (без AvatarDto, без Stats)
interface GameContextType {
  hp: number;
  gold: number;
  xp: number;
  level: number;
  username: string;
  
  controls: AnimationControls;
  floatingTexts: FloatingTextItem[];
  
  refreshProfile: () => void;
  takeDamage: (amount: number) => void;
  addRewards: (earnedGold: number, earnedXp: number, x?: number, y?: number) => void;
  
  isCreateQuestOpen: boolean;
  setCreateQuestOpen: (isOpen: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  
  // Окремі стани для кожної змінної (як було раніше)
  const [username, setUsername] = useState("Hero");
  const [hp, setHp] = useState(100);
  const [gold, setGold] = useState(0);
  const [xp, setXp] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const [isCreateQuestOpen, setCreateQuestOpen] = useState(false);

  // Проста формула рівня
  const level = Math.floor(xp / 100) + 1;

  useEffect(() => {
    refreshProfile();
  }, []);

  const refreshProfile = async () => {
    try {
      const profile = await taskService.getUserProfile();
      if (profile) {
        setUsername(profile.username || "Hero");
        setHp(profile.hp);
        setGold(profile.gold);
        setXp(profile.xp);
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  };

  const showFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = Date.now().toString() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  const takeDamage = (amount: number) => {
    const newHp = Math.max(0, hp - amount);
    setHp(newHp);
    
    controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    });
  };

  const addRewards = (earnedGold: number, earnedXp: number, x: number = window.innerWidth/2, y: number = window.innerHeight/2) => {
    setGold((prev) => prev + earnedGold);
    setXp((prev) => prev + earnedXp);
    
    showFloatingText(x, y, `+${earnedGold} Gold`, "text-yellow-400");
    setTimeout(() => {
        showFloatingText(x, y - 40, `+${earnedXp} XP`, "text-blue-400");
    }, 200);
  };

  return (
    <GameContext.Provider
      value={{ 
        hp, gold, xp, level, username, 
        controls, floatingTexts, 
        refreshProfile, takeDamage, addRewards,
        isCreateQuestOpen, setCreateQuestOpen 
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// --- ОСЬ ЦЕЙ ЕКСПОРТ ВИ ЗАГУБИЛИ ---
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};