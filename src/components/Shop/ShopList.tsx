'use client';

import React, { useEffect, useState } from 'react';
import { shopService } from '@/services/shopService';
import { ShopItem } from '@/types/shop';
import { useRouter } from 'next/navigation';
// Імпорт стилів
import styles from './ShopList.module.css';

export const ShopList = () => {
    // Тестові дані (показуються, якщо сервер пустий або помилка)
    const DUMMY_ITEMS: ShopItem[] = Array.from({ length: 8 }).map((_, i) => ({
        id: `dummy-${i}`,
        name: "Test Item",
        price: 50,
        slot: "Hand",
        assetId: "null",
        class: "Any",
        isRecommended: false
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
            
            {/* Єдиний фон */}
            <div className={styles.background} />

            {/* Кнопка назад */}
            <button onClick={() => router.back()} className={styles.backButton}>
                 <img src="/images/shop/arrow.png" alt="Back" className={styles.backIcon} />
            </button>

            {/* Обгортка магазину */}
            <div className={styles.shopWrapper}>

                {/* 1. Ліхтарі */}
                <div className={styles.lanterns}> 
                    <img src="/images/shop/lanterns.png" alt="Lanterns" />
                </div>

                {/* 2. Вивіска */}
                <div className={styles.sign}>
                    <span className={styles.signText}>Shop</span>
                </div>

                {/* 3. Дошка */}
                <div className={styles.board}>
                    
                    {/* Сітка товарів */}
                    <div className={styles.grid}>
                        
                        {loading ? (
                             <div className={styles.loadingText}>Loading...</div>
                        ) : (
                            items.map((item, index) => (
                                <div key={item.id || index} className={styles.itemCard}>
                                    
                                    {/* Слот */}
                                    <div className={styles.slot}>
                                        {getImageUrl(item.assetId) && (
                                            <img 
                                                src={getImageUrl(item.assetId)!} 
                                                alt={item.name} 
                                                className={styles.itemImage} 
                                            />
                                        )}
                                    </div>

                                    {/* Інфо + Кнопка */}
                                    <div className={styles.itemInfo}>
                                        <div className={styles.priceTag}>
                                        <img src="/images/shop/coin.png" alt="coin" className={styles.coinIcon} />             
                                       <span>{item.price}</span>
                                        </div>
                                        <button onClick={() => handleBuy(item)} className={styles.buyButton}>
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Додаємо пусті слоти для краси, якщо товарів < 8 */}
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