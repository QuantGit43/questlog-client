"use client";

import { useState, useEffect, useCallback } from "react";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest, TaskComplexityResponse } from "@/types/tasks";
import debounce from "lodash/debounce";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // AI Стан для відображення превью
    const [aiLoading, setAiLoading] = useState(false);
    const [preview, setPreview] = useState<TaskComplexityResponse | null>(null);

    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        type: "Daily",
        dueDate: ""
    });

    // Завантаження завдань при старті
    useEffect(() => { 
        const loadTasks = async () => {
            try {
                const data = await taskService.getAll();
                setTasks(data);
            } catch (error) {
                console.error("Failed to load tasks:", error);
            }
        };
        loadTasks(); 
    }, []);

    // AI Аналіз: Викликається через 1 сек після зупинки вводу
    // ВИПРАВЛЕННЯ 1: Додано '?' до desc, щоб дозволити undefined
    const fetchAiComplexity = useCallback(
        debounce(async (title: string, desc?: string) => {
            if (title.length < 5) {
                setPreview(null);
                return;
            }
            setAiLoading(true);
            try {
                // Передаємо desc або пустий рядок, якщо він undefined
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            
            // Запускаємо AI аналіз тільки для тексту
            if (name === "title" || name === "description") {
                // ВИПРАВЛЕННЯ 2: Використання '?? ""' гарантує, що ми завжди передаємо рядок
                const titleToSend = name === "title" ? value : (updated.title ?? "");
                const descToSend = name === "description" ? value : (updated.description ?? "");

                fetchAiComplexity(titleToSend, descToSend);
            }
            return updated;
        });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newTask = await taskService.create(formData);
            setTasks(prev => [...prev, newTask]);
            
            // Скидання форми
            setFormData({ title: "", description: "", type: "Daily", dueDate: "" });
            setPreview(null);
            setIsFormOpen(false);
        } catch (error) { 
            console.error("Error creating quest:", error); 
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-cover bg-center p-4 font-pixel text-white relative" 
             style={{ backgroundImage: "url('/images/background.png')" }}>
            
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* --- ВЕРХНЯ ПАНЕЛЬ --- */}
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

            {/* --- ДОШКА ЗАВДАНЬ --- */}
            <main className="relative max-w-4xl mx-auto aspect-[16/10] bg-no-repeat bg-contain bg-center flex items-center justify-center pt-10 pb-10 pl-8 pr-8 -mt-16"
                  style={{ backgroundImage: "url('/images/board.png')" }}>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full h-[80%] overflow-y-auto py-4 pl-12 pr-4 scrollbar-hide">
                    {tasks.map((task) => (
                        <div key={task.id} 
                             className="relative w-36 h-36 mx-auto bg-no-repeat bg-contain bg-center p-3 text-gray-800 transition-transform hover:scale-105"
                             style={{ backgroundImage: "url('/images/group task.png')" }}>
                            <div className="mt-5 text-center px-2">
                                <h3 className="text-[10px] font-bold leading-tight uppercase line-clamp-2">{task.title}</h3>
                                <div className="mt-1 text-[9px] flex flex-col gap-0.5">
                                    <span className="text-purple-700">★ {task.xpReward} XP</span>
                                    <span className="text-yellow-700 font-bold">● {task.goldReward} G</span>
                                    <span className="text-[7px] text-gray-500 italic">[{task.difficulty}]</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- НАВІГАЦІЯ --- */}
            <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2 z-20">
                <button className="hover:brightness-110"><img src="/images/Group shop.png" alt="Shop" className="h-20" /></button>
                <button onClick={() => setIsFormOpen(true)} className="hover:brightness-110 -translate-y-2">
                    <img src="/images/Group create quest.png" alt="Create" className="h-24" />
                </button>
                <button className="hover:brightness-110"><img src="/images/Group inventory.png" alt="Inv" className="h-20" /></button>
            </footer>

            {/* --- МОДАЛЬНЕ ВІКНО --- */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 text-gray-900 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                        <h2 className="text-xl mb-4 font-bold text-center uppercase tracking-tighter">New Quest</h2>
                        
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="relative">
                                <input name="title" placeholder="What is your task?" value={formData.title} onChange={handleChange} required 
                                       className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] outline-none placeholder:text-gray-400" />
                                {aiLoading && (
                                    <div className="absolute right-2 top-2 animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                                )}
                            </div>

                            <textarea name="description" placeholder="Add details for better AI evaluation..." value={formData.description} onChange={handleChange}
                                      className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] h-20 outline-none text-sm resize-none" />

                            {/* СЕКЦІЯ НАГОРОД */}
                            <div className="bg-[#5d4037]/10 border-2 border-dashed border-[#5d4037] p-3 rounded-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-[#5d4037] uppercase">AI Assessment</span>
                                    {aiLoading && <span className="text-[8px] animate-pulse text-blue-700">Analyzing...</span>}
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    {/* RANK */}
                                    <div className="bg-[#fdf5e6] border border-[#5d4037] p-1">
                                        <p className="text-[8px] text-gray-500 uppercase">Rank</p>
                                        <p className="text-xs font-bold text-purple-700">{preview?.difficulty || "—"}</p>
                                    </div>
                                    
                                    {/* XP - ВИПРАВЛЕНО ТУТ */}
                                    <div className="bg-[#fdf5e6] border border-[#5d4037] p-1">
                                        <p className="text-[8px] text-gray-500 uppercase">XP</p>
                                        {/* Замінив preview?.xp на preview?.xpReward */}
                                        <p className="text-xs font-bold text-blue-700">{preview?.xpReward || 0}</p>
                                    </div>
                                    
                                    {/* GOLD - ВИПРАВЛЕНО ТУТ */}
                                    <div className="bg-[#fdf5e6] border border-[#5d4037] p-1">
                                        <p className="text-[8px] text-gray-500 uppercase">Gold</p>
                                        {/* Замінив preview?.gold на preview?.goldReward */}
                                        <p className="text-xs font-bold text-yellow-700">{preview?.goldReward || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037]">
                                <option value="Daily">Daily Quest</option>
                                <option value="Main">Main Story</option>
                            </select>

                            <div className="flex gap-2 pt-2">
                                <button type="submit" disabled={aiLoading} 
                                        className="flex-1 bg-green-700 text-white p-2 border-b-4 border-green-900 active:border-b-0 hover:bg-green-600 disabled:grayscale uppercase text-sm">
                                    Accept
                                </button>
                                <button type="button" onClick={() => setIsFormOpen(false)} 
                                        className="flex-1 bg-red-700 text-white p-2 border-b-4 border-red-900 active:border-b-0 hover:bg-red-600 uppercase text-sm">
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