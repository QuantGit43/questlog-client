import apiClient from '@/lib/apiClient';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth';

export const authService = {
    async login(data: LoginRequest) {
        const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
        return response.data;
    },

    async register(data: RegisterRequest) {
        const response = await apiClient.post('/api/auth/register', data);
        return response.data;
    }
};