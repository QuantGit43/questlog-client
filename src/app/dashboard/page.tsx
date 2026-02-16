"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "./context/GameContext";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/tasks";

import { TaskCard } from "./components/TaskCard";
import { CreateModal } from "./components/CreateModal";
import { DetailsModal } from "./components/DetailsModal";
import InventoryModal from "@/components/Inventory/InventoryModal";
import { HeartDisplay } from "@/components/ui/HeartDisplay";

export default function DashboardPage() {
    const { 
        hp, 
        gold, 
        xp, 
        addRewards, 
        takeDamage, 
        isCreateQuestOpen, 
        setCreateQuestOpen 
    } = useGame();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

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

    const handleTaskComplete = (task: Task) => {
        addRewards(task.goldReward, task.xpReward, window.innerWidth / 2, window.innerHeight / 2);
        setTasks(prev => prev.filter(t => t.id !== task.id));
        setSelectedTask(null);
    };

    const handleTaskDelete = (taskId: string) => {
        takeDamage(20);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setSelectedTask(null);
    };

    return (
        <div 
            className="h-screen w-screen overflow-hidden bg-cover bg-center p-4 font-pixel text-white relative"
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {hp < 30 && (
                <div className="absolute inset-0 pointer-events-none border-[20px] border-red-600/40 animate-pulse z-40 transition-all" />
            )}

            <header className="flex justify-between items-start max-w-5xl mx-auto mb-4 relative z-10">
                <img src="/icons/logo.svg" alt="Logo" className="h-10 w-auto" />
                
                <div className="flex flex-col items-end gap-2">
                    <div className="h-8 flex items-center filter drop-shadow-md">
                        <HeartDisplay currentHp={hp} />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-purple-300 text-xl drop-shadow-md">
                            <span>{xp} XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-400 text-xl drop-shadow-md">
                            <span>{gold}</span>
                            <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-yellow-700 shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </header>

            <main 
                className="relative z-10 max-w-4xl mx-auto aspect-[16/10] bg-no-repeat bg-contain bg-center flex items-center justify-center pt-10 pb-10 pl-8 pr-8 -mt-16"
                style={{ backgroundImage: "url('/images/board.png')" }}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full h-[80%] overflow-y-auto py-4 pl-12 pr-4 scrollbar-hide content-start">
                    <AnimatePresence mode="popLayout">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center text-white/50 py-10 flex flex-col items-center justify-center h-full"
                            >
                                <p className="text-xl text-[#5d4037] font-bold">Quest Log Empty</p>
                                <button onClick={() => setCreateQuestOpen(true)} className="text-[#5d4037] underline text-sm mt-2">
                                    Create a quest
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2 z-20">
                <button className="hover:brightness-110 active:scale-95 transition-transform">
                    <img src="/images/Group shop.png" alt="Shop" className="h-20" />
                </button>
                
                <button onClick={() => setCreateQuestOpen(true)} className="hover:brightness-110 -translate-y-2 active:scale-95 transition-transform">
                    <img src="/images/Group create quest.png" alt="Create" className="h-24" />
                </button>
                
                <button 
                    onClick={() => setIsInventoryOpen(true)}
                    className="hover:brightness-110 active:scale-95 transition-transform"
                >
                    <img src="/images/Group inventory.png" alt="Inv" className="h-20" />
                </button>
            </footer>

            {isCreateQuestOpen && (
                <CreateModal onClose={() => setCreateQuestOpen(false)} onCreated={handleTaskCreated} />
            )}
            
            {selectedTask && (
                <DetailsModal 
                    task={selectedTask} 
                    onClose={() => setSelectedTask(null)} 
                    onComplete={handleTaskComplete}
                    onDelete={handleTaskDelete}
                />
            )}

            <InventoryModal 
                isOpen={isInventoryOpen} 
                onClose={() => setIsInventoryOpen(false)} 
            />
        </div>
    );
}