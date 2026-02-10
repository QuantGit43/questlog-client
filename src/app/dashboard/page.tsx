"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest, TaskComplexityResponse, TaskCategory } from "@/types/tasks";
import debounce from "lodash/debounce";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

// Імпорт UI компонентів
import { HeartDisplay } from "@/components/ui/HeartDisplay";
import Input from "@/components/ui/Input";

// Тип для анімації тексту (+10 Gold)
type FloatingTextItem = {
    id: string;
    x: number;
    y: number;
    text: string;
    color: string;
};

export default function DashboardPage() {
    const router = useRouter();

    // --- СТАН ГРАВЦЯ ---
    const [username, setUsername] = useState("Player");
    const [hp, setHp] = useState(100);
    const [gold, setGold] = useState(0);
    const [xp, setXp] = useState(0);

    // Розрахунок рівня (кожні 100 XP = 1 рівень)
    const level = Math.floor(xp / 100) + 1;
    const xpProgress = xp % 100;

    // --- СТАН ДАНИХ ---
    const [tasks, setTasks] = useState<Task[]>([]);
    
    // --- СТАН ІНТЕРФЕЙСУ ---
    const [isFormOpen, setIsFormOpen] = useState(false);       // Модалка створення
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Сувій профілю
    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Перегляд завдання

    // --- СТАН AI & FORM ---
    const [aiLoading, setAiLoading] = useState(false);
    const [preview, setPreview] = useState<TaskComplexityResponse | null>(null);
    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        type: "Daily",
        category: TaskCategory.Career,
        dueDate: "" 
    });

    // --- АНІМАЦІЇ ---
    const controls = useAnimation();
    const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

    const showFloatingText = (x: number, y: number, text: string, color: string) => {
        const id = Date.now().toString() + Math.random();
        setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(item => item.id !== id));
        }, 1000);
    };

    // --- 1. ЗАВАНТАЖЕННЯ ДАНИХ ---
    useEffect(() => { 
        loadData(); 
    }, []);

    const loadData = async () => {
        try {
            // 1. Завдання
            const tasksData = await taskService.getAll();
            if (Array.isArray(tasksData)) {
                // Показуємо тільки активні (не виконані)
                const activeTasks = tasksData.filter((t: any) => !t.isCompleted);
                setTasks(activeTasks);
            }

            // 2. Профіль
            const profile = await taskService.getUserProfile();
            if (profile) {
                setUsername(profile.username || "Hero"); // Якщо бекенд не повернув ім'я, буде "Hero"
                setHp(profile.hp);
                setGold(profile.gold);
                setXp(profile.xp);
            }
        } catch (error) {
            console.error("Failed to load initial data:", error);
        }
    };

    // --- 2. LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem("token"); // Видаляємо токен
        router.push("/login"); // Редірект на вхід
    };

    // --- 3. AI ANALYZE ---
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
                setPreview(null);
            } finally {
                setAiLoading(false);
            }
        }, 1000), 
        []
    );

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

    // --- 4. СТВОРЕННЯ ЗАВДАННЯ ---
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                dueDate: formData.dueDate === "" ? undefined : formData.dueDate
            };
            const newTask = await taskService.create(payload);
            setTasks(prev => [...prev, newTask]);
            
            // Очищення форми
            setFormData({ title: "", description: "", type: "Daily", category: TaskCategory.Career, dueDate: "" });
            setPreview(null);
            setIsFormOpen(false);
        } catch (error) { console.error("Error creating quest:", error); }
    };

    // --- 5. ВИКОНАННЯ ЗАВДАННЯ ---
    const handleCompleteTask = async (task: Task, e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            // Отримуємо нові баланси від бекенду
            const response = await taskService.complete(task.id);

            // Анімація тексту (+Gold, +XP)
            const clickX = e.clientX;
            const clickY = e.clientY;
            showFloatingText(clickX, clickY, `+${task.goldReward} Gold`, "text-yellow-400");
            setTimeout(() => {
                showFloatingText(clickX, clickY - 40, `+${task.xpReward} XP`, "text-blue-400");
            }, 200);

            // Оновлюємо стейт
            setGold(response.newGold);
            setXp(response.newXp);

            // Прибираємо завдання
            setSelectedTask(null);
            setTasks(prev => prev.filter(t => t.id !== task.id));

        } catch (error) { console.error("Error completing task:", error); }
    };

    // --- 6. ВИДАЛЕННЯ ЗАВДАННЯ ---
    const handleDeleteTask = async (taskId: string) => {
         try {
            await taskService.delete(taskId);
            
            // Ефект тряски екрану
            controls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
            });

            // Локальна логіка шкоди (можна винести на бекенд)
            const damage = 20;
            const newHp = Math.max(0, hp - damage);
            setHp(newHp);

            if (newHp === 0) {
                alert("GAME OVER! You lost all your hearts.");
                setHp(100);
                setGold(Math.floor(gold / 2));
                // Тут варто додати запит на бекенд про ресет/смерть
            }

            setTasks(prev => prev.filter(t => t.id !== taskId));
            setSelectedTask(null);
        } catch (error) { console.error("Error deleting task:", error); }
    }

    return (
        <motion.div 
            animate={controls}
            className="h-screen w-screen overflow-hidden bg-cover bg-center font-pixel text-white relative" 
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* ВІНЬЄТКА (Low HP) */}
            {hp < 30 && (
                <div className="absolute inset-0 pointer-events-none border-[20px] border-red-600/40 animate-pulse z-40" />
            )}

            {/* --- HEADER --- */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30 pointer-events-none">
                {/* Логотип */}
                <div className="pointer-events-auto">
                     <img src="/icons/logo.svg" alt="Logo" className="h-10 w-auto drop-shadow-md" />
                </div>

                {/* Стати + Аватар */}
                <div className="flex items-start gap-4 pointer-events-auto">
                    <div className="flex flex-col items-end gap-1">
                        <div className="scale-110 origin-right filter drop-shadow-lg">
                             <HeartDisplay currentHp={hp} />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                            <span>{gold}</span>
                            <div className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-700 shadow-sm" />
                        </div>
                    </div>

                    {/* Кнопка Аватара */}
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-12 h-12 bg-gray-300 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform active:scale-95 cursor-pointer overflow-hidden"
                    >
                         {/* Можна додати картинку аватара */}
                    </button>
                </div>
            </div>

            {/* --- ПРОФІЛЬ (СУВІЙ) --- */}
            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute right-10 top-20 z-50 pointer-events-auto filter drop-shadow-2xl"
                    >
                         <div 
                            className="w-72 h-[450px] bg-contain bg-no-repeat bg-center flex flex-col items-center pt-24 px-8 pb-12 text-[#5d4037]"
                            style={{ backgroundImage: "url('/images/scroll_vertical.png')" }} 
                         >
                            <div className="w-full text-center space-y-4">
                                <div>
                                    {/* Username з бекенду */}
                                    <h2 className="font-bold text-lg uppercase tracking-wider border-b border-[#8d6e63]/30 pb-1 mb-1">
                                        {username}
                                    </h2>
                                    <p className="text-sm font-semibold">Level {level}</p>
                                </div>
                                
                                {/* XP Bar */}
                                <div className="w-full">
                                    <div className="flex justify-between text-[10px] font-bold mb-1 px-1">
                                        <span>XP</span>
                                        <span>{xpProgress} / 100</span>
                                    </div>
                                    <div className="w-full h-4 bg-black/20 rounded-full border border-[#5d4037]/50 overflow-hidden relative">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${xpProgress}%` }}
                                            className="h-full bg-green-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]"
                                        />
                                    </div>
                                </div>
                                
                                {/* Кнопка Logout */}
                                <div className="pt-6 flex flex-col gap-2 w-full border-t border-[#8d6e63]/20">
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm font-bold text-red-800 hover:text-red-600 hover:bg-red-900/10 transition-colors p-2 rounded justify-center w-full"
                                    >
                                        <span>🚪</span> Log out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- ГОЛОВНА ДОШКА (GRID ЗАВДАНЬ) --- */}
            <main className="relative w-full h-full flex items-center justify-center pt-10">
                <div 
                    className="relative w-[900px] h-[600px] bg-no-repeat bg-contain bg-center flex pl-10 pr-10 pt-16 pb-12"
                    style={{ backgroundImage: "url('/images/board.png')" }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-8 gap-y-4 w-full h-full overflow-y-auto pr-2 scrollbar-hide content-start items-start">
                        <AnimatePresence mode="popLayout">
                            {Array.isArray(tasks) && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <motion.div 
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        whileHover={{ scale: 1.05, rotate: [-1, 1, -1], transition: { rotate: { repeat: Infinity, duration: 0.5 } } }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedTask(task)}
                                        className="relative w-32 h-32 mx-auto cursor-pointer hover:brightness-110 group"
                                        style={{ 
                                            backgroundImage: "url('/images/group task.png')",
                                            backgroundSize: 'contain',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    >
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pt-6 text-center text-[#3e2723]">
                                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-800 shadow-sm border border-black/20"></div>
                                            <h3 className="text-[9px] font-bold leading-tight uppercase line-clamp-2 w-full">{task.title}</h3>
                                            <div className="mt-1 flex flex-col items-center gap-0.5 bg-white/50 w-full rounded px-1 py-0.5 backdrop-blur-[1px]">
                                                <span className="text-[8px] font-bold text-blue-900">{task.xpReward} XP</span>
                                                <span className="text-[7px] font-bold text-yellow-900">{task.goldReward} G</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center h-full opacity-50 pt-20">
                                    <p className="text-[#5d4037] font-bold text-xl">Empty Board</p>
                                    <p className="text-[#5d4037] text-sm">Create a quest!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* --- FOOTER BUTTONS --- */}
            <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-6 z-40">
                <button className="hover:-translate-y-1 active:scale-95 transition-transform filter drop-shadow-lg">
                    <img src="/images/Group shop.png" alt="Shop" className="h-20 w-auto object-contain" />
                </button>
                <button onClick={() => setIsFormOpen(true)} className="hover:-translate-y-2 active:scale-95 transition-transform filter drop-shadow-xl -mt-4">
                    <img src="/images/Group create quest.png" alt="Create" className="h-24 w-auto object-contain" />
                </button>
                <button className="hover:-translate-y-1 active:scale-95 transition-transform filter drop-shadow-lg">
                    <img src="/images/Group inventory.png" alt="Inv" className="h-20 w-auto object-contain" />
                </button>
            </footer>

            {/* --- СПЛИВАЮЧІ ЧИСЛА --- */}
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

            {/* --- MODAL 1: СТВОРЕННЯ КВЕСТУ --- */}
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

            {/* --- MODAL 2: ПЕРЕГЛЯД КВЕСТУ --- */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 max-w-md w-full shadow-2xl relative flex flex-col gap-4">
                        <div className="flex justify-between items-start border-b-2 border-[#5d4037] pb-2">
                            <h2 className="text-xl font-bold uppercase text-[#3e2723]">{selectedTask.title}</h2>
                            <button onClick={() => setSelectedTask(null)} className="text-[#5d4037] font-bold text-2xl">×</button>
                        </div>
                        <p className="bg-[#fdf5e6] border-2 border-[#5d4037] p-3 text-sm text-[#5d4037] min-h-[80px]">{selectedTask.description || "No details."}</p>
                        <div className="flex gap-2">
                            <button onClick={(e) => handleCompleteTask(selectedTask, e)} className="flex-[2] bg-green-700 text-white p-3 border-b-4 border-green-900 active:translate-y-1 active:border-b-0 uppercase font-bold">Complete</button>
                            <button onClick={() => handleDeleteTask(selectedTask.id)} className="flex-1 bg-red-800 text-white p-3 border-b-4 border-red-900 active:translate-y-1 active:border-b-0 uppercase font-bold">Abandon</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}