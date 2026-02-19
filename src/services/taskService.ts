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
    async getAll(): Promise<Task[]> {
        const response = await apiClient.get('api/tasks');
        if (response.data && Array.isArray(response.data.items)) {
            return response.data.items;
        }

        if (Array.isArray(response.data)) {
            return response.data;
        }

        return []; 
    },

    async getUserProfile(): Promise<UserProfile> {
        const response = await apiClient.get<UserProfile>('api/avatars/current'); 
        return response.data;
    },

   async create(data: CreateTaskRequest): Promise<Task> {
    
    const response = await apiClient.post<Task>('api/tasks', data);
    return response.data;
},

    async update(id: string, data: UpdateTaskRequest): Promise<Task> {
        const response = await apiClient.put<Task>(`api/tasks/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete<void>(`api/tasks/${id}`);
    },

    async analyzeComplexity(title: string, description?: string): Promise<TaskComplexityResponse> {
        const response = await apiClient.post<TaskComplexityResponse>('api/tasks/analyze-complexity', { 
            title, 
            description 
        });
        return response.data;
    },

    async complete(id: string): Promise<CompleteTaskResponse> {
        const response = await apiClient.post<CompleteTaskResponse>(`api/tasks/${id}/complete`);
        return response.data;
    },    
};