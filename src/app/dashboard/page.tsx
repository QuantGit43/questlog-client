"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "./context/GameContext";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/tasks";

import { TaskCard } from "./components/TaskCard";
import { CreateModal } from "./components/CreateModal";
import { DetailsModal } from "./components/DetailsModal";

export default function DashboardPage() {
    const { 
        addRewards, 
        takeDamage, 
        isCreateQuestOpen, 
        setCreateQuestOpen,
        setIsDetailsOpen
    } = useGame();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAll();
            if(Array.isArray(data)) {
                setTasks(data.filter((t: any) => !t.isCompleted));
            }
        } catch(e) { 
            console.error("Failed to load tasks", e); 
        }
    };

    const handleTaskCreated = (newTask: Task) => {
        setTasks(prev => [...prev, newTask]);
        setCreateQuestOpen(false);
    };

    const handleOpenDetails = (task: Task) => {
        setSelectedTask(task);
        if (setIsDetailsOpen) setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setSelectedTask(null);
        if (setIsDetailsOpen) setIsDetailsOpen(false);
    };

    const handleTaskComplete = (task: Task) => {
        addRewards(task.goldReward, task.xpReward, window.innerWidth / 2, window.innerHeight / 2);
        setTasks(prev => prev.filter(t => t.id !== task.id));
        handleCloseDetails();
    };

    const handleTaskDelete = (taskId: string) => {
        takeDamage(20);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        handleCloseDetails();
    };

    return (
        <>
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        
            <div 
                className="relative z-10 w-full max-w-4xl aspect-[16/10] bg-no-repeat bg-contain bg-center flex items-center justify-center pt-10 pb-10 pl-8 pr-8"
                style={{ backgroundImage: "url('/images/board.png')" }}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full h-[80%] overflow-y-auto py-4 pl-12 pr-4 scrollbar-hide content-start">
                    <AnimatePresence mode="popLayout">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TaskCard key={task.id} task={task} onClick={handleOpenDetails} />
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-10 flex flex-col items-center justify-center h-full"
                            >
                                <p className="text-xl text-[#5d4037] font-bold drop-shadow-sm">Quest Log Empty</p>
                                <button 
                                    onClick={() => setCreateQuestOpen(true)} 
                                    className="text-[#5d4037] underline text-sm mt-2 font-semibold hover:text-[#3e2723]"
                                >
                                    Create a quest
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ВАЖЛИВО: Тут більше немає зовнішнього div з bg-black. Ми просто рендеримо компонент */}
            {isCreateQuestOpen && (
                <CreateModal 
                    onClose={() => setCreateQuestOpen(false)} 
                    onCreated={handleTaskCreated} 
                />
            )}
            
            {/* Те саме для DetailsModal */}
            {selectedTask && (
                <DetailsModal 
                    task={selectedTask} 
                    onClose={handleCloseDetails}
                    onComplete={handleTaskComplete}
                    onDelete={handleTaskDelete}
                />
            )}
        </>
    );
}