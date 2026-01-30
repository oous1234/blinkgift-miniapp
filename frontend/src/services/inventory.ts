import { apiRequest } from "../infrastructure/apiClient";
import { GiftItem } from "../types/inventory";
import { NftExplorerDetails } from "../types/explorer";

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
        total: Number(response.total) || 0,
        items: (response.items || []).map(this.mapDtoToGift)
      }
    } catch (error) {
      console.error("Failed to fetch items", error)
      return { total: 0, items: [] }
    }
  }

  static async getGiftDetail(slug: string, num: number): Promise<GiftItem> {
    // В большинстве случаев API для деталей находится по этому пути
    const data = await apiRequest<any>(`/api/v1/gifts/${slug}-${num}`);
    const gift = data.gift;

    return {
      id: gift.slug + "-" + gift.id, // Формируем ID как slug-number
      giftId: String(gift.id),
      name: gift.name,
      slug: gift.slug,
      num: gift.id,
      image: `https://nft.fragment.com/gift/${gift.slug}-${gift.id}.webp`,
      floorPrice: gift.estimated_price_ton || 0,
      estimatedPrice: gift.estimated_price_ton || 0,
      isOffchain: gift.is_offchain,
      ownerUsername: gift.owner?.username,
      attributes: data.attributes || [],
      // Добавляем эти поля, чтобы подгружалась аналитика
      marketStats: data.market_stats || [],
      recentSales: data.recent_sales || [],
    };
  }

  // Исправленный метод для получения истории (GetGems/Blockchain)
  static async getNftBlockchainDetails(giftId: string): Promise<NftExplorerDetails> {
    try {
      // Пытаемся вызвать эндпоинт истории.
      // Если ваш бэкенд ожидает путь /api/v1/..., используйте его:
      return await apiRequest<NftExplorerDetails>(`/api/v1/explorer/nft/${giftId}/history`, "GET");
    } catch (error) {
      console.error("Failed to fetch blockchain history", error);
      throw error;
    }
  }

  private static mapDtoToGift(dto: any): GiftItem {
    return {
      id: dto.slug + "-" + dto.num, // Важно для корректной работы истории
      giftId: dto.gift_id,
      name: dto.title,
      slug: dto.slug,
      num: dto.num,
      image: `https://nft.fragment.com/gift/${dto.slug}-${dto.num}.webp`,
      floorPrice: dto.gift_value?.model_floor?.average?.ton || 0,
      rarity: dto.num < 1000 ? "Legendary" : "Common",
      isOffchain: dto.is_offchain || false,
      collection: "Telegram Gifts"
    };
  }
}