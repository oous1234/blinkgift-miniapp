import { apiRequest } from "../infrastructure/apiClient";
import { GiftItem, GiftAttribute } from "../types";

export default class InventoryService {
  static async getItems(limit: number, offset: number, ownerId?: string) {
    try {
      const targetId = ownerId || window.Telegram.WebApp.initDataUnsafe?.user?.id?.toString() || "8241853306"

      const response = await apiRequest<{ items: any[]; total: number }>("/inventory", "GET", null, {
        current_owner_id: targetId,
        limit: String(limit),
        offset: String(offset),
      })

      return {
        total: Number(response.total) || 0, // Принудительно в число
        items: (response.items || []).map(this.mapDtoToGift)
      }
    } catch (error) {
      console.error("Failed to fetch items", error)
      return { total: 0, items: [] } // Возвращаем пустую структуру при ошибке
    }
  }

  static async getGiftDetail(slug: string, num: number): Promise<GiftItem> {
    const data = await apiRequest<any>(`/api/v1/gifts/${slug}-${num}`);
    const gift = data.gift;

    return {
      id: gift.slug,
      giftId: String(gift.id),
      name: gift.name,
      slug: gift.slug,
      num: gift.id,
      image: `https://nft.fragment.com/gift/${gift.slug}-${gift.id}.webp`,
      floorPrice: gift.estimated_price_ton,
      estimatedPrice: gift.estimated_price_ton,
      isOffchain: gift.is_offchain,
      ownerUsername: gift.owner?.username,
      attributes: data.attributes,
    };
  }

  private static mapDtoToGift(dto: any): GiftItem {
    return {
      id: dto.id,
      giftId: dto.gift_id,
      name: dto.title,
      slug: dto.slug,
      num: dto.num,
      image: `https://nft.fragment.com/gift/${dto.slug}-${dto.num}.webp`,
      floorPrice: dto.gift_value?.model_floor?.average?.ton || 0,
      rarity: dto.num < 1000 ? "Legendary" : "Common",
      isOffchain: dto.is_offchain || false,
    };
  }
}