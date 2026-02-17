'use client';

import React, { useState } from 'react';
import './InventoryModal.css';

type ItemType = 'hair' | 'top' | 'bottom' | 'eyes';
type Gender = 'male' | 'female';

interface GameItem {
    id: string;
    type: ItemType;
    gender: Gender;
    iconSrc: string;
    layerSrc: string;
}

// --- БАЗА ПРЕДМЕТОВ ---
const INVENTORY_ITEMS: GameItem[] = [
    // --- МУЖСКИЕ ПРЕДМЕТЫ ---
    { id: 'm_h1', type: 'hair', gender: 'male', iconSrc: '/images/male_hair_1.png', layerSrc: '/images/male_hair_1.png' },
    { id: 'm_h2', type: 'hair', gender: 'male', iconSrc: '/images/male_hair_2.png', layerSrc: '/images/male_hair_2.png' },

    // 👀 EYES (ГЛАЗА) - Вместо Gear
    { id: 'm_e1', type: 'eyes', gender: 'male', iconSrc: '/images/male_eyes_1.png', layerSrc: '/images/male_eyes_1.png' },
    { id: 'm_e2', type: 'eyes', gender: 'male', iconSrc: '/images/male_eyes_2.png', layerSrc: '/images/male_eyes_2.png' },

    { id: 'm_t1', type: 'top', gender: 'male', iconSrc: '/images/male_top_1.png', layerSrc: '/images/male_top_1.png' },
    { id: 'm_t2', type: 'top', gender: 'male', iconSrc: '/images/male_top_2.png', layerSrc: '/images/male_top_2.png' },

    { id: 'm_b1', type: 'bottom', gender: 'male', iconSrc: '/images/male_bottom_1.png', layerSrc: '/images/male_bottom_1.png' },
    { id: 'm_b2', type: 'bottom', gender: 'male', iconSrc: '/images/male_bottom_2.png', layerSrc: '/images/male_bottom_2.png' },

    // --- ЖЕНСКИЕ ПРЕДМЕТЫ ---
    { id: 'f_h1', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_1.png', layerSrc: '/images/female_hair_1.png' },
    { id: 'f_h2', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_2.png', layerSrc: '/images/female_hair_2.png' },

    // 👀 EYES (ГЛАЗА)
    { id: 'f_e1', type: 'eyes', gender: 'female', iconSrc: '/images/female_eyes_1.png', layerSrc: '/images/female_eyes_1.png' },
    { id: 'f_e2', type: 'eyes', gender: 'female', iconSrc: '/images/female_eyes_2.png', layerSrc: '/images/female_eyes_2.png' },

    { id: 'f_t1', type: 'top', gender: 'female', iconSrc: '/images/female_top_1.png', layerSrc: '/images/female_top_1.png' },
    { id: 'f_t2', type: 'top', gender: 'female', iconSrc: '/images/female_top_2.png', layerSrc: '/images/female_top_2.png' },

    { id: 'f_b1', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_1.png', layerSrc: '/images/female_bottom_1.png' },
    { id: 'f_b2', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_2.png', layerSrc: '/images/female_bottom_2.png' },
];

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InventoryModal({ isOpen, onClose }: InventoryModalProps) {
    const [activeTab, setActiveTab] = useState<ItemType>('hair');
    const [gender, setGender] = useState<Gender>('male');

    // Состояние надетых вещей
    const [equipped, setEquipped] = useState<{ [key in ItemType]: string | null }>({
        hair: null,
        eyes: null, // 🔄 Было gear
        top: null,
        bottom: null
    });

    if (!isOpen) return null;

    // Фильтр предметов (пол + вкладка)
    const currentItems = INVENTORY_ITEMS.filter(
        item => item.gender === gender && item.type === activeTab
    );

    // Клик по предмету
    const handleEquip = (item: GameItem) => {
        setEquipped(prev => ({
            ...prev,
            [item.type]: item.id === prev[item.type] ? null : item.id
        }));
    };

    // Получить картинку слоя
    const getLayerSrc = (type: ItemType) => {
        const id = equipped[type];
        if (!id) return null;
        return INVENTORY_ITEMS.find(i => i.id === id)?.layerSrc;
    };

    return (
        <div className="inventory-overlay">
            <button className="back-arrow-btn" onClick={onClose}>↩</button>

            <div className="inventory-layout">
                {/* --- ЛЕВАЯ ЧАСТЬ --- */}
                <div className="character-section">
                    <div className="gender-switch-container">
                        <button className={`gender-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>👨</button>
                        <button className={`gender-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>👩</button>
                    </div>

                    <div className="floating-island-container">
                        <img src="/images/island_big.png" className="preview-island" alt="island" />
                        
                        {/* --- ПЕРСОНАЖ (СЛОИ) --- */}
                        <div className="preview-character">
                             {/* 0. ТЕЛО */}
                             <img src={gender === 'male' ? "/images/male_base.png" : "/images/female_base.png"} className="doll-layer layer-base" alt="base" />
                             
                             {/* 1. ГЛАЗА (Поверх тела, но под волосами) */}
                             {getLayerSrc('eyes') && <img src={getLayerSrc('eyes')!} className="doll-layer layer-eyes" alt="eyes" />}

                             {/* 2. НИЗ (ШТАНЫ) */}
                             {getLayerSrc('bottom') && <img src={getLayerSrc('bottom')!} className="doll-layer layer-bottom" alt="bottom" />}

                             {/* 3. ВЕРХ (ТОП/БРОНЯ) */}
                             {getLayerSrc('top') && <img src={getLayerSrc('top')!} className="doll-layer layer-top" alt="top" />}

                             {/* 4. ВОЛОСЫ (САМЫЙ ВЕРХ) */}
                             {getLayerSrc('hair') && <img src={getLayerSrc('hair')!} className="doll-layer layer-hair" alt="hair" />}
                        </div>
                    </div>
                </div>

                {/* --- ПРАВАЯ ЧАСТЬ --- */}
                <div className="board-section">
                    <img src="/images/board.png" className="board-bg" alt="board" />
                    <div className="board-content">
                        {/* ТАБЫ */}
                        <div className="board-tabs">
                            {/* Порядок вкладок: Hair, Eyes, Top, Bottom */}
                            {(['hair', 'eyes', 'top', 'bottom'] as ItemType[]).map(tab => (
                                <button key={tab} className={`wood-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* СЕТКА */}
                        <div className="board-grid">
                            {currentItems.map(item => {
                                const isEquipped = equipped[item.type] === item.id;
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`wood-slot ${isEquipped ? 'equipped' : ''}`}
                                        onClick={() => handleEquip(item)}
                                    >
                                        <img src={item.iconSrc} alt="item" />
                                    </div>
                                );
                            })}
                            {[...Array(Math.max(0, 12 - currentItems.length))].map((_, i) => <div key={`empty-${i}`} className="wood-slot empty" />)}
                        </div>

                        <button className="wood-btn-create" onClick={onClose}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}