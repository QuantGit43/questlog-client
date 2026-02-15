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

export enum AvatarClass {
  Warrior = 0,
  Mage = 1,
  Rogue = 2,
  Cleric = 3
}

export interface AvatarDto {
  id: string;
  userId: string;
  name?: string;
  class: AvatarClass;
  level: number;
  xp: number;
  hp: number;
  maxHP: number;
  gold: number;
  
  // Характеристики
  strength: number;
  intellect: number;
  dexterity: number;
  wisdom: number;
}

// 2. Основна сутність завдання
export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    type: string;       
    category?: TaskCategory; 
    
    xpReward: number;      
    goldReward: number;    
    
    difficulty: string;   
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
    xpReward?: number;      // Нагорода, яку порахував AI
    goldReward?: number;    // Золото, яке порахував AI
    difficulty?: string;    // Складність (Easy/Medium/Hard)
}

// 4. Відповідь від AI-аналізатора
export interface TaskComplexityResponse {
   difficulty: string;  // "Easy", "Medium", ...
    category: string;    // "Sport", "Career", ... (Приходить як рядок!)
    dueDate?: string;    // "2026-02-20T..."
    
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
    earnedGold: number;
    earnedXp: number;
}