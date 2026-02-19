"use client";

import { motion } from "framer-motion";
import { Task } from "@/types/tasks";
import { taskService } from "@/services/taskService";
import { useGame } from "@/app/dashboard/context/GameContext";

interface DetailsModalProps {
  task: Task;
  onClose: () => void;
  onComplete: (task: Task, earnedGold: number, earnedXp: number) => void;
  onDelete: (taskId: string) => void;
}

export const DetailsModal = ({ task, onClose, onComplete, onDelete }: DetailsModalProps) => {
  const { refreshProfile } = useGame();

  const handleComplete = async (e: React.MouseEvent) => {
    try {
        const response = await taskService.complete(task.id);
        const earnedGold = (response as any).earnedGold ?? (response as any).EarnedGold ?? task.goldReward;
        const earnedXp = (response as any).earnedXp ?? (response as any).EarnedXp ?? task.xpReward;
        
        onComplete(task, earnedGold, earnedXp);

        await refreshProfile(); 
        onClose();
        
    } catch (err) {
        console.error("Failed to complete task:", err);
    }
  };

  const handleAbandon = async () => {
      try {
          await taskService.delete(task.id);
          onDelete(task.id);
          onClose(); 
      } catch (err) {
          console.error("Failed to abandon task:", err);
      }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-[500px] h-[550px] bg-no-repeat bg-contain bg-center flex flex-col items-center px-12 py-10 text-[#3e2723] font-pixel"
        style={{ backgroundImage: "url('/images/dashboard/frame.png')" }} 
      >
        <button 
            onClick={onClose} 
            className="absolute top-18 right-9 text-[#5d4037] hover:text-red-700 font-bold text-2xl transition-colors"
        >
            ×
        </button>
        <h2 className="text-3xl mb-6 mt-8 font-bold uppercase tracking-widest text-[#3e2723] drop-shadow-sm">
            Quest Details
        </h2>
        
        <div className="w-full flex flex-col gap-4">
            <div className="w-full bg-[#C38759] text-[#fdf5e6] rounded-xl px-4 py-3 border-2 border-[#5d4037] shadow-inner font-bold text-lg">
                {task.title}
            </div>
            <div className="w-full bg-[#C38759] text-[#fdf5e6] rounded-xl px-4 py-3 border-2 border-[#5d4037] shadow-inner text-sm min-h-[96px] custom-scrollbar overflow-y-auto font-medium">
                {task.description || "No description provided."}
            </div>
            <div className="flex items-center justify-between mt-2 gap-2">
                <div className="w-1/2 bg-[#c29b6d] text-[#3e2723] rounded-lg px-3 py-2 border-2 border-[#8d6e63] font-bold text-sm shadow-sm text-center">
                    {task.category}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#5d4037]">
                    <div className="flex items-center gap-1">
                        <span>XP:</span>
                        <div className="bg-[#c29b6d] border-2 border-[#8d6e63] rounded w-12 h-8 flex items-center justify-center shadow-inner text-[#fdf5e6]">
                            <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                                {task.xpReward || 0}
                            </motion.span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Gold:</span>
                        <div className="bg-[#c29b6d] border-2 border-[#8d6e63] rounded w-12 h-8 flex items-center justify-center shadow-inner text-yellow-200">
                            <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                                {task.goldReward || 0}
                            </motion.span>
                        </div>
                    </div>

                </div>
            </div>
            {task.difficulty && (
                <div className="text-center text-[14px] font-bold uppercase tracking-widest text-[#5d4037]/70 -mt-1">
                    Difficulty: <span className="text-[#3e2723]">{task.difficulty}</span>
                </div>
            )}
            <div className="flex justify-center gap-3 mt-4">
                <button 
                    onClick={handleComplete}
                    className="w-[45%] bg-green-800 text-white px-2 py-2 border-b-3 border-green-900 active:translate-y-1 active:border-b-0 uppercase font-bold text-xs rounded hover:bg-green-700 transition-colors"
                >
                    Complete
                </button>
                <button 
                    onClick={handleAbandon}
                    className="w-[45%] bg-red-800 text-white px-2 py-2 border-b-3 border-red-900 active:translate-y-1 active:border-b-0 uppercase font-bold text-xs rounded hover:bg-red-700 transition-colors"
                >
                    Abandon
                </button>
            </div>

        </div>
      </motion.div>
    </div>
  );
};