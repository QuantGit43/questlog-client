import apiClient from "@/lib/apiClient";

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        // Важливо: бекенд має повертати це поле, щоб ми знали куди кидати юзера
        hasAvatar: boolean; 
    };
}

export const authService = {
    // Реєстрація
    async register(data: any) {
        return await apiClient.post("/api/auth/register", data);
    },

    // Вхід
    async login(data: any): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>("/api/auth/login", data);
        return response.data;
    },

    // Вибір класу (Створення аватара)
    async selectClass(classId: number, className: string) {
        // Припускаємо, що на бекенді є ендпоінт для створення аватара
        // Можливо, він називається /api/avatars
        const response = await apiClient.post("/api/avatars", { 
            classId: classId,
            className: className
        });
        return response.data;
    },

    // Вихід
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
};