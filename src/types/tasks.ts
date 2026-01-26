export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    type: string;
    xpReward: number;
    goldReward: number;
    difficulty: string; // Додано для відображення складності від AI
    dueDate?: string;
    createdAt?: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    type: string;
    // Нагороди прибираємо, бо їх тепер призначає бекенд через AI
    dueDate?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    type?: string;
    xpReward?: number;
    goldReward?: number;
    dueDate?: string;
}

export interface TaskComplexityResponse {
    difficulty: string;
    xpReward: number;   // Було xp
    goldReward: number; // Було gold
}