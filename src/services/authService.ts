import apiClient from '@/lib/apiClient';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth';

export const authService = {
    async login(data: LoginRequest) {
        // Отримуємо відповідь від сервера
        const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
        
        // === ВАЖЛИВО: ЗБЕРІГАЄМО ТОКЕН ===
        // response.data — це об'єкт типу LoginResponse, де є поле token
        if (response.data && response.data.token) {
            localStorage.setItem('accessToken', response.data.token);
        }
        
        return response.data;
    },

    async register(data: RegisterRequest) {
        const response = await apiClient.post('/api/auth/register', data);
        return response.data;
    },

    // Корисно додати метод виходу
    logout() {
        localStorage.removeItem('accessToken');
        // Тут можна додати редірект на сторінку логіну
    }
};