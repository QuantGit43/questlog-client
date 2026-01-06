import apiClient from '@/lib/apiClient';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/tasks';

    export const taskService = {

        async getAll() {
            const response = await apiClient.get<Task[]>('api/tasks/');
            return response.data;
        },

        async create(data:CreateTaskRequest) {
            const responce = await apiClient.post<Task>('api/tasks', data);
            return responce.data;
        },

        async update(id: string, data: UpdateTaskRequest) :Promise<Task> {
            const responce = await apiClient.put<Task>('api/tasks/${data.id}', data);
            return responce.data;
        },

        async delete(id:string) {
            await apiClient.delete<void>(`/api/tasks/${id}`);
        }
    };
    
