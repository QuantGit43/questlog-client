// 1. Enum для категорій (має збігатися з Backend)
export enum TaskCategory {
    None = 0,
    
    // Warrior
    Sport = 1,
    Career = 2,
    Discipline = 3,

    // Mage
    Education = 4,
    Reading = 5,
    Tech = 6,

    // Crafter
    Art = 7,
    Chores = 8,   
    Hobbies = 9,

    // Healer
    Health = 10,
    Family = 11,
    SelfCare = 12 
}

// 2. Основна сутність завдання
export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    type: string;          // "Daily", "Main"
    category?: TaskCategory; 
    
    xpReward: number;      
    goldReward: number;    
    
    difficulty: string;    // "Easy", "Medium", "Hard", "Epic"
    dueDate?: string;
    createdAt?: string;
}

// 3. Запит на створення
export interface CreateTaskRequest {
    title: string;
    description?: string;
    type: string;
    category: TaskCategory;
    dueDate?: string;
}

// 4. Відповідь від AI-аналізатора
export interface TaskComplexityResponse {
    difficulty: string;
    xpReward: number;   
    goldReward: number; 
}

// 5. Запит на оновлення
export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    type?: string;
    category?: TaskCategory;
    dueDate?: string;
}

// --- НОВІ ТИПИ (Додайте це, щоб виправити помилки) ---

// 6. Профіль користувача (для відображення зверху)
export interface UserProfile {
    username: string; // <--- Додано
    gold: number;
    xp: number;
    hp: number;
    level?: number;
}

// 7. Відповідь при виконанні завдання (нові баланси)
export interface CompleteTaskResponse {
    newGold: number;
    newXp: number;
    // Можна додати task, якщо бекенд повертає і саме завдання
    // task?: Task; 
}