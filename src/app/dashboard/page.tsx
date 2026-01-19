"use client"; //UI не є фінальним, і буде змінено пізніше

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest } from "@/types/tasks";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DashboardPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    // const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        type: "Daily", 
        xpReward: 10,
        goldReward: 5,
        dueDate: ""
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAll();
            console.log("Loaded tasks:", data); // Для дебагу
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            // setIsLoading(false);
        }
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
            const requestPayload = {
                ...formData,
                // ТИМЧАСОВО: фіксований avatarId, замініть на реальний ID користувача
                avatarId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" 
            };

            const newTask = await taskService.create(requestPayload);
            setTasks(prev => [...prev, newTask]);

            setFormData({
                title: "",
                description: "",
                type: "Daily",
                xpReward: 10,
                goldReward: 5,
                dueDate: ""
            });
        } catch (error) {
            console.error("Помилка створення", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await taskService.delete(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Помилка видалення", error);
        }
    };

    const handleToggle = async (task: Task) => {
        try {
            const updated = await taskService.update(task.id, { isCompleted: !task.isCompleted });
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isCompleted: updated.isCompleted } : t));
        } catch (error) {
            console.error("Помилка оновлення", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-4xl font-pixel mb-8 text-yellow-400">Quest Board</h1>

            <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
                <h2 className="text-xl mb-4 font-bold">New Quest</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Назва */}
                    <div className="md:col-span-2">
                        <Input 
                            name="title" 
                            placeholder="Quest Title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    {/* Опис */}
                    <div className="md:col-span-2">
                        <Input 
                            name="description" 
                            placeholder="Description (optional)" 
                            value={formData.description || ""} 
                            onChange={handleChange} 
                        />
                    </div>

                    {/* Тип завдання */}
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        className="bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    >
                        <option value="Daily">Daily Quest</option>
                        <option value="Habit">Habit / Routine</option> 
                        <option value="Main">Main Story</option>
                    </select>

                    {/* Нагороди */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-purple-400 font-bold">XP:</span>
                            <input 
                                type="number" 
                                name="xpReward" 
                                value={formData.xpReward} 
                                onChange={handleChange}
                                className="bg-gray-900 w-20 border border-gray-600 rounded p-2 text-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 font-bold">Gold:</span>
                            <input 
                                type="number" 
                                name="goldReward" 
                                value={formData.goldReward} 
                                onChange={handleChange}
                                className="bg-gray-900 w-20 border border-gray-600 rounded p-2 text-white"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Button type="submit" className="w-full">Post Quest</Button>
                    </div>
                </form>
            </div>

            {/* --- СПИСОК КВЕСТІВ --- */}
            <div className="space-y-4">
                {tasks.map((task) => (
                    <div 
                        key={task.id} 
                        className={`p-4 rounded-lg border flex justify-between items-center ${
                            task.isCompleted ? "bg-gray-900 border-gray-800 opacity-60" : "bg-gray-800 border-gray-600"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <input 
                                type="checkbox" 
                                checked={task.isCompleted}
                                onChange={() => handleToggle(task)}
                                className="w-6 h-6 accent-purple-500 cursor-pointer"
                            />
                            <div>
                                <h3 className={`font-bold text-lg ${task.isCompleted ? "line-through" : ""}`}>
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-400">{task.description}</p>
                                
                                <div className="flex gap-3 mt-2 text-xs font-bold">
                                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded">
                                        {task.type}
                                    </span>
                                    <span className="text-purple-300">
                                        ★ {task.xpReward} XP
                                    </span>
                                    <span className="text-yellow-300">
                                        ● {task.goldReward} Gold
                                    </span>
                                    {task.dueDate && (
                                        <span className="text-red-300">
                                            ⏳ {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleDelete(task.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors px-2"
                        >
                            ✕
                        </button>
                    </div>
                ))} 
            </div>
        </div>
    );
}