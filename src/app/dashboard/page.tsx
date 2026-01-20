"use client";

import { useState, useEffect } from "react";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest } from "@/types/tasks";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        type: "Daily",
        xpReward: 10,
        goldReward: 5,
        dueDate: ""
    });

    useEffect(() => { loadTasks(); }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) { console.error(error); }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "xpReward" || name === "goldReward" ? Number(value) : value
        }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const requestPayload = { ...formData, avatarId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" };
            const newTask = await taskService.create(requestPayload);
            setTasks(prev => [...prev, newTask]);
            setFormData({ title: "", description: "", type: "Daily", xpReward: 10, goldReward: 5, dueDate: "" });
            setIsFormOpen(false);
        } catch (error) { console.error("Помилка створення", error); }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-cover bg-center p-4 font-pixel text-white relative" 
             style={{ backgroundImage: "url('/images/background.png')" }}>
            
            {/* Стилі для приховання скролбару */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* --- ВЕРХНЯ ПАНЕЛЬ (Header) --- */}
            <header className="flex justify-between items-start max-w-5xl mx-auto mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    {/* ЛОГОТИП: Замінено текст на SVG */}
                    <img 
                        src="/icons/logo.svg" 
                        alt="QuestLog Logo" 
                        className="h-10 w-auto drop-shadow-md hover:scale-105 transition-transform" 
                    />
                </div>

                <div className="flex flex-col items-end gap-2">
                    {/* ХП (Hearts) */}
                    <img src="/images/Group hearts.png" alt="Hearts" className="h-8 object-contain" />
                    
                    {/* Золото */}
                    <div className="flex items-center gap-2 text-yellow-400 text-xl">
                        <span>100</span>
                        <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
                    </div>
                </div>
            </header>

            {/* --- ДОШКА ЗАВДАНЬ (Quest Board) --- */}
           {/* --- ДОШКА ЗАВДАНЬ (Quest Board) --- */}
            <main className="relative max-w-4xl mx-auto aspect-[16/10] bg-no-repeat bg-contain bg-center flex items-center justify-center pt-10 pb-10 pl-8 pr-8 -mt-16"
                  style={{ backgroundImage: "url('/images/board.png')" }}>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full h-[80%] overflow-y-auto py-4 pl-12 pr-4 scrollbar-hide">
                    {tasks.map((task) => (
                        <div key={task.id} 
                             // ЗМІНА 1: Оновлено backgroundImage на 'group task.png'
                             className="relative w-36 h-36 mx-auto bg-no-repeat bg-contain bg-center p-3 text-gray-800 transition-transform hover:scale-105"
                             style={{ backgroundImage: "url('/images/group task.png')" }}>
                            
                            {/* ЗМІНА 2: Видалено окреме зображення піна (<img>), бо воно тепер на фоні */}
                            
                            {/* ЗМІНА 3: Збільшено відступ зверху (mt-5 замість mt-3), щоб текст не налізав на намальований пін */}
                            <div className="mt-5 text-center">
                                <h3 className="text-[10px] font-bold leading-tight uppercase line-clamp-2">{task.title}</h3>
                                <div className="mt-1 text-[9px] flex flex-col gap-0.5">
                                    <span className="text-purple-700">★ {task.xpReward} XP</span>
                                    <span className="text-yellow-700">● {task.goldReward} G</span>
                                </div>
                            </div>

                            {/* ЗМІНА 4: Видалено <input type="checkbox">, бо він тепер намальований на фоні */}
                        </div>
                    ))}
                </div>
            </main>

            {/* --- НИЖНЯ НАВІГАЦІЯ --- */}
            <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2 z-20">
                <button className="hover:brightness-110 transition-all">
                    <img src="/images/Group shop.png" alt="Shop" className="h-20" />
                </button>
                
                <button onClick={() => setIsFormOpen(true)} className="hover:brightness-110 transition-all -translate-y-2">
                    <img src="/images/Group create quest.png" alt="Create" className="h-24" />
                </button>

                <button className="hover:brightness-110 transition-all">
                    <img src="/images/Group inventory.png" alt="Inventory" className="h-20" />
                </button>
            </footer>

            {/* --- МОДАЛЬНЕ ВІКНО СТВОРЕННЯ (Стилізоване) --- */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 text-gray-900 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                        <h2 className="text-2xl mb-4 font-bold text-center uppercase">New Quest</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input name="title" placeholder="Quest Title" onChange={handleChange} required 
                                   className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] outline-none" />
                            <select name="type" onChange={handleChange} className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037]">
                                <option value="Daily">Daily Quest</option>
                                <option value="Main">Main Story</option>
                            </select>
                            <div className="flex gap-4">
                                <input type="number" name="xpReward" placeholder="XP" onChange={handleChange} className="w-1/2 p-2 bg-[#fdf5e6] border-2 border-[#5d4037]" />
                                <input type="number" name="goldReward" placeholder="Gold" onChange={handleChange} className="w-1/2 p-2 bg-[#fdf5e6] border-2 border-[#5d4037]" />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="submit" className="flex-1 bg-green-700 text-white p-2 border-b-4 border-green-900 active:border-b-0 uppercase">Post</button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-red-700 text-white p-2 border-b-4 border-red-900 active:border-b-0 uppercase">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}