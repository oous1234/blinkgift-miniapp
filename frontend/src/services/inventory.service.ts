import { ApiClient } from "../infrastructure/api"
import { ApiDetailedGift, ApiGiftShort } from "../types/api"
import { Gift, PagedResponse } from "../types/domain"
import { mapDetailedGiftToDomain, mapApiGiftShortToDomain } from "../utils/mappers"

export const InventoryService = {
  async getInventory(ownerId: string, limit: number, offset: number) {
    const response = await ApiClient.get<{ items: ApiGiftShort[]; total: number }>("/inventory", {
      current_owner_id: ownerId,
      limit,
      offset
    })
    return {
      total: response.total,
      items: response.items.map(item => mapApiGiftShortToDomain(item))
    }
  },

  async searchGifts(params: any): Promise<PagedResponse<Partial<Gift>>> {
    const response = await ApiClient.post<PagedResponse<ApiGiftShort>>("/api/v1/search/gifts", params)
    return {
      ...response,
      items: response.items.map(item => mapApiGiftShortToDomain(item))
    }
  },

  async getGiftDetail(slug: string, num: number): Promise<Gift> {
    const data = await ApiClient.get<ApiDetailedGift>(`/api/v1/gifts/${slug}-${num}`)
    return mapDetailedGiftToDomain(data)
  },

  async getBlockchainHistory(giftId: string) {
    return ApiClient.get<any>(`/api/v1/explorer/nft/${giftId}/history`)
  }
}