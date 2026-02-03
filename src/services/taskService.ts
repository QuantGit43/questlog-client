import apiClient from '@/lib/apiClient';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskComplexityResponse } from '@/types/tasks';

export const taskService = {
    // Отримати всі завдання
    async getAll() {
    const response = await apiClient.get('api/tasks');
    
    // 1. Дивимося в консоль, щоб точно знати структуру (для дебагу)
    console.log("API Response:", response.data);

    // 2. Якщо це PagedList (має поле items), повертаємо items
    if (response.data && Array.isArray(response.data.items)) {
        return response.data.items;
    }

    // 3. Якщо це PagedList (іноді називають list або data), перевіряємо інші варіанти
    // (Але зазвичай це items).
    
    // 4. Якщо це просто масив (раптом логіка зміниться)
    if (Array.isArray(response.data)) {
        return response.data;
    }

    // 5. Якщо нічого не підійшло - повертаємо пустий масив, щоб не ламати сайт
    return []; 
},

    // Створити нове завдання
    async create(data: CreateTaskRequest) {
        const response = await apiClient.post<Task>('api/tasks', data);
        return response.data;
    },

    // Оновити існуюче завдання
    async update(id: string, data: UpdateTaskRequest): Promise<Task> {
        // Виправлено: використано зворотні апострофи для інтерполяції
        const response = await apiClient.put<Task>(`api/tasks/${id}`, data);
        return response.data;
    },

    // Видалити завдання
    async delete(id: string) {
        await apiClient.delete<void>(`api/tasks/${id}`);
    },

    // МЕТОД ДЛЯ AI: Отримати превью складності та нагород
    async analyzeComplexity(title: string, description?: string) {
        const response = await apiClient.post<TaskComplexityResponse>('api/tasks/analyze-complexity', { 
            title, 
            description 
        });
        return response.data;
    }
};