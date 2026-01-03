export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    type: string;        // Було tasktype
    xpReward: number;    // Було xpreward
    goldReward: number;  // Було goldreward
    dueDate?: string;    // Було duedate
    createdAt?: string;  // Корисно додати
}

// Також варто оновити CreateTaskRequest, щоб він відповідав тому, що чекає бекенд
export interface CreateTaskRequest {
    title: string;
    description?: string;
    type: string;
    xpReward: number;
    goldReward: number;
    dueDate?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    tasktype?: string;
    xpreward?: number;
    goldreward?: number;
    duedate?: string;
}

