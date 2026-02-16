"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAnimation } from "framer-motion"; 
import { taskService } from "@/services/taskService";
import { UserProfile, AvatarClass } from "@/types/tasks"; 

type AnimationControls = ReturnType<typeof useAnimation>;

export interface FloatingTextItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface GameContextType {
  hp: number;
  gold: number;
  xp: number;
  level: number;
  username: string;
  userClass: string; 
  controls: AnimationControls;
  floatingTexts: FloatingTextItem[];
  refreshProfile: () => void;
  takeDamage: (amount: number) => void;
  addRewards: (earnedGold: number, earnedXp: number, x?: number, y?: number) => void;
  isCreateQuestOpen: boolean;
  setCreateQuestOpen: (isOpen: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Функція мапінгу (залишається такою ж)
const mapAvatarClassToString = (cls?: AvatarClass | string | number): string => {
  if (cls === undefined || cls === null) return "warrior";

  // Якщо бекенд повертає рядок (наприклад, "Mage")
  if (typeof cls === 'string') {
      const lower = cls.toLowerCase();
      if (lower === 'rogue') return 'crafter'; // Фікс для різниці назв
      if (lower === 'cleric') return 'healer'; // Фікс для різниці назв
      return lower; // "mage" -> "mage", "warrior" -> "warrior"
  }

  // Якщо бекенд повертає число (Enum)
  switch (cls) {
    case 1: return "healer";  // ID 1
    case 2: return "warrior"; // ID 2
    case 3: return "crafter"; // ID 3 (якщо в базі це Crafter/Rogue)
    case 4: return "mage";    // ID 4
    default: return "warrior";
  }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  
  const [username, setUsername] = useState("Hero");
  const [hp, setHp] = useState(100);
  const [gold, setGold] = useState(0);
  const [xp, setXp] = useState(0);
  const [userClass, setUserClass] = useState("warrior");

  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const [isCreateQuestOpen, setCreateQuestOpen] = useState(false);

  const level = Math.floor(xp / 100) + 1;

  useEffect(() => {
    refreshProfile();
  }, []);

  const refreshProfile = async () => {
    try {
      console.log("🔄 [3. GameContext] Fetching user profile...");
      
      const profile = await taskService.getUserProfile();
      
      // [DEBUG 3] Дивимось "сиру" відповідь від сервера
      console.log("📥 [4. GameContext] Raw Profile from API:", profile);

      if (profile) {
        setUsername(profile.username || "Hero");
        setHp(profile.hp);
        setGold(profile.gold);
        setXp(profile.xp);
        
        // [DEBUG 4] Перевіряємо логіку мапінгу
        const className = mapAvatarClassToString(profile.class);
        console.log("⚙️ Class Mapping:", { raw: profile.class, mapped: className });

        setUserClass(className);
      }
    } catch (e) {
      console.error("❌ [GameContext] Error loading profile:", e);
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
        hp, gold, xp, level, username, userClass,
        controls, floatingTexts, 
        refreshProfile, takeDamage, addRewards,
        isCreateQuestOpen, setCreateQuestOpen 
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};