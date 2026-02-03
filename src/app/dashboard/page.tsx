"use client";

import { useState, useEffect, useCallback } from "react";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest, TaskComplexityResponse, TaskCategory } from "@/types/tasks";
import debounce from "lodash/debounce";

export default function DashboardPage() {
    // --- СТАН ---
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [preview, setPreview] = useState<TaskComplexityResponse | null>(null);

    // Стан форми
    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        type: "Daily",
        category: TaskCategory.Career,
        dueDate: "" // За замовчуванням пустий рядок (треба обробити перед відправкою)
    });

    // --- ЗАВАНТАЖЕННЯ СПИСКУ ЗАВДАНЬ ---
    useEffect(() => { 
        const loadTasks = async () => {
            try {
                const data = await taskService.getAll();
                setTasks(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load tasks:", error);
                setTasks([]);
            }
        };
        loadTasks(); 
    }, []);

    // --- AI АНАЛІЗ (Debounce) ---
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

    // --- ОБРОБКА ВВОДУ ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            
            // Якщо змінюється заголовок або опис — запускаємо AI
            if (name === "title" || name === "description") {
                const titleVal = name === "title" ? value : (updated.title ?? "");
                const descVal = name === "description" ? value : (updated.description ?? "");
                fetchAiComplexity(titleVal, descVal);
            }
            return updated;
        });
    };

    // --- СТВОРЕННЯ ЗАВДАННЯ (FIXED) ---
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 🔧 ВИПРАВЛЕННЯ ПОМИЛКИ 400:
            // Створюємо копію даних і замінюємо пусту дату на undefined
            const payload = {
                ...formData,
                dueDate: formData.dueDate === "" ? undefined : formData.dueDate
            };

            console.log("Sending payload:", payload); // Для дебагу

            const newTask = await taskService.create(payload);
            
            // Оновлюємо UI
            setTasks(prev => Array.isArray(prev) ? [...prev, newTask] : [newTask]);
            
            // Скидаємо форму
            setFormData({ 
                title: "", 
                description: "", 
                type: "Daily", 
                category: TaskCategory.Career, 
                dueDate: "" 
            });
            setPreview(null);
            setIsFormOpen(false);

        } catch (error) { 
            console.error("Error creating quest:", error); 
            // Тут можна додати alert або toast з помилкою
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-cover bg-center p-4 font-pixel text-white relative" 
             style={{ backgroundImage: "url('/images/background.png')" }}>
            
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* HEADER */}
            <header className="flex justify-between items-start max-w-5xl mx-auto mb-4 relative z-10">
                <img src="/icons/logo.svg" alt="Logo" className="h-10 w-auto" />
                <div className="flex flex-col items-end gap-2">
                    <img src="/images/Group hearts.png" alt="Hearts" className="h-8 object-contain" />
                    <div className="flex items-center gap-2 text-yellow-400 text-xl">
                        <span>100</span>
                        <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
                    </div>
                </div>
            </header>

            {/* BOARD (Список завдань) */}
            <main className="relative max-w-4xl mx-auto aspect-[16/10] bg-no-repeat bg-contain bg-center flex items-center justify-center pt-10 pb-10 pl-8 pr-8 -mt-16"
                  style={{ backgroundImage: "url('/images/board.png')" }}>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full h-[80%] overflow-y-auto py-4 pl-12 pr-4 scrollbar-hide">
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div key={task.id} 
                                 className="relative w-36 h-36 mx-auto bg-no-repeat bg-contain bg-center p-3 text-gray-800 transition-transform hover:scale-105 cursor-pointer"
                                 style={{ backgroundImage: "url('/images/group task.png')" }}>
                                <div className="mt-5 text-center px-2">
                                    <h3 className="text-[10px] font-bold leading-tight uppercase line-clamp-2">{task.title}</h3>
                                    <div className="mt-1 text-[9px] flex flex-col gap-0.5">
                                        <span className="text-purple-700">★ {task.xpReward} XP</span>
                                        <span className="text-yellow-700 font-bold">● {task.goldReward} G</span>
                                        {/* Відображаємо категорію, якщо вона є */}
                                        <span className="text-[7px] text-blue-600 font-bold uppercase">{task.category || "General"}</span>
                                        <span className="text-[7px] text-gray-500 italic">[{task.difficulty || "Normal"}]</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-white/50 py-10 flex flex-col items-center justify-center h-full">
                            <p className="text-xl text-[#5d4037]">Quest Log Empty</p>
                            <p className="text-sm text-[#5d4037]/70">Accept new quests to begin!</p>
                        </div>
                    )}
                </div>
            </main>

            {/* FOOTER (Кнопки) */}
            <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2 z-20">
                <button className="hover:brightness-110 active:scale-95 transition-transform"><img src="/images/Group shop.png" alt="Shop" className="h-20" /></button>
                <button onClick={() => setIsFormOpen(true)} className="hover:brightness-110 -translate-y-2 active:scale-95 transition-transform">
                    <img src="/images/Group create quest.png" alt="Create" className="h-24" />
                </button>
                <button className="hover:brightness-110 active:scale-95 transition-transform"><img src="/images/Group inventory.png" alt="Inv" className="h-20" /></button>
            </footer>

            {/* FORM MODAL (Створення завдання) */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 text-gray-900 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] relative">
                        
                        {/* Кнопка закриття */}
                        <button onClick={() => setIsFormOpen(false)} className="absolute top-2 right-2 text-[#5d4037] hover:text-red-700 font-bold text-xl">X</button>

                        <h2 className="text-xl mb-4 font-bold text-center uppercase tracking-tighter text-[#3e2723]">New Quest</h2>
                        
                        <form onSubmit={handleCreate} className="space-y-3">
                            {/* TITLE */}
                            <div className="relative">
                                <input name="title" placeholder="Quest Title" value={formData.title} onChange={handleChange} required 
                                       className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] outline-none placeholder:text-gray-400 focus:border-[#8d6e63]" />
                                {aiLoading && (
                                    <div className="absolute right-2 top-2 animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                                )}
                            </div>

                            {/* DESCRIPTION */}
                            <textarea name="description" placeholder="Details (optional)..." value={formData.description} onChange={handleChange}
                                      className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] h-16 outline-none text-sm resize-none focus:border-[#8d6e63]" />

                            {/* AI PREVIEW */}
                            {preview && (
                                <div className="bg-[#5d4037]/10 border-2 border-dashed border-[#5d4037] p-2 rounded-sm animate-fade-in">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-[#5d4037] uppercase">Rewards Preview</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-[#fdf5e6] border border-[#5d4037] p-0.5">
                                            <p className="text-[8px] text-gray-500 uppercase">Rank</p>
                                            <p className="text-xs font-bold text-purple-700">{preview.difficulty}</p>
                                        </div>
                                        <div className="bg-[#fdf5e6] border border-[#5d4037] p-0.5">
                                            <p className="text-[8px] text-gray-500 uppercase">XP</p>
                                            <p className="text-xs font-bold text-blue-700">+{preview.xpReward}</p>
                                        </div>
                                        <div className="bg-[#fdf5e6] border border-[#5d4037] p-0.5">
                                            <p className="text-[8px] text-gray-500 uppercase">Gold</p>
                                            <p className="text-xs font-bold text-yellow-700">+{preview.goldReward}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {/* TYPE SELECT */}
                                <div className="flex-1">
                                    <label className="block text-[9px] uppercase text-[#5d4037] font-bold mb-0.5">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-1.5 bg-[#fdf5e6] border-2 border-[#5d4037] text-sm">
                                        <option value="Daily">Daily</option>
                                        <option value="Main">Main</option>
                                    </select>
                                </div>

                                {/* CATEGORY SELECT */}
                                <div className="flex-1">
                                    <label className="block text-[9px] uppercase text-[#5d4037] font-bold mb-0.5">Stat / Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-1.5 bg-[#fdf5e6] border-2 border-[#5d4037] text-sm">
                                        {Object.values(TaskCategory).map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {/* DATE INPUT (Optional) */}
                             <div>
                                <label className="block text-[9px] uppercase text-[#5d4037] font-bold mb-0.5">Due Date (Optional)</label>
                                <input 
                                    type="date" 
                                    name="dueDate" 
                                    value={formData.dueDate} 
                                    onChange={handleChange}
                                    className="w-full p-1.5 bg-[#fdf5e6] border-2 border-[#5d4037] text-sm text-[#5d4037]"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="submit" disabled={aiLoading} 
                                        className="flex-1 bg-green-700 text-white p-2 border-b-4 border-green-900 active:border-b-0 active:translate-y-1 hover:bg-green-600 disabled:grayscale uppercase text-sm font-bold transition-all">
                                    Accept Quest
                                </button>
                                <button type="button" onClick={() => setIsFormOpen(false)} 
                                        className="flex-1 bg-red-700 text-white p-2 border-b-4 border-red-900 active:border-b-0 active:translate-y-1 hover:bg-red-600 uppercase text-sm font-bold transition-all">
                                    Decline
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}