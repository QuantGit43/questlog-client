import apiClient from "@/lib/apiClient";
import { LoginResponse } from "@/types/auth";

export const authService = {
  // Реєстрація

  async register(data: any) {
    return await apiClient.post("/api/auth/register", data);
  },

  // Вхід

  async login(data: any): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      data,
    );

    return response.data;
  },

  // Вибір класу (Створення аватара)

  async selectClass(id: number, className: string) {
    // Припускаємо, що на бекенді є ендпоінт для створення аватара

    // Можливо, він називається /api/avatars

    const response = await apiClient.post("/api/avatars", {
      class: id,
      className: className,
    });

    return response.data;
  },

  // Вихід

  logout() {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/login";
  },
};
