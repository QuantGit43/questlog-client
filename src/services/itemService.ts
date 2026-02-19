import apiClient from '@/lib/apiClient';
import { BackendItemDto } from '@/types/inventory';

export const itemService = {
    // GET /api/Item/shop
    async getShopItems(): Promise<BackendItemDto[]> {
        try {
            const response = await apiClient.get('/api/Item/shop');

            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.items)) return response.data.items;
            if (response.data && Array.isArray(response.data.value)) return response.data.value;

            console.warn("Unexpected shop response structure:", response.data);
            return [];
        } catch (error) {
            console.error("Failed to load shop items:", error);
            return [];
        }
    },

    async buy(itemId: string): Promise<void> {
        await apiClient.post('/api/Item/buy', { itemId });
    },

    // GET /api/Item
    async getAllItems(): Promise<BackendItemDto[]> {
        const response = await apiClient.get('/api/Item');
        
        if (Array.isArray(response.data)) return response.data;
        if (response.data && Array.isArray(response.data.items)) return response.data.items;
        
        return [];
    }
};

