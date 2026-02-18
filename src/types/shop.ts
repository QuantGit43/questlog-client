export interface ShopItem {
    id: string;
    name: string;
    price: number;
    slot: string;      // "Hair", "Top", "Gear"
    assetId: string;   // Назва картинки
    class: string;     // "Mage", "Warrior" або "Any"
    isRecommended: boolean; // Чи підходить цей предмет твоєму класу
}