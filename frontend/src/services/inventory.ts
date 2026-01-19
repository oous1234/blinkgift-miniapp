// src/services/inventory.ts
import { apiRequest } from "../infrastructure/apiClient"
import {
  InventoryResponse,
  InventoryServiceResponse,
  ApiGiftItem,
  GiftItem,
} from "../types/inventory"

export default class InventoryService {
  static async getItems(
    limit: number,
    offset: number,
    ownerId?: string
  ): Promise<InventoryServiceResponse> {
    const targetId =
      ownerId || window.Telegram.WebApp.initDataUnsafe?.user?.id?.toString() || "8241853306"

    // Просто передаем чистые данные, apiClient сам добавит tgauth
    const data = await apiRequest<InventoryResponse>("/inventory", "GET", null, {
      current_owner_id: targetId,
      limit: limit.toString(),
      offset: offset.toString(),
    })

    return {
      items: data.items.map(this.mapDtoToModel),
      total: data.total,
      limit: data.limit,
      offset: data.offset,
    }
  }

  private static mapDtoToModel(dto: ApiGiftItem): GiftItem {
    const address = `${dto.slug}-${dto.num}`
    return {
      id: dto.id,
      giftId: dto.gift_id,
      name: dto.title,
      collection: dto.model_name,
      image: `https://nft.fragment.com/gift/${address}.webp`,
      floorPrice: dto.gift_value?.model_floor?.average?.ton || 0,
      currency: "TON",
      quantity: 1,
      rarity: dto.num < 1000 ? "Legendary" : "Common",
      num: dto.num,
    }
  }
}
