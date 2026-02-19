import { motion } from "framer-motion";
import { Task } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}



export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      whileHover={{
        scale: 1.05,
        rotate: [-1, 1, -1],
        transition: { rotate: { repeat: Infinity, duration: 0.5 } },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(task)}
      className="relative w-32 h-32 mx-auto cursor-pointer hover:brightness-110 group"
      style={{
        backgroundImage: "url('/images/task.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pt-6 text-center text-[#3e2723]">
        <h3 className="text-[9px] font-bold leading-tight uppercase line-clamp-2 w-full">
          {task.title}
        </h3>
        <div className="mt-1 flex flex-col items-center gap-0.5 w-full rounded px-1 py-0.5 backdrop-blur-[1px]">
          <span className="text-[12px] font-bold text-blue-900">
            {task.xpReward} XP
          </span>
          <span className="text-[12px] font-bold text-yellow-900">
            {task.goldReward} G
          </span>
        </div>
      </div>
    </motion.div>
  );
};