"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAnimation } from "framer-motion";
type AnimationControls = ReturnType<typeof useAnimation>;

type FloatingTextItem = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
};

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

  // Управління станом
  addRewards: (gold: number, xp: number, x: number, y: number) => void;
  takeDamage: (amount: number) => void;
  
  // Анімації та UI
  controls: AnimationControls;
  floatingTexts: FloatingTextItem[];
  
  // Модалка створення квесту (це ми залишаємо глобальним)
  isCreateQuestOpen: boolean;
  setCreateQuestOpen: (isOpen: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  // Базові стати
  const [hp, setHp] = useState(100);
  const [gold, setGold] = useState(100);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [username, setUsername] = useState("Hero");
  const [userClass, setUserClass] = useState("warrior");

  // Характеристики
  const [strength, setStrength] = useState(10);
  const [intellect, setIntellect] = useState(5);
  const [dexterity, setDexterity] = useState(8);
  const [wisdom, setWisdom] = useState(3);

  // UI Стани
  const [isCreateQuestOpen, setCreateQuestOpen] = useState(false);
  
  const controls = useAnimation();
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  // Завантаження даних (симуляція)
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  const showFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = Date.now().toString() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  const addRewards = (goldReward: number, xpReward: number, x: number, y: number) => {
    setGold((prev) => prev + goldReward);
    setXp((prev) => prev + xpReward);
    
    showFloatingText(x, y, `+${goldReward} G`, "text-yellow-400");
    setTimeout(() => {
      showFloatingText(x, y - 40, `+${xpReward} XP`, "text-purple-400");
    }, 200);
  };

  const takeDamage = (amount: number) => {
    setHp((prev) => Math.max(0, prev - amount));
    controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    });
  };

  return (
    <GameContext.Provider
      value={{
        hp, gold, xp, level, username, userClass,
        strength, intellect, dexterity, wisdom,
        addRewards, takeDamage,
        controls, floatingTexts,
        isCreateQuestOpen, setCreateQuestOpen
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};