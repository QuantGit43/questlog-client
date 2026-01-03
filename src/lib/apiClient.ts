import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000', // Ваша адреса бекенду
    headers: {
        'Content-Type': 'application/json',
    },
});

// === ДОДАЄМО АВТОМАТИЧНУ АВТОРИЗАЦІЮ ===
apiClient.interceptors.request.use(
    (config) => {
        // Перевіряємо, чи ми у браузері, перед доступом до localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            
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