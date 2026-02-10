export interface LoginRequest {
  email?: string;

  password?: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
  role: string;
  hasAvatar: boolean; // <-- Додайте цей рядок!
  // user: User;  <-- Цей рядок треба видалити, якщо бекенд більше не повертає вкладений об'єкт
}

export interface RegisterRequest {
  username?: string;

  email?: string;

  password?: string;
}
