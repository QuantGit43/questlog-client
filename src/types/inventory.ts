// src/types/inventory.ts

// Типи шарів для візуалізації на фронтенді (Таби)
export type LayerType = 'hair' | 'eyes' | 'top' | 'bottom';
export type Gender = 'male' | 'female';

// Enum слотів (Має співпадати з C# QuestLog.Domain.Enums.EquipmentSlot)
// Припустимо: 0=Head, 1=Eyes, 2=Chest, 3=Legs.
// Якщо у тебе інші цифри в C#, зміни їх тут!
export enum EquipmentSlot {
    Head = 0,
    Eyes = 1,
    Chest = 2,
    Legs = 3
}

// C# ItemDto
export interface BackendItemDto {
    id: string;             // Guid ItemId
    name: string;
    description: string;
    price: number;
    type: number;           // Enum ItemType (int)
    slot: EquipmentSlot;    // Enum EquipmentSlot (int)
    effectValue?: number;
    maleAssetId?: string;   // "m_h1"
    femaleAssetId?: string; // "f_h1"
}

// C# InventoryDto
export interface BackendInventoryItem {
    id: string;             // Guid InventoryRecordId (для equip/delete)
    isEquipped: boolean;    // Стан екіпірування
    quantity: number;
    item: BackendItemDto;   // Вкладений об'єкт предмета
}

// Локальний тип для бази картинок (Assets)
export interface GameItemAsset {
    id: string;             // Це має співпадати з ItemCode в базі даних .NET (MaleAssetId/FemaleAssetId)
    type: LayerType;
    gender: Gender;
    iconSrc: string;
    layerSrc: string;
}