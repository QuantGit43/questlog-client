"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest } from "@/types/tasks";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    // Стан форми
    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        type: "Daily",
        xpReward: 10,
        goldReward: 5,
        dueDate: ""
    });

    // Ефект для хедера (скрол)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        loadTasks();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <div className="h-screen w-screen overflow-hidden bg-cover bg-center font-pixel text-white relative" 
             style={{ backgroundImage: "url('/images/background.png')" }}>
            
            {/* Стилі для приховання скролбару */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* --- НОВИЙ HEADER (на основі LandingHeader) --- */}
            <header 
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b tracking-wide px-6
                    ${isScrolled 
                        ? "bg-[#2d1b4e]/80 backdrop-blur-md border-white/10 py-3 shadow-lg" 
                        : "bg-transparent border-transparent py-6"
                    }`}
            >
                <div className="container mx-auto flex justify-between items-center h-full">
                    {/* Логотип */}
                    <div className="flex items-center space-x-4 group cursor-pointer">
                         <span className="text-2xl drop-shadow-md transform group-hover:scale-105 transition-transform duration-200">
                            ⚔️ QuestLog
                        </span>
                    </div>

                    {/* Ігрові Стати (замість навігації Landing page, бо це Dashboard) */}
                    <div className="flex items-center gap-6">
                        {/* ХП (Hearts) */}
                        <div className="relative h-8 w-32">
                            <Image 
                                src="/images/Group hearts.png" 
                                alt="Hearts" 
                                fill
                                className="object-contain object-right"
                            />
                        </div>
                        
                        {/* Золото */}
                        <div className="flex items-center gap-2 text-yellow-400 text-xl drop-shadow-md">
                            <span>100</span>
                            <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-yellow-700 shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- ДОШКА ЗАВДАНЬ (Quest Board) --- */}
            {/* pt-24: відступ зверху, щоб не ховатися під фіксованим хедером 
                pb-32: великий відступ знизу, щоб візуально підняти дошку вище центру
            */}
            <main className="h-full w-full flex items-center justify-center pt-24 pb-32">
                <div className="relative max-w-4xl w-full aspect-[16/10] bg-no-repeat bg-contain bg-center flex items-center justify-center pl-8 pr-8"
                     style={{ backgroundImage: "url('/images/board.png')" }}>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full h-[80%] overflow-y-auto py-4 pl-12 pr-4 scrollbar-hide">
                        {tasks.map((task) => (
                            <div key={task.id} 
                                 className="relative w-36 h-36 mx-auto bg-no-repeat bg-contain bg-center p-3 text-gray-800 transition-transform hover:scale-105"
                                 style={{ backgroundImage: "url('/images/task paper.png')" }}>
                                
                                <Image 
                                    src="/images/pin.png" 
                                    alt="pin" 
                                    width={20} 
                                    height={20} 
                                    className="absolute -top-1 left-1/2 -translate-x-1/2" 
                                />
                                
                                <div className="mt-3 text-center">
                                    <h3 className="text-[10px] font-bold leading-tight uppercase line-clamp-2">{task.title}</h3>
                                    <div className="mt-1 text-[9px] flex flex-col gap-0.5">
                                        <span className="text-purple-700">★ {task.xpReward} XP</span>
                                        <span className="text-yellow-700">● {task.goldReward} G</span>
                                    </div>
                                </div>

                                <input 
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={() => {}}
                                    className="absolute bottom-3 right-3 w-3 h-3 accent-green-600 cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* --- НИЖНЯ НАВІГАЦІЯ --- */}
            <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2 z-40">
                <button className="hover:brightness-110 transition-all transform hover:-translate-y-1">
                    <Image src="/images/Group shop.png" alt="Shop" width={80} height={80} className="h-20 w-auto" />
                </button>
                
                <button onClick={() => setIsFormOpen(true)} className="hover:brightness-110 transition-all -translate-y-2 transform hover:-translate-y-3">
                    <Image src="/images/Group create quest.png" alt="Create" width={96} height={96} className="h-24 w-auto" />
                </button>

                <button className="hover:brightness-110 transition-all transform hover:-translate-y-1">
                    <Image src="/images/Group inventory.png" alt="Inventory" width={80} height={80} className="h-20 w-auto" />
                </button>
            </footer>

            {/* --- МОДАЛЬНЕ ВІКНО --- */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-[#c29b6d] border-4 border-[#5d4037] p-6 text-gray-900 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl mb-4 font-bold text-center uppercase">New Quest</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input name="title" placeholder="Quest Title" onChange={handleChange} required 
                                   className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] outline-none focus:border-purple-900 transition-colors" />
                            <select name="type" onChange={handleChange} className="w-full p-2 bg-[#fdf5e6] border-2 border-[#5d4037] outline-none">
                                <option value="Daily">Daily Quest</option>
                                <option value="Main">Main Story</option>
                            </select>
                            <div className="flex gap-4">
                                <input type="number" name="xpReward" placeholder="XP" onChange={handleChange} className="w-1/2 p-2 bg-[#fdf5e6] border-2 border-[#5d4037] outline-none" />
                                <input type="number" name="goldReward" placeholder="Gold" onChange={handleChange} className="w-1/2 p-2 bg-[#fdf5e6] border-2 border-[#5d4037] outline-none" />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="submit" className="flex-1 bg-green-700 text-white p-2 border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all uppercase hover:bg-green-600">Post</button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-red-700 text-white p-2 border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all uppercase hover:bg-red-600">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}