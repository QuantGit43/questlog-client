"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/taskService";
import { Task, CreateTaskRequest } from "@/types/task"; // Імпортуємо твої типи
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DashboardPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Стейт для форми створення (об'єднали в один об'єкт)
    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: "",
        description: "",
        tasktype: "Daily", // Значення за замовчуванням
        xpreward: 10,
        goldreward: 5,
        duedate: ""
    });

    // 1. Завантаження
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) {
            // Тут можна додати перевірку на 401
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Обробка полів вводу
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "xpreward" || name === "goldreward" ? Number(value) : value
        }));
    };

    // 3. Створення квесту
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newTask = await taskService.create(formData);
            setTasks([...tasks, newTask]); // Додаємо в список
            
            // Скидаємо форму до початкових значень
            setFormData({
                title: "",
                description: "",
                tasktype: "Daily",
                xpreward: 10,
                goldreward: 5,
                duedate: ""
            });
        } catch (error) {
            console.error("Помилка створення", error);
        }
    };

    // 4. Видалення
    const handleDelete = async (id: string) => {
        await taskService.delete(id);
        setTasks(tasks.filter(t => t.id !== id));
    };

    // 5. Завершення (Check)
    const handleToggle = async (task: Task) => {
        const updated = await taskService.update(task.id, { isCompleted: !task.isCompleted });
        setTasks(tasks.map(t => t.id === task.id ? updated : t));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-4xl font-pixel mb-8 text-yellow-400">Quest Board</h1>

            {/* --- ФОРМА СТВОРЕННЯ --- */}
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
                            value={formData.description} 
                            onChange={handleChange} 
                        />
                    </div>

                    {/* Тип завдання */}
                    <select 
                        name="tasktype" 
                        value={formData.tasktype} 
                        onChange={handleChange}
                        className="bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    >
                        <option value="Daily">Daily Quest</option>
                        <option value="Weekly">Weekly Raid</option>
                        <option value="Main">Main Story</option>
                    </select>

                    {/* Дата */}
                    <input 
                        type="date" 
                        name="duedate"
                        value={formData.duedate}
                        onChange={handleChange}
                        className="bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    />

                    {/* Нагороди */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-purple-400 font-bold">XP:</span>
                            <input 
                                type="number" name="xpreward" 
                                value={formData.xpreward} onChange={handleChange}
                                className="bg-gray-900 w-20 border border-gray-600 rounded p-2"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 font-bold">Gold:</span>
                            <input 
                                type="number" name="goldreward" 
                                value={formData.goldreward} onChange={handleChange}
                                className="bg-gray-900 w-20 border border-gray-600 rounded p-2"
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
                    <div key={task.id} className={`p-4 rounded-lg border flex justify-between items-center ${
                        task.isCompleted ? "bg-gray-900 border-gray-800 opacity-60" : "bg-gray-800 border-gray-600"
                    }`}>
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
                                
                                {/* Бейджі з нагородами */}
                                <div className="flex gap-3 mt-2 text-xs font-bold">
                                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded">
                                        {task.tasktype}
                                    </span>
                                    <span className="text-purple-300">
                                        ★ {task.xpreward} XP
                                    </span>
                                    <span className="text-yellow-300">
                                        ● {task.goldreward} Gold
                                    </span>
                                    {task.duedate && (
                                        <span className="text-red-300">
                                            ⏳ {new Date(task.duedate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleDelete(task.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}