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
  
  // Характеристики
  strength: number;
  intellect: number;
  dexterity: number;
  wisdom: number;

  controls: AnimationControls;
  floatingTexts: FloatingTextItem[];
  refreshProfile: () => void;
  takeDamage: (amount: number) => void;
  addRewards: (earnedGold: number, earnedXp: number, x?: number, y?: number) => void;
  
  // Керування модалками
  isCreateQuestOpen: boolean;
  setCreateQuestOpen: (isOpen: boolean) => void;
  
  isDetailsOpen: boolean;
  setIsDetailsOpen: (isOpen: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Функція мапінгу
const mapAvatarClassToString = (cls?: AvatarClass | string | number): string => {
  if (cls === undefined || cls === null) return "warrior";
  if (typeof cls === 'string') {
      const lower = cls.toLowerCase();
      if (lower === 'rogue') return 'crafter';
      if (lower === 'cleric') return 'healer';
      return lower;
  }
  switch (cls) {
    case 1: return "healer";
    case 2: return "warrior";
    case 3: return "crafter";
    case 4: return "mage"; 
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

  // Стейт для характеристик
  const [strength, setStrength] = useState(1);
  const [intellect, setIntellect] = useState(1);
  const [dexterity, setDexterity] = useState(1);
  const [wisdom, setWisdom] = useState(1);

  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  
  // Стейт для відкритих модалок
  const [isCreateQuestOpen, setCreateQuestOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
        
        setStrength(profile.strength || 1);
        setIntellect(profile.intellect || 1);
        setDexterity(profile.dexterity || 1);
        setWisdom(profile.wisdom || 1);

        const className = mapAvatarClassToString(profile.class);
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
        strength, intellect, dexterity, wisdom,
        controls, floatingTexts, 
        refreshProfile, takeDamage, addRewards,
        isCreateQuestOpen, setCreateQuestOpen,
        isDetailsOpen, setIsDetailsOpen 
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