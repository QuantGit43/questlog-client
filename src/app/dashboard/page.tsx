"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useGame } from "./context/GameContext";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/tasks";

// Components
import { TaskCard } from "./components/TaskCard";
import { CreateModal } from "./components/CreateModal";
import { DetailsModal } from "./components/DetailsModal";

export default function DashboardPage() {
    // FIX: Destructure isCreateQuestOpen, setCreateQuestOpen
    const { addRewards, takeDamage, isCreateQuestOpen, setCreateQuestOpen } = useGame();
    const [tasks, setTasks] = useState<Task[]>([]);
    
    // UI State for Task Details only
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Initial Load
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await taskService.getAll();
                if(Array.isArray(data)) {
                    setTasks(data.filter((t: any) => !t.isCompleted));
                }
            } catch(e) { console.error(e); }
        };
        loadTasks();
    }, []);

    // Handlers
    const handleTaskCreated = (newTask: Task) => {
        setTasks(prev => [...prev, newTask]);
        // Close modal after creation
        setCreateQuestOpen(false);
    };

    const handleTaskComplete = (task: Task, earnedGold: number, earnedXp: number) => {
        addRewards(earnedGold, earnedXp, window.innerWidth / 2, window.innerHeight / 2);
        setTasks(prev => prev.filter(t => t.id !== task.id));
        setSelectedTask(null);
    };

    const handleTaskDelete = (taskId: string) => {
        takeDamage(20);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setSelectedTask(null);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* The Board Background */}
            <div 
                className="relative w-[900px] h-[600px] bg-no-repeat bg-contain bg-center flex pl-10 pr-10 pt-16 pb-12"
                style={{ backgroundImage: "url('/images/board.png')" }}
            >
                {/* Task Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-8 gap-y-4 w-full h-full overflow-y-auto pr-2 scrollbar-hide content-start items-start">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                        ))}
                    </AnimatePresence>
                    
                    {tasks.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center h-full opacity-50 pt-20">
                            <p className="text-[#5d4037] font-bold text-xl">Empty Board</p>
                            {/* This text link also works via Context now */}
                            <button onClick={() => setCreateQuestOpen(true)} className="text-[#5d4037] underline text-sm">Create a quest</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            
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
        </div>
    );
}