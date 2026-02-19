import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/tasks";

export type FloatingTextItem = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
};

export const useDashboardGame = () => {
  const router = useRouter();
  const controls = useAnimation();

  const [username, setUsername] = useState("Hero");
  const [hp, setHp] = useState(100);
  const [gold, setGold] = useState(0);
  const [xp, setXp] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  const level = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const tasksData = await taskService.getAll();
      if (Array.isArray(tasksData)) {
        setTasks(tasksData.filter((t: any) => !t.isCompleted));
      }
      const profile = await taskService.getUserProfile();
      if (profile) {
        setUsername(profile.username || "Hero");
        setHp(profile.hp);
        setGold(profile.gold);
        setXp(profile.xp);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  const showFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = Date.now().toString() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const refreshTasks = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const removeTaskFromBoard = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const addRewards = (goldReward: number, xpReward: number) => {
    setGold((prev) => prev + goldReward);
    setXp((prev) => prev + xpReward);
  };

  const takeDamage = (amount: number) => {
    controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    });

    const newHp = Math.max(0, hp - amount);
    setHp(newHp);

    if (newHp === 0) {
      alert("GAME OVER! You lost all your hearts.");
      setHp(100);
      setGold(Math.floor(gold / 2));
    }
  };

  return {
    // State
    username, hp, gold, xp, level, xpProgress, tasks, floatingTexts, controls,
    // Actions
    handleLogout,
    refreshTasks,
    removeTaskFromBoard,
    addRewards,
    takeDamage,
    showFloatingText
  };
};