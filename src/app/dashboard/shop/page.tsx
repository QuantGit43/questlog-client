'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../context/GameContext'; 
import { itemService } from '@/services/itemService';
import { inventoryService } from '@/services/inventoryService';
import { GameItemAsset, LayerType, Gender, BackendItemDto } from '@/types/inventory';
import "@/components/Inventory/InventoryModal.css"; 

// --- ЛОКАЛЬНА БАЗА АСЕТІВ (Дублюємо або імпортуємо з data/assets.ts) ---
const SHOP_ASSETS: GameItemAsset[] = [
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

export default function ShopPage() {
    const router = useRouter();
    const { gold, addRewards } = useGame(); // Беремо золото з контексту
    
    const [activeTab, setActiveTab] = useState<LayerType>('hair');
    const [gender, setGender] = useState<Gender>('male');
    const [isLoading, setIsLoading] = useState(true);

    const [shopItems, setShopItems] = useState<BackendItemDto[]>([]); // Дані про товари (ціни)
    const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);   // ID куплених предметів
    
    // Preview (Тільки для примірки в магазині)
    const [previewEquipped, setPreviewEquipped] = useState<{ [key in LayerType]: string | null }>({
        hair: null, eyes: null, top: null, bottom: null
    });

    // --- ЗАВАНТАЖЕННЯ ---
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // 1. Отримуємо всі товари з бекенду (щоб знати ціни та IDs)
            const items = await itemService.getShopItems();
            setShopItems(items);

            // 2. Отримуємо інвентар користувача (щоб знати, що куплено)
            const myInventory = await inventoryService.getAll();
            // Зберігаємо ID предметів (Guid)
            setOwnedItemIds(myInventory.map(inv => inv.item.id));
            
            // Дефолтний вигляд для превью (наприклад, голий або стартовий сет)
            setPreviewEquipped({
                hair: 'm_h1', eyes: 'm_e1', top: 'm_t1', bottom: 'm_b1'
            });

        } catch (e) {
            console.error("Error loading shop:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => router.push('/dashboard');

    // --- ЛОГІКА КЛІКУ ПО ТОВАРУ ---
    const handleItemClick = async (asset: GameItemAsset) => {
        // Знаходимо Backend Item, що відповідає цьому асету
        const shopItem = shopItems.find(i => 
             (gender === 'male' ? i.maleAssetId : i.femaleAssetId) === asset.id
        );

        if (!shopItem) {
            console.warn("Item not configured in DB:", asset.id);
            return;
        }

        const isOwned = ownedItemIds.includes(shopItem.id);

        if (isOwned) {
            // Якщо куплено -> ПРИМІРЯТИ
            setPreviewEquipped(prev => ({ ...prev, [asset.type]: asset.id }));
        } else {
            // Якщо НЕ куплено -> КУПИТИ
            if (gold >= shopItem.price) {
                const confirm = window.confirm(`Buy this item for ${shopItem.price} Gold?`);
                if (confirm) {
                    try {
                        await itemService.buy(shopItem.id);
                        
                        // Успішна покупка:
                        setOwnedItemIds(prev => [...prev, shopItem.id]); // Додаємо в куплені
                        addRewards(-shopItem.price, 0, 0, 0); // Візуально знімаємо золото
                        setPreviewEquipped(prev => ({ ...prev, [asset.type]: asset.id })); // Одягаємо
                        
                        alert("Purchase successful!");
                    } catch (e) {
                        console.error("Buy failed:", e);
                        alert("Purchase failed. Try again.");
                    }
                }
            } else {
                alert(`Not enough gold! Price: ${shopItem.price}, You have: ${gold}`);
            }
        }
    };

    // Фільтр для відображення (ВСІ АСЕТИ для категорії)
    const displayItems = SHOP_ASSETS.filter(asset => asset.gender === gender && asset.type === activeTab);

    // Отримати картинку для шару
    const getLayerSrc = (type: LayerType) => {
        const code = previewEquipped[type];
        return code ? SHOP_ASSETS.find(a => a.id === code)?.layerSrc : null;
    };

    // Хелпери для UI
    const getPrice = (asset: GameItemAsset): number | null => {
        const item = shopItems.find(i => (gender === 'male' ? i.maleAssetId : i.femaleAssetId) === asset.id);
        return item ? item.price : null;
    };
    
    const checkIsOwned = (asset: GameItemAsset): boolean => {
        const item = shopItems.find(i => (gender === 'male' ? i.maleAssetId : i.femaleAssetId) === asset.id);
        return item ? ownedItemIds.includes(item.id) : false;
    };

    if (isLoading) return <div className="min-h-screen bg-black/90 text-white flex items-center justify-center font-pixel">Loading Shop...</div>;

    return (
        <div className="inventory-overlay" style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <button className="back-arrow-btn" onClick={handleClose}>↩</button>

            {/* Баланс золота */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border-2 border-[#5d4037]">
                <span className="text-yellow-400 font-bold text-xl">{gold}</span>
                <div className="w-5 h-5 bg-yellow-500 rounded-full border border-yellow-700 shadow-sm" />
            </div>

            <div className="inventory-layout">
                {/* DOLL PREVIEW */}
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

                {/* SHOP GRID */}
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
                            {displayItems.map(asset => {
                                const isOwned = checkIsOwned(asset);
                                const isEquipped = previewEquipped[asset.type] === asset.id;
                                const price = getPrice(asset);

                                return (
                                    <div 
                                        key={asset.id} 
                                        className={`wood-slot relative ${isEquipped ? 'equipped' : ''}`}
                                        onClick={() => handleItemClick(asset)}
                                    >
                                        {/* Якщо не куплено - робимо трохи прозорим */}
                                        <img src={asset.iconSrc} alt="item" className={!isOwned ? "opacity-90" : ""} />
                                        
                                        {/* ЦІННИК (Тільки якщо не куплено) */}
                                        {!isOwned && price !== null && (
                                            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1 border border-[#5d4037] shadow-sm pointer-events-none">
                                                <span className="text-yellow-400 text-[10px] font-bold font-pixel">{price}</span>
                                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full border border-yellow-700" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Empty slots filler */}
                            {[...Array(Math.max(0, 12 - displayItems.length))].map((_, i) => <div key={`empty-${i}`} className="wood-slot empty" />)}
                        </div>

                        <button className="wood-btn-create" onClick={handleClose}>Exit Shop</button>
                    </div>
                </div>
            </div>
        </div>
    );
}