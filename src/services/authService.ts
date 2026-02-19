import apiClient from "@/lib/apiClient";
import { LoginResponse } from "@/types/auth";

export const authService = {
  async register(data: any) {
    return await apiClient.post("/api/auth/register", data);
  },

  async login(data: any): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      data,
    );

    return response.data;
  },
  async selectClass(id: number, className: string) {
    const response = await apiClient.post("/api/avatars", {
      class: id,
      className: className,
    });

    return response.data;
  },

  logout() {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/login";
  },
};


