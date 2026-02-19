import apiClient from '@/lib/apiClient';
import { ShopItem } from '@/types/shop';

export const shopService = {
    getAllItems: async () => {
        const response = await apiClient.get<{ items: ShopItem[] }>('/api/Item/shop');
        return response.data.items;
    },

    buyItem: async (itemId: string) => {
        const response = await apiClient.post(`/api/Item/buy/${itemId}`);
        return response.data;
    }
};

