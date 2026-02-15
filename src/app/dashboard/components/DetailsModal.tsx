// app/dashboard/components/DetailsModal.tsx
import { motion } from "framer-motion";
import { Task } from "@/types/tasks";
import { taskService } from "@/services/taskService";

interface DetailsModalProps {
  task: Task;
  onClose: () => void;
  onComplete: (task: Task, earnedGold: number, earnedXp: number) => void;
  onDelete: (taskId: string) => void;
}

export const DetailsModal = ({ task, onClose, onComplete, onDelete }: DetailsModalProps) => {
  
  const handleComplete = async (e: React.MouseEvent) => {
    try {
        const response = await taskService.complete(task.id);
        const earnedGold = (response as any).earnedGold ?? (response as any).EarnedGold ?? task.goldReward;
        const earnedXp = (response as any).earnedXp ?? (response as any).EarnedXp ?? task.xpReward;
        onComplete(task, earnedGold, earnedXp);
    } catch (err) {
        console.error(err);
    }
  };

  const handleAbandon = async () => {
      try {
          await taskService.delete(task.id);
          onDelete(task.id);
      } catch (err) {
          console.error(err);
      }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 max-w-md w-full shadow-2xl relative flex flex-col gap-4">
            <div className="flex justify-between items-start border-b-2 border-[#5d4037] pb-2">
                <h2 className="text-xl font-bold uppercase text-[#3e2723]">{task.title}</h2>
                <button onClick={onClose} className="text-[#5d4037] font-bold text-2xl">×</button>
            </div>
            <p className="bg-[#fdf5e6] border-2 border-[#5d4037] p-3 text-sm text-[#5d4037] min-h-[80px]">{task.description || "No details."}</p>
            <div className="flex gap-2">
                <button onClick={handleComplete} className="flex-[2] bg-green-700 text-white p-3 border-b-4 border-green-900 active:translate-y-1 active:border-b-0 uppercase font-bold">Complete</button>
                <button onClick={handleAbandon} className="flex-1 bg-red-800 text-white p-3 border-b-4 border-red-900 active:translate-y-1 active:border-b-0 uppercase font-bold">Abandon</button>
            </div>
        </motion.div>
    </div>
  );
};