import { apiClient } from "../infrastructure/apiClient";
import { Mappers } from "../utils/mappers";
import { ApiDetailedGift, ApiInventoryItem, ApiSearchResponse } from "../types/apiDto";
import { Gift } from "../types/domain";
import { InventoryResponse } from "../types/inventory";

export const InventoryService = {
  async getInventory(userId: string, limit = 50, offset = 0): Promise<InventoryResponse> {
    return await apiClient.get<InventoryResponse>("/api/v1/inventory", {
      user_id: userId,
      limit,
      offset,
    });
  },

  async getGiftDetail(giftId: string): Promise<Gift> {
    const data = await apiClient.get<ApiDetailedGift>(`/api/v1/gifts/${giftId}`);
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