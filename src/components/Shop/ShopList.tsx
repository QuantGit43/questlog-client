'use client';

import React, { useEffect, useState } from 'react';
import { shopService } from '@/services/shopService';
import { ShopItem } from '@/types/shop';
import { useRouter } from 'next/navigation';
import styles from './ShopList.module.css';

// Прапорець: true = показуємо напис "Coming Soon", false = показуємо товари
const IS_COMING_SOON = true; 

export const ShopList = () => {
    // Тестові дані
    const DUMMY_ITEMS: ShopItem[] = Array.from({ length: 8 }).map((_, i) => ({
        id: `dummy-${i}`, name: "Test Item", price: 50, slot: "Hand", assetId: "null", class: "Any", isRecommended: false
    }));

    const [items, setItems] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadShop = async () => {
            try {
                const data = await shopService.getAllItems();
                if (!data || data.length === 0) {
                    setItems(DUMMY_ITEMS);
                } else {
                    setItems(data);
                }
            } catch (error) {
                console.error("Shop error:", error);
                setItems(DUMMY_ITEMS);
            } finally {
                setLoading(false);
            }
        };
        loadShop();
    }, []);

    const handleBuy = async (item: ShopItem) => {
        if (IS_COMING_SOON) return; 

        if (item.id.startsWith('dummy')) {
            alert("This is a demo item!");
            return;
        }
        if (confirm(`Buy ${item.name} for ${item.price} Gold?`)) {
            try {
                await shopService.buyItem(item.id);
                alert("Purchased!");
            } catch (e) {
                alert("Not enough gold!");
            }
        }
    };

    const getImageUrl = (assetId: string) => 
        (assetId && assetId !== 'null') ? `/assets/items/${assetId}.png` : null;

    return (
        <div className={styles.container}>
            {/* Фон */}
            <div className={styles.background} />

            {/* Кнопка "Назад" (як в Інвентарі) */}
            <button className={styles.backArrowBtn} onClick={() => router.back()}>
                ↩
            </button>

            <div className={styles.shopWrapper}>

                {/* Ліхтарі */}
                <div className={styles.lanterns}> 
                    <img src="/images/shop/lanterns.png" alt="Lanterns" />
                </div>

                {/* Вивіска */}
                <div className={styles.sign}>
                    <span className={styles.signText}>Shop</span>
                </div>

                {/* Дошка */}
                <div className={styles.board}>
                    
                    {/* --- COMING SOON НАПИС --- */}
                    {IS_COMING_SOON && (
                        <div className={styles.comingSoonOverlay}>
                            <h2 className={styles.comingSoonTitle}>COMING SOON</h2>
                        </div>
                    )}

                    {/* Сітка товарів (прихована або під низом, якщо Coming Soon) */}
                    <div className={styles.grid} style={{ opacity: IS_COMING_SOON ? 0.1 : 1 }}>
                        
                        {loading ? (
                             <div className={styles.loadingText}>Loading...</div>
                        ) : (
                            items.map((item, index) => (
                                <div key={item.id || index} className={styles.itemCard}>
                                    <div className={styles.slot}>
                                        {getImageUrl(item.assetId) && (
                                            <img 
                                                src={getImageUrl(item.assetId)!} 
                                                alt={item.name} 
                                                className={styles.itemImage} 
                                            />
                                        )}
                                    </div>

                                    <div className={styles.itemInfo}>
                                        <div className={styles.priceTag}>
                                            <img src="/images/shop/coin.png" alt="coin" className={styles.coinIcon} />            
                                           <span>{item.price}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleBuy(item)} 
                                            className={styles.buyButton}
                                            disabled={IS_COMING_SOON}
                                        >
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {!loading && items.length < 8 && Array.from({ length: 8 - items.length }).map((_, i) => (
                             <div key={`empty-${i}`} className={styles.emptySlot}>
                                <div className={styles.slot} />
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};