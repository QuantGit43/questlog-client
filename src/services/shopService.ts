import apiClient from '@/lib/apiClient';
import { ShopItem } from '@/types/shop';

export const shopService = {
    // Отримати список товарів
    getAllItems: async () => {
        const response = await apiClient.get<{ items: ShopItem[] }>('/api/Item/shop');
        return response.data.items;
    },

    // Купити товар (на майбутнє)
    buyItem: async (itemId: string) => {
        const response = await apiClient.post(`/api/Item/buy/${itemId}`);
        return response.data;
    }
};