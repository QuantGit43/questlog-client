"use client";

import { useState, useEffect, useCallback } from "react";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest, TaskComplexityResponse, TaskCategory } from "@/types/tasks";
import debounce from "lodash/debounce";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

/* --- ІМПОРТ КОМПОНЕНТІВ --- */
import InventoryModal from "@/components/Inventory/InventoryModal";
import { HeartDisplay } from "@/components/ui/HeartDisplay";
import Input from "@/components/ui/Input";

/* --- ТИПИ ДЛЯ СПЛИВАЮЧОГО ТЕКСТУ --- */
type FloatingTextItem = {
    id: string;
    x: number;
    y: number;
    text: string;
    color: string;
};

export default function DashboardPage() {
    /* --- СТАН ГРАВЦЯ --- */
    const [hp, setHp] = useState(100);
    const [gold, setGold] = useState(100);
    const [xp, setXp] = useState(0);

    /* --- СТАН ЗАВДАНЬ --- */
    const [tasks, setTasks] = useState<Task[]>([]);
    
    /* Стан для модалок */
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false); // Стан інвентаря

    const [aiLoading, setAiLoading] = useState(false);
    const [preview, setPreview] = useState<TaskComplexityResponse | null>(null);

    /* Стан форми створення */
    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        type: "Daily",
        category: TaskCategory.Career,
        dueDate: "" 
    });

    /* --- АНІМАЦІЇ --- */
    const controls = useAnimation(); 
    const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

    /* Функція запуску спливаючого тексту */
    const showFloatingText = (x: number, y: number, text: string, color: string) => {
        const id = Date.now().toString() + Math.random();
        setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(item => item.id !== id));
        }, 1000);
    };

    /* --- ЗАВАНТАЖЕННЯ СПИСКУ ЗАВДАНЬ --- */
    useEffect(() => { 
        loadTasks(); 
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load tasks:", error);
            setTasks([]);
        }
    };

    /* --- AI АНАЛІЗ --- */
    const fetchAiComplexity = useCallback(
        debounce(async (title: string, desc?: string) => {
            if (!title || title.length < 5) {
                setPreview(null);
                return;
            }
            setAiLoading(true);
            try {
                const result = await taskService.analyzeComplexity(title, desc ?? "");
                setPreview(result);
            } catch (error) {
                console.error("AI Analysis failed:", error);
                setPreview(null);
            } finally {
                setAiLoading(false);
            }
        }, 1000), 
        []
    );

    /* --- ОБРОБКА ВВОДУ --- */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === "title" || name === "description") {
                const titleVal = name === "title" ? value : (updated.title ?? "");
                const descVal = name === "description" ? value : (updated.description ?? "");
                fetchAiComplexity(titleVal, descVal);
            }
            return updated;
        });
    };

    /* --- СТВОРЕННЯ ЗАВДАННЯ --- */
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                dueDate: formData.dueDate === "" ? undefined : formData.dueDate
            };
            const newTask = await taskService.create(payload);
            setTasks(prev => Array.isArray(prev) ? [...prev, newTask] : [newTask]);
            setFormData({ title: "", description: "", type: "Daily", category: TaskCategory.Career, dueDate: "" });
            setPreview(null);
            setIsFormOpen(false);
        } catch (error) { 
            console.error("Error creating quest:", error); 
        }
    };

    /* --- ВИКОНАННЯ ЗАВДАННЯ --- */
    const handleCompleteTask = async (task: Task, e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            await taskService.complete(task.id);
            const clickX = e.clientX;
            const clickY = e.clientY;

            showFloatingText(clickX, clickY, `+${task.goldReward} Gold`, "text-yellow-400");
            setTimeout(() => {
                showFloatingText(clickX, clickY - 40, `+${task.xpReward} XP`, "text-blue-400");
            }, 200);

            setGold(prev => prev + task.goldReward);
            setXp(prev => prev + task.xpReward);
            setSelectedTask(null);
            setTasks(prev => prev.filter(t => t.id !== task.id));
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    /* --- ВИДАЛЕННЯ ЗАВДАННЯ --- */
    const handleDeleteTask = async (taskId: string) => {
         try {
            await taskService.delete(taskId);
            controls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
            });
            const damage = 20;
            const newHp = Math.max(0, hp - damage);
            setHp(newHp);

            if (newHp === 0) {
                alert("GAME OVER! You lost all your hearts.");
                setHp(100);
                setGold(Math.floor(gold / 2));
            }

            setTasks(prev => prev.filter(t => t.id !== taskId));
            setSelectedTask(null);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    return (
        <motion.div 
            animate={controls}
            /* 👇 ТУТ МИ СТАВИМО ЗВИЧАЙНИЙ ФОН ЗАМІСТЬ ДРАКОНА */
            className="h-screen w-screen overflow-hidden bg-cover bg-center p-4 font-pixel text-white relative" 
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Червона віньєтка при низькому здоров'ї */}
            {hp < 30 && (
                <div className="absolute inset-0 pointer-events-none border-[20px] border-red-600/40 animate-pulse z-40 transition-all" />
            )}

            {/* HEADER */}
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

            {/* BOARD */}
            <main className="relative z-10 max-w-4xl mx-auto aspect-[16/10] bg-no-repeat bg-contain bg-center flex items-center justify-center pt-10 pb-10 pl-8 pr-8 -mt-16"
                  style={{ backgroundImage: "url('/images/board.png')" }}>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full h-[80%] overflow-y-auto py-4 pl-12 pr-4 scrollbar-hide content-start">
                    <AnimatePresence mode="popLayout">
                        {Array.isArray(tasks) && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <motion.div 
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0, y: 20 }}
                                    whileHover={{ 
                                        scale: 1.05, 
                                        rotate: [-1, 1, -1],
                                        transition: { rotate: { repeat: Infinity, duration: 0.5, ease: "easeInOut" } } 
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedTask(task)}
                                    className="relative w-36 h-36 mx-auto bg-no-repeat bg-contain bg-center p-3 text-gray-800 cursor-pointer hover:brightness-110 group"
                                    style={{ backgroundImage: "url('/images/Group task.png')" }}
                                >
                                    <div className="mt-5 text-center px-2 transition-transform duration-200">
                                        <h3 className="text-[10px] font-bold leading-tight uppercase line-clamp-2 min-h-[2.5em]">{task.title}</h3>
                                        <div className="mt-2 text-[9px] flex flex-col gap-0.5 bg-white/40 p-1 rounded-sm backdrop-blur-[1px]">
                                            <div className="flex justify-between w-full">
                                                <span className="text-purple-800 font-bold">{task.xpReward} XP</span>
                                                <span className="text-yellow-700 font-bold">{task.goldReward} G</span>
                                            </div>
                                            <span className="text-[7px] text-blue-800 font-bold uppercase tracking-wider">{task.category || "General"}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center text-white/50 py-10 flex flex-col items-center justify-center h-full"
                            >
                                <p className="text-xl text-[#5d4037] font-bold">Quest Log Empty</p>
                                <p className="text-sm text-[#5d4037]/70">Accept new quests to begin adventure!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2 z-20">
                <button className="hover:brightness-110 active:scale-95 transition-transform"><img src="/images/Group shop.png" alt="Shop" className="h-20" /></button>
                <button onClick={() => setIsFormOpen(true)} className="hover:brightness-110 -translate-y-2 active:scale-95 transition-transform">
                    <img src="/images/Group create quest.png" alt="Create" className="h-24" />
                </button>
                
                {/* КНОПКА ВІДКРИТТЯ ІНВЕНТАРЯ */}
                <button 
                    onClick={() => setIsInventoryOpen(true)}
                    className="hover:brightness-110 active:scale-95 transition-transform"
                >
                    <img src="/images/Group inventory.png" alt="Inv" className="h-20" />
                </button>
            </footer>

            {/* ВІДОБРАЖЕННЯ СПЛИВАЮЧИХ ЧИСЕЛ */}
            <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
                <AnimatePresence>
                    {floatingTexts.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 1, y: item.y, x: item.x, scale: 0.5 }}
                            animate={{ opacity: 0, y: item.y - 100, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`absolute font-bold text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)] ${item.color}`}
                            style={{ textShadow: "2px 2px 0 #000" }}
                        >
                            {item.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- МОДАЛКА 1: СТВОРЕННЯ ЗАВДАННЯ --- */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 text-gray-900 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] relative">
                        <button onClick={() => setIsFormOpen(false)} className="absolute top-2 right-2 text-[#5d4037] hover:text-red-700 font-bold text-xl">X</button>
                        <h2 className="text-xl mb-4 font-bold text-center uppercase tracking-tighter text-[#3e2723]">New Quest</h2>
                        
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="relative">
                                <Input 
                                    name="title" 
                                    placeholder="Quest Title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                    autoFocus
                                    className="bg-[#fdf5e6] border-2 border-[#5d4037] text-[#5d4037] placeholder-[#5d4037]/50 rounded-none"
                                />
                                {aiLoading && <div className="absolute right-3 top-3 animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />}
                            </div>

                            <textarea name="description" placeholder="Details (optional)..." value={formData.description} onChange={handleChange}
                                      className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] h-20 outline-none text-sm resize-none focus:border-[#8d6e63] placeholder-[#5d4037]/50 font-pixel" />

                            {preview && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="bg-[#5d4037]/10 border-2 border-dashed border-[#5d4037] p-2 rounded-sm"
                                >
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-[#fdf5e6] border border-[#5d4037] p-0.5"><p className="text-[8px] uppercase">Rank</p><p className="text-xs font-bold text-purple-700">{preview.difficulty}</p></div>
                                        <div className="bg-[#fdf5e6] border border-[#5d4037] p-0.5"><p className="text-[8px] uppercase">XP</p><p className="text-xs font-bold text-blue-700">+{preview.xpReward}</p></div>
                                        <div className="bg-[#fdf5e6] border border-[#5d4037] p-0.5"><p className="text-[8px] uppercase">Gold</p><p className="text-xs font-bold text-yellow-700">+{preview.goldReward}</p></div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-[9px] uppercase text-[#5d4037] font-bold mb-0.5">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] text-sm outline-none">
                                        <option value="Daily">Daily</option>
                                        <option value="Main">Main</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[9px] uppercase text-[#5d4037] font-bold mb-0.5">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] text-sm outline-none">
                                        {Object.keys(TaskCategory).filter((key) => isNaN(Number(key))).map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                                <button type="submit" disabled={aiLoading} className="flex-1 bg-green-700 text-white p-2 border-b-4 border-green-900 active:border-b-0 active:translate-y-1 hover:bg-green-600 disabled:grayscale uppercase text-sm font-bold transition-all">Accept Quest</button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-red-700 text-white p-2 border-b-4 border-red-900 active:border-b-0 active:translate-y-1 hover:bg-red-600 uppercase text-sm font-bold transition-all">Decline</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- МОДАЛКА 2: ПЕРЕГЛЯД ДЕТАЛЕЙ --- */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 text-gray-900 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] relative flex flex-col gap-4"
                    >
                        {/* Header */}
                        <div className="border-b-2 border-[#5d4037] pb-2 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold uppercase text-[#3e2723] leading-tight">{selectedTask.title}</h2>
                                <span className="text-[10px] bg-[#5d4037] text-[#c29b6d] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                    {selectedTask.type} • {selectedTask.category || "General"}
                                </span>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="text-[#5d4037] hover:text-red-700 font-bold text-2xl leading-none">×</button>
                        </div>

                        {/* Description */}
                        <div className="bg-[#fdf5e6] border-2 border-[#5d4037] p-3 min-h-[80px] text-sm text-[#5d4037]">
                            {selectedTask.description || <span className="italic text-gray-400">No description provided.</span>}
                        </div>

                        {/* Rewards */}
                        <div className="bg-[#5d4037]/10 border-2 border-dashed border-[#5d4037] p-3 rounded-sm">
                            <p className="text-[10px] font-bold text-[#5d4037] uppercase mb-2 text-center">- Rewards -</p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-[#fdf5e6] border border-[#5d4037] p-1">
                                    <p className="text-[8px] text-gray-500 uppercase">Difficulty</p>
                                    <p className="text-xs font-bold text-purple-700">{selectedTask.difficulty}</p>
                                </div>
                                <div className="bg-[#fdf5e6] border border-[#5d4037] p-1">
                                    <p className="text-[8px] text-gray-500 uppercase">XP</p>
                                    <p className="text-xs font-bold text-blue-700">+{selectedTask.xpReward}</p>
                                </div>
                                <div className="bg-[#fdf5e6] border border-[#5d4037] p-1">
                                    <p className="text-[8px] text-gray-500 uppercase">Gold</p>
                                    <p className="text-xs font-bold text-yellow-700">+{selectedTask.goldReward}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            <button 
                                onClick={(e) => handleCompleteTask(selectedTask, e)}
                                className="flex-[2] bg-green-700 text-white p-3 border-b-4 border-green-900 active:border-b-0 active:translate-y-1 hover:bg-green-600 uppercase text-sm font-bold transition-all shadow-md">
                                Complete Quest!
                            </button>
                            <button 
                                onClick={() => handleDeleteTask(selectedTask.id)}
                                className="flex-1 bg-red-800 text-white p-3 border-b-4 border-red-950 active:border-b-0 active:translate-y-1 hover:bg-red-700 uppercase text-xs font-bold transition-all shadow-md group relative"
                                title="Abandon Quest">
                                🗑 Abandon
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-max">
                                    Warning: -20 HP
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* --- МОДАЛКА 3: ІНВЕНТАР --- */}
            <InventoryModal 
                isOpen={isInventoryOpen} 
                onClose={() => setIsInventoryOpen(false)} 
            />

        </motion.div>
    );
}