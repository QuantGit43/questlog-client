'use client';

import React, { useState } from 'react';
import '@/components/Inventory/InventoryModal.css';

type ItemType = 'hair' | 'top' | 'bottom' | 'eyes';
type Gender = 'male' | 'female';

interface GameItem {
    id: string;
    type: ItemType;
    gender: Gender;
    iconSrc: string; 
    layerSrc: string;
    customStyle?: React.CSSProperties; 
}

const INVENTORY_ITEMS: GameItem[] = [
    { 
        id: 'male_hair_1', type: 'hair', gender: 'male', iconSrc: '/images/male_hair_1.png', layerSrc: '/images/male_hair_1.png',
        customStyle: { width: '100%', top: '0%', left: '4.5%' }
    },
    { id: 'male_hair_2', type: 'hair', gender: 'male', iconSrc: '/images/male_hair_2.png', layerSrc: '/images/male_hair_2.png' },
    { 
        id: 'male_eyes_1', type: 'eyes', gender: 'male', iconSrc: '/images/male_eyes_1.png', layerSrc: '/images/male_eyes_1.png',
        customStyle: { width: '100%', top: '0%', left: '4%' }
    },
    { 
        id: 'male_eyes_2', type: 'eyes', gender: 'male', iconSrc: '/images/male_eyes_2.png', layerSrc: '/images/male_eyes_2.png',
        customStyle: { width: '100%', top: '0%', left: '-2.5%' }
    },
    { 
        id: 'male_bottom_1', type: 'bottom', gender: 'male', iconSrc: '/images/male_bottom_1.png', layerSrc: '/images/male_bottom_1.png',
        customStyle: { width: '60%', left: '25%', top: '12%' }
    },
    { 
        id: 'male_bottom_2', type: 'bottom', gender: 'male', iconSrc: '/images/male_bottom_2.png', layerSrc: '/images/male_bottom_2.png',
        customStyle: { width: '70%', left: '15%', top: '12%' }
    },
    { 
        id: 'male_bottom_3', type: 'bottom', gender: 'male', iconSrc: '/images/male_bottom_3.png', layerSrc: '/images/male_bottom_3.png',
        customStyle: { width: '62%', left: '15%', top: '12%' }
    },
    { id: 'male_top_1', type: 'top', gender: 'male', iconSrc: '/images/male_top_1.png', layerSrc: '/images/male_top_1.png' },
    { id: 'male_top_2', type: 'top', gender: 'male', iconSrc: '/images/male_top_2.png', layerSrc: '/images/male_top_2.png' },
    { id: 'male_top_3', type: 'top', gender: 'male', iconSrc: '/images/male_top_3.png', layerSrc: '/images/male_top_3.png' },
    { id: 'male_top_4', type: 'top', gender: 'male', iconSrc: '/images/male_top_4.png', layerSrc: '/images/male_top_4.png' },
    { id: 'male_top_5', type: 'top', gender: 'male', iconSrc: '/images/male_top_5.png', layerSrc: '/images/male_top_5.png' },
    { id: 'male_top_6', type: 'top', gender: 'male', iconSrc: '/images/male_top_6.png', layerSrc: '/images/male_top_6.png' },
    { id: 'female_hair_1', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_1.png', layerSrc: '/images/female_hair_1.png' },
    { id: 'female_hair_2', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_2.png', layerSrc: '/images/female_hair_2.png' },
    { id: 'female_hair_3', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_3.png', layerSrc: '/images/female_hair_3.png' },
    { id: 'female_hair_4', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_4.png', layerSrc: '/images/female_hair_4.png' },
    { id: 'female_hair_5', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_5.png', layerSrc: '/images/female_hair_5.png' },
    { id: 'female_hair_6', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_6.png', layerSrc: '/images/female_hair_6.png' },
    { id: 'female_hair_7', type: 'hair', gender: 'female', iconSrc: '/images/female_hair_7.png', layerSrc: '/images/female_hair_7.png' },
    { 
        id: 'female_eyes_1', type: 'eyes', gender: 'female', iconSrc: '/images/female_eyes_1.png', layerSrc: '/images/female_eyes_1.png',
        customStyle: { width: '70%', top: '-8%', left: '15%' } 
    },
    { 
        id: 'female_eyes_2', type: 'eyes', gender: 'female', iconSrc: '/images/female_eyes_2.png', layerSrc: '/images/female_eyes_2.png',
        customStyle: { top: '0%', left: '-2%' } 
    },
    { 
        id: 'female_eyes_3', type: 'eyes', gender: 'female', iconSrc: '/images/female_eyes_3.png', layerSrc: '/images/female_eyes_3.png',
        customStyle: { top: '0%', left: '4%' } 
    },
    { 
        id: 'female_bottom_1', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_1.png', layerSrc: '/images/female_bottom_1.png',
        customStyle: { width: '70%', left: '15%', top: '12%' } 
    },
    { 
        id: 'female_bottom_2', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_2.png', layerSrc: '/images/female_bottom_2.png',
        customStyle: { width: '70%', left: '15%', top: '12%' } 
    },
    { 
        id: 'female_bottom_3', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_3.png', layerSrc: '/images/female_bottom_3.png',
        customStyle: { width: '70%', left: '15%', top: '12%' } 
    },
    { 
        id: 'female_bottom_4', type: 'bottom', gender: 'female', iconSrc: '/images/female_bottom_4.png', layerSrc: '/images/female_bottom_4.png',
        customStyle: { width: '70%', left: '15%', top: '12%' } 
    },
    { 
        id: 'female_top_1', type: 'top', gender: 'female', iconSrc: '/images/female_top_1.png', layerSrc: '/images/female_top_1.png',
        customStyle: { left: '2%' } 
    },
    { id: 'female_top_2', type: 'top', gender: 'female', iconSrc: '/images/female_top_2.png', layerSrc: '/images/female_top_2.png' },
    { id: 'female_top_3', type: 'top', gender: 'female', iconSrc: '/images/female_top_3.png', layerSrc: '/images/female_top_3.png' },
    { id: 'female_top_4', type: 'top', gender: 'female', iconSrc: '/images/female_top_4.png', layerSrc: '/images/female_top_4.png' },
    { id: 'female_top_5', type: 'top', gender: 'female', iconSrc: '/images/female_top_5.png', layerSrc: '/images/female_top_5.png' },
];

export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState<ItemType>('hair');
    const [gender, setGender] = useState<Gender>('male');

    const [equipped, setEquipped] = useState<{ [key in ItemType]: string | null }>({
        hair: null,
        eyes: null,
        top: null,
        bottom: null
    });

    const currentItems = INVENTORY_ITEMS.filter(
        item => item.gender === gender && item.type === activeTab
    );

    const handleEquip = (item: GameItem) => {
        setEquipped(prev => ({
            ...prev,
            [item.type]: item.id === prev[item.type] ? null : item.id
        }));
    };

    const getEquippedItem = (type: ItemType) => {
        const id = equipped[type];
        if (!id) return null;
        return INVENTORY_ITEMS.find(i => i.id === id);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="inventory-overlay">
            <button className="back-arrow-btn" onClick={handleBack}>↩</button>

            <div className="inventory-layout">
                <div className="character-section">
                    <div className="gender-switch-container">
                        <button className={`gender-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>👨</button>
                        <button className={`gender-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>👩</button>
                    </div>

                    <div className="floating-island-container">
                        <img src="/images/island_big.png" className="preview-island" alt="island" />
                        
                        <div className="preview-character">
                             <img 
                                src={gender === 'male' ? "/images/male_base.png" : "/images/female_base.png"} 
                                className="doll-layer layer-base" 
                                alt="base" 
                             />
                             
                             {(() => {
                                 const item = getEquippedItem('eyes');
                                 return item ? (
                                     <img 
                                        src={item.layerSrc} 
                                        className="doll-layer layer-eyes" 
                                        alt="eyes"
                                        style={item.customStyle || {}} 
                                     />
                                 ) : null;
                             })()}

                             {(() => {
                                 const item = getEquippedItem('bottom');
                                 return item ? (
                                     <img 
                                        src={item.layerSrc} 
                                        className="doll-layer layer-bottom" 
                                        alt="bottom"
                                        style={item.customStyle || {}} 
                                     />
                                 ) : null;
                             })()}

                             {(() => {
                                 const item = getEquippedItem('top');
                                 return item ? (
                                     <img 
                                        src={item.layerSrc} 
                                        className="doll-layer layer-top" 
                                        alt="top"
                                        style={item.customStyle || {}} 
                                     />
                                 ) : null;
                             })()}

                             {(() => {
                                 const item = getEquippedItem('hair');
                                 return item ? (
                                     <img 
                                        src={item.layerSrc} 
                                        className="doll-layer layer-hair" 
                                        alt="hair"
                                        style={item.customStyle || {}} 
                                     />
                                 ) : null;
                             })()}
                        </div>
                    </div>
                </div>

                <div className="board-section">
                    <img src="/images/board.png" className="board-bg" alt="board" />
                    <div className="board-content">
                        <div className="board-tabs">
                            {(['hair', 'eyes', 'top', 'bottom'] as ItemType[]).map(tab => (
                                <button key={tab} className={`wood-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

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

                        <button className="wood-btn-create" onClick={handleBack}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}