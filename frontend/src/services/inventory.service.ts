import { apiClient } from "../infrastructure/apiClient";
import { Mappers } from "../utils/mappers";
import { ApiDetailedGift, ApiInventoryItem, ApiSearchResponse } from "../types/apiDto";
import { Gift } from "../types/domain";

export const InventoryService = {
  async getInventory(ownerId: string, limit = 10, offset = 0) {
    const response = await apiClient.get<ApiSearchResponse<ApiInventoryItem>>("/inventory", {
      current_owner_id: ownerId,
      limit,
      offset,
    });

    return {
      total: response.total,
      items: (response.items || []).map(Mappers.mapInventoryItem),
    };
  },

  async getGiftDetail(slug: string, num: number): Promise<Gift> {
    const id = `${slug}-${num}`;
    const data = await apiClient.get<ApiDetailedGift>(`/api/v1/gifts/${id}`);
    return Mappers.mapDetailedGift(data);
  },

  async searchGifts(params: any) {
    const response = await apiClient.post<ApiSearchResponse<ApiInventoryItem>>("/api/v1/search/gifts", params);

    return {
      total: response.total || 0,
      items: (response.items || []).map(Mappers.mapInventoryItem),
    };
  },

  async getBlockchainHistory(giftId: string): Promise<any> {
    return apiClient.get<any>(`/api/v1/explorer/nft/${giftId}/history`);
  }
};