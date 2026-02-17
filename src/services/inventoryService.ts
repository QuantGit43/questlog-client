import apiClient from '@/lib/apiClient';
import { BackendInventoryItem } from '@/types/inventory';

export const inventoryService = {
    // GET /api/Inventory
    async getAll(): Promise<BackendInventoryItem[]> {
        try {
            const response = await apiClient.get('/api/Inventory');
            
            // 1. Якщо бекенд повернув чистий масив []
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            // 2. Якщо бекенд повернув об'єкт з полем items (пагінація) { items: [] }
            if (response.data && Array.isArray(response.data.items)) {
                return response.data.items;
            }

            // 3. Якщо бекенд повернув об'єкт з полем value (інколи буває в .NET)
            if (response.data && Array.isArray(response.data.value)) {
                return response.data.value;
            }

            console.warn("Unexpected inventory response structure:", response.data);
            return []; // Повертаємо пустий масив, щоб не ламати сайт
        } catch (error) {
            console.error("Failed to load inventory:", error);
            return [];
        }
    },

    // POST /api/Inventory/equip
    async equip(itemId: string): Promise<void> {
        await apiClient.post('/api/Inventory/equip', { itemId });
    },

    // DELETE /api/Inventory
    async remove(itemId: string): Promise<void> {
        await apiClient.delete('/api/Inventory', {
            params: { itemId }
        });
    },

    // POST /api/Inventory/use
    async use(itemId: string): Promise<void> {
        await apiClient.post('/api/Inventory/use', { itemId });
    }
};