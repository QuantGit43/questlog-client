import apiClient from '@/lib/apiClient';
import { 
    Task, 
    CreateTaskRequest, 
    UpdateTaskRequest, 
    TaskComplexityResponse,
    UserProfile,
    CompleteTaskResponse 
} from '@/types/tasks';

export const taskService = {
    // --- 1. ОТРИМАННЯ ВСІХ ЗАВДАНЬ ---
    async getAll(): Promise<Task[]> {
        // Переконайтеся, що URL відповідає вашому контролеру (api/tasks або api/task)
        const response = await apiClient.get('api/tasks');
        
        // Логіка для обробки різних форматів відповіді (PagedList або Array)
        if (response.data && Array.isArray(response.data.items)) {
            return response.data.items;
        }

        if (Array.isArray(response.data)) {
            return response.data;
        }

        return []; 
    },

    // --- 2. ПРОФІЛЬ ГРАВЦЯ (HP, Gold, XP) ---
    async getUserProfile(): Promise<UserProfile> {
        // ВАЖЛИВО: Цей ендпоінт має існувати на бекенді.
        // Зазвичай це в AvatarsController -> GetCurrentAvatar
        const response = await apiClient.get<UserProfile>('api/avatars/current'); 
        console.log("ПРОФІЛЬ З БЕКЕНДУ:", response.data);
        return response.data;
    },

    // --- 3. СТВОРЕННЯ ЗАВДАННЯ ---
    async create(data: CreateTaskRequest): Promise<Task> {
        const response = await apiClient.post<Task>('api/tasks', data);
        return response.data;
    },

    // --- 4. ОНОВЛЕННЯ ЗАВДАННЯ ---
    async update(id: string, data: UpdateTaskRequest): Promise<Task> {
        const response = await apiClient.put<Task>(`api/tasks/${id}`, data);
        return response.data;
    },

    // --- 5. ВИДАЛЕННЯ ЗАВДАННЯ ---
    async delete(id: string): Promise<void> {
        await apiClient.delete<void>(`api/tasks/${id}`);
    },

    // --- 6. AI АНАЛІЗ (Складність) ---
    async analyzeComplexity(title: string, description?: string): Promise<TaskComplexityResponse> {
        const response = await apiClient.post<TaskComplexityResponse>('api/tasks/analyze-complexity', { 
            title, 
            description 
        });
        return response.data;
    },

    // --- 7. ВИКОНАННЯ ЗАВДАННЯ ---
    // Повертає нові значення золота та XP
    async complete(id: string): Promise<CompleteTaskResponse> {
        const response = await apiClient.post<CompleteTaskResponse>(`api/tasks/${id}/complete`);
        return response.data;
    },
       
};