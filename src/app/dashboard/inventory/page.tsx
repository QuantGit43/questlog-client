'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { inventoryService } from '@/services/inventoryService';
import { BackendInventoryItem, GameItemAsset, LayerType, Gender, EquipmentSlot } from '@/types/inventory';
// Стилі (переконайтеся, що файл існує)
import "@/components/Inventory/InventoryModal.css"; 

// --- ЛОКАЛЬНА БАЗА АСЕТІВ (Картинки) ---
// ВАЖЛИВО: поле `id` тут має точно співпадати зі значеннями MaleAssetId/FemaleAssetId в базі даних .NET
const INVENTORY_ASSETS: GameItemAsset[] = [
    // --- ЧОЛОВІЧІ ---
    { id: 'm_h1', type: 'hair', gender: 'male', iconSrc: '/images/male_hair_1.png', layerSrc: '/images/male_hair_1.png' },
    { id: 'm_h2', type: 'hair', gender: 'male', iconSrc: '/images/male_hair_2.png', layerSrc: '/images/male_hair_2.png' },
    { id: 'm_e1', type: 'eyes', gender: 'male', iconSrc: '/images/male_eyes_1.png', layerSrc: '/images/male_eyes_1.png' },
    { id: 'm_e2', type: 'eyes', gender: 'male', iconSrc: '/images/male_eyes_2.png', layerSrc: '/images/male_eyes_2.png' },
    { id: 'm_t1', type: 'top', gender: 'male', iconSrc: '/images/male_top_1.png', layerSrc: '/images/male_top_1.png' },
    { id: 'm_t2', type: 'top', gender: 'male', iconSrc: '/images/male_top_2.png', layerSrc: '/images/male_top_2.png' },
    { id: 'm_b1', type: 'bottom', gender: 'male', iconSrc: '/images/male_bottom_1.png', layerSrc: '/images/male_bottom_1.png' },
    { id: 'm_b2', type: 'bottom', gender: 'male', iconSrc: '/images/male_bottom_2.png', layerSrc: '/images/male_bottom_2.png' },

    // --- ЖІНОЧІ ---
    { id: 'f_h1', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_1.png', layerSrc: '/images/female_hair_1.png' },
    { id: 'f_h2', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_2.png', layerSrc: '/images/female_hair_2.png' },
    { id: 'f_e1', type: 'eyes', gender: 'female', iconSrc: '/images/female_eyes_1.png', layerSrc: '/images/female_eyes_1.png' },
    { id: 'f_e2', type: 'eyes', gender: 'female', iconSrc: '/images/female_eyes_2.png', layerSrc: '/images/female_eyes_2.png' },
    { id: 'f_t1', type: 'top', gender: 'female', iconSrc: '/images/female_top_1.png', layerSrc: '/images/female_top_1.png' },
    { id: 'f_t2', type: 'top', gender: 'female', iconSrc: '/images/female_top_2.png', layerSrc: '/images/female_top_2.png' },
    { id: 'f_b1', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_1.png', layerSrc: '/images/female_bottom_1.png' },
    { id: 'f_b2', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_2.png', layerSrc: '/images/female_bottom_2.png' },
];

export default function InventoryPage() {
    const router = useRouter();
    
    // UI State
    const [activeTab, setActiveTab] = useState<LayerType>('hair');
    const [gender, setGender] = useState<Gender>('male');
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [userItems, setUserItems] = useState<BackendInventoryItem[]>([]);
    
    // Візуальний стан (що зараз одягнуто на манекені)
    const [equippedCode, setEquippedCode] = useState<{ [key in LayerType]: string | null }>({
        hair: null, eyes: null, top: null, bottom: null
    });

    // --- ХЕЛПЕРИ ---

    // Мапінг C# Enum (0,1,2,3) -> Фронтенд типи ('hair', 'eyes'...)
    const mapSlotToType = (slot: EquipmentSlot): LayerType | null => {
        switch (slot) {
            case EquipmentSlot.Head: return 'hair';
            case EquipmentSlot.Eyes: return 'eyes';
            case EquipmentSlot.Chest: return 'top';
            case EquipmentSlot.Legs: return 'bottom';
            default: return null;
        }
    };

    // Отримати ID картинки залежно від статі (MaleAssetId або FemaleAssetId)
    const getAssetIdForGender = (item: BackendInventoryItem, currentGender: Gender): string | undefined => {
        return currentGender === 'male' ? item.item.maleAssetId : item.item.femaleAssetId;
    };

    // --- ЗАВАНТАЖЕННЯ ---
    useEffect(() => {
        loadInventory();
        // При зміні статі треба перерахувати візуал, бо MaleAssetId != FemaleAssetId
    }, [gender]); 

    const loadInventory = async () => {
        try {
            const data = await inventoryService.getAll();
            setUserItems(data);

            // Визначаємо, що одягнуто
            const newEquipped = { ...equippedCode };
            
            data.forEach(invRecord => {
                if (invRecord.isEquipped) {
                    const type = mapSlotToType(invRecord.item.slot);
                    if (type) {
                        const assetId = getAssetIdForGender(invRecord, gender);
                        if (assetId) {
                            newEquipped[type] = assetId;
                        }
                    }
                }
            });
            setEquippedCode(newEquipped);
        } catch (error) {
            console.error("Error loading inventory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => router.push('/dashboard');

    // --- ЛОГІКА ЕКІПІРУВАННЯ ---
    const handleEquip = async (asset: GameItemAsset) => {
        // Шукаємо в інвентарі предмет, який має цей AssetId
        const backendItem = userItems.find(u => getAssetIdForGender(u, gender) === asset.id);
        
        if (!backendItem) {
            console.warn("Item not found in inventory (sync error):", asset.id);
            return;
        }

        // Оптимістичне оновлення UI
        const prevEquipped = { ...equippedCode };
        const isCurrentlyEquipped = equippedCode[asset.type] === asset.id;

        setEquippedCode(prev => ({
            ...prev,
            [asset.type]: isCurrentlyEquipped ? null : asset.id
        }));

        try {
            // Відправляємо запит на сервер
            await inventoryService.equip(backendItem.id);
            
            // Оновлюємо локальний список (прапорці isEquipped)
            setUserItems(prev => prev.map(item => {
                // Якщо це інша річ того ж типу (наприклад, інша шапка) -> знімаємо
                if (item.item.slot === backendItem.item.slot && item.id !== backendItem.id) {
                    return { ...item, isEquipped: false };
                }
                // Якщо це наша річ -> перемикаємо
                if (item.id === backendItem.id) {
                    return { ...item, isEquipped: !isCurrentlyEquipped };
                }
                return item;
            }));

        } catch (error) {
            console.error("Equip failed:", error);
            setEquippedCode(prevEquipped); // Відкат при помилці
            alert("Failed to equip item.");
        }
    };

    // Фільтруємо асети для відображення:
    // 1. Тільки поточний таб і стать.
    // 2. Тільки ті, що Є в `userItems` (куплені).
    const displayItems = INVENTORY_ASSETS.filter(asset => {
        if (asset.gender !== gender || asset.type !== activeTab) return false;
        return userItems.some(u => getAssetIdForGender(u, gender) === asset.id);
    });

    // Отримати шлях до картинки шару
    const getLayerSrc = (type: LayerType) => {
        const code = equippedCode[type];
        return code ? INVENTORY_ASSETS.find(a => a.id === code)?.layerSrc : null;
    };

    if (isLoading) return <div className="min-h-screen bg-black/90 text-white flex items-center justify-center font-pixel">Loading Inventory...</div>;

    return (
        <div className="inventory-overlay" style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <button className="back-arrow-btn" onClick={handleClose}>↩</button>

            <div className="inventory-layout">
                {/* --- ЛІВА ЧАСТИНА (МАНЕКЕН) --- */}
                <div className="character-section">
                    <div className="gender-switch-container">
                        <button className={`gender-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>👨</button>
                        <button className={`gender-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>👩</button>
                    </div>

                    <div className="floating-island-container">
                        <img src="/images/island_big.png" className="preview-island" alt="island" />
                        <div className="preview-character">
                             <img src={gender === 'male' ? "/images/male_base.png" : "/images/female_base.png"} className="doll-layer layer-base" alt="base" />
                             
                             {getLayerSrc('eyes') && <img src={getLayerSrc('eyes')!} className="doll-layer layer-eyes" alt="eyes" />}
                             {getLayerSrc('bottom') && <img src={getLayerSrc('bottom')!} className="doll-layer layer-bottom" alt="bottom" />}
                             {getLayerSrc('top') && <img src={getLayerSrc('top')!} className="doll-layer layer-top" alt="top" />}
                             {getLayerSrc('hair') && <img src={getLayerSrc('hair')!} className="doll-layer layer-hair" alt="hair" />}
                        </div>
                    </div>
                </div>

                {/* --- ПРАВА ЧАСТИНА (СІТКА) --- */}
                <div className="board-section">
                    <img src="/images/board.png" className="board-bg" alt="board" />
                    <div className="board-content">
                        {/* Tabs */}
                        <div className="board-tabs">
                            {(['hair', 'eyes', 'top', 'bottom'] as LayerType[]).map(tab => (
                                <button key={tab} className={`wood-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="board-grid">
                            {displayItems.length > 0 ? (
                                displayItems.map(asset => {
                                    const isEquipped = equippedCode[asset.type] === asset.id;
                                    return (
                                        <div 
                                            key={asset.id} 
                                            className={`wood-slot ${isEquipped ? 'equipped' : ''}`}
                                            onClick={() => handleEquip(asset)}
                                        >
                                            <img src={asset.iconSrc} alt="item" />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center text-[#5d4037] font-pixel text-xs pt-10 opacity-70">
                                    Empty. Visit the Shop to buy items!
                                </div>
                            )}
                            
                            {/* Empty slots filler */}
                            {[...Array(Math.max(0, 12 - displayItems.length))].map((_, i) => <div key={`empty-${i}`} className="wood-slot empty" />)}
                        </div>

                        <button className="wood-btn-create" onClick={handleClose}>Save & Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}