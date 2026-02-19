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
  Healer = 1,
  Warrior = 2,
  Crafter = 3,
  Mage = 4
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
  strength: number;
  intellect: number;
  dexterity: number;
  wisdom: number;
}

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

export interface CreateTaskRequest {
    title: string;
    description?: string;
    type: string;
    category: TaskCategory;
    dueDate?: string;
    xpReward?: number;      
    goldReward?: number;    
    difficulty?: string;    
}

export interface TaskComplexityResponse {
   difficulty: string;  
    category: string;    
    dueDate?: string;   
    
    xpReward: number;
    goldReward: number;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    type?: string;
    category?: TaskCategory;
    dueDate?: string;
}

export interface UserProfile {
    username: string;
    gold: number;
    xp: number;
    hp: number;
    level?: number;
    class?: AvatarClass;
    strength: number;
    intellect: number;
    dexterity: number;
    wisdom: number;
}

export interface CompleteTaskResponse {
    earnedGold: number;
    earnedXp: number;
}

