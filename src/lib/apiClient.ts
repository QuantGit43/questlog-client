import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// === ДОДАЄМО АВТОМАТИЧНУ АВТОРИЗАЦІЮ ===
apiClient.interceptors.request.use(
    (config) => {
        // Перевіряємо, чи ми у браузері, перед доступом до localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;