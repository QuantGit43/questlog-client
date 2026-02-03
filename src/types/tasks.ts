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

// 2. Основна сутність завдання (те, що приходить у списку)
export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    type: string;          // "Daily", "Main"
    category?: TaskCategory; // Категорія (може бути необов'язковою, якщо старі завдання її не мають)
    
    xpReward: number;      
    goldReward: number;    
    
    difficulty: string;    // "Easy", "Medium", "Hard", "Epic"
    dueDate?: string;
    createdAt?: string;
}

// 3. Запит на створення (тільки те, що вводить користувач)
export interface CreateTaskRequest {
    title: string;
    description?: string;
    type: string;
    category: TaskCategory; // <--- Тепер це обов'язкове поле
    dueDate?: string;
}

// 4. Відповідь від AI-аналізатора (для превью у формі)
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