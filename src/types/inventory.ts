export type LayerType = 'hair' | 'eyes' | 'top' | 'bottom';
export type Gender = 'male' | 'female';

export enum EquipmentSlot {
    Head = 0,
    Eyes = 1,
    Chest = 2,
    Legs = 3
}

export interface BackendItemDto {
    id: string;             
    name: string;
    description: string;
    price: number;
    type: number;           
    slot: EquipmentSlot;   
    effectValue?: number;
    maleAssetId?: string;   
    femaleAssetId?: string; 
}

export interface BackendInventoryItem {
    id: string;             
    isEquipped: boolean;  
    quantity: number;
    item: BackendItemDto;   
}

export interface GameItemAsset {
    id: string;             
    type: LayerType;
    gender: Gender;
    iconSrc: string;
    layerSrc: string;
}

