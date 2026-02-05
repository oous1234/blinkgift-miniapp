import { apiClient } from "../infrastructure/apiClient";
import { Mappers } from "../utils/mappers";
import { ApiDetailedGift } from "../types/apiDto";
import { Gift } from "../types/domain";

export const InventoryService = {
  // Получение инвентаря пользователя
  async getInventory(ownerId: string, limit = 10, offset = 0) {
    const response = await apiClient.get<{ items: any[]; total: number }>("/inventory", {
      current_owner_id: ownerId,
      limit,
      offset,
    });

    return {
      total: response.total,
      items: (response.items || []).map(Mappers.mapInventoryItem),
    };
  },

  // ЧИСТЫЙ МЕТОД: Берем ID как он есть и идем в API
  async getGiftDetail(id: string): Promise<Gift> {
    if (!id) throw new Error("Gift ID is required");

    const data = await apiClient.get<ApiDetailedGift>(`/api/v1/gifts/${id}`);
    return Mappers.mapDetailedGift(data);
  },

  // Поиск подарков
  async searchGifts(params: any) {
    const response = await apiClient.post<{ items: any[]; total: number }>("/api/v1/search/gifts", params);
    return {
      total: response.total || 0,
      items: (response.items || []).map(Mappers.mapInventoryItem),
    };
  },

  // История транзакций из блокчейна
  async getBlockchainHistory(giftId: string) {
    return apiClient.get<any>(`/api/v1/explorer/nft/${giftId}/history`);
  }
};