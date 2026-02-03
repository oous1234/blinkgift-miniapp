import { apiRequest } from "../infrastructure/apiClient";
import {
  GiftItem,
  GiftSearchRequest,
  GiftShortResponse,
  PagedResponse,
  NewDetailedGiftResponse
} from "../types/inventory";
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

  static async searchGifts(request: GiftSearchRequest): Promise<PagedResponse<GiftShortResponse>> {
    try {
      return await apiRequest<PagedResponse<GiftShortResponse>>("/api/v1/search/gifts", "POST", request);
    } catch (error) {
      console.error("Search API failed", error);
      return { items: [], total: 0, limit: request.limit || 20, offset: request.offset || 0 };
    }
  }

  static async getGiftDetail(slug: string, num: number): Promise<GiftItem> {
    const data = await apiRequest<NewDetailedGiftResponse>(`/api/v1/gifts/${slug}-${num}`);

    // Атрибуты (модель, фон, символ)
    const attributes = [
      {
        trait_type: "Model",
        value: data.model || "Нет информации",
        rarity_percent: data.modelRare
      },
      {
        trait_type: "Backdrop",
        value: data.backdrop || "Нет информации",
        rarity_percent: data.backdropRare
      },
      {
        trait_type: "Symbol",
        value: data.symbol || "Нет информации",
        rarity_percent: data.symbolRare
      }
    ];

    // Рыночная статистика из объекта parameters
    const marketStats = Object.entries(data.parameters).map(([key, info]) => ({
      label: key === 'collection' ? "Весь тираж" : key.charAt(0).toUpperCase() + key.slice(1),
      items_count: info.amount,
      floor_price: info.floorPrice && info.floorPrice > 0 ? info.floorPrice : null,
      avg_price_30d: info.avg30dPrice,
      deals_count_30d: info.dealsCount30d,
      type: key
    }));

    // Собираем все последние продажи в один список для Drawer
    const allRecentSales: any[] = [];
    Object.entries(data.parameters).forEach(([category, info]) => {
      if (info.lastTrades) {
        info.lastTrades.forEach((trade) => {
          allRecentSales.push({
            id: `${trade.giftSlug}-${trade.date}`,
            name: trade.giftSlug,
            trait_value: trade.giftSlug.split('-')[0], // Имя подарка без номера
            price: trade.giftTonPrice,
            currency: "TON",
            date: new Date(trade.date).toLocaleDateString(),
            platform: trade.marketplace,
            avatar_url: `https://nft.fragment.com/gift/${trade.giftSlug.toLowerCase()}.webp`,
            filter_category: category === 'symbol' ? 'pattern' : category // Маппинг под категории Drawer
          });
        });
      }
    });

    return {
      id: data.giftSlug,
      giftId: String(data.giftNum),
      name: data.giftName,
      slug: slug,
      num: data.giftNum,
      image: data.giftAvatarLink,
      floorPrice: data.floorPriceTon || 0,
      estimatedPrice: data.estimatedPriceTon || 0,
      isOffchain: false,
      attributes: attributes,
      marketStats: marketStats as any,
      recentSales: allRecentSales,
      currency: "TON",
      collection: "Telegram Gifts",
      rarity: "NFT"
    };
  }

  static async getNftBlockchainDetails(giftId: string): Promise<NftExplorerDetails> {
    try {
      return await apiRequest<NftExplorerDetails>(`/api/v1/explorer/nft/${giftId}/history`, "GET");
    } catch (error) {
      console.error("Failed to fetch blockchain history", error);
      throw error;
    }
  }

  private static mapDtoToGift(dto: any): GiftItem {
    return {
      id: dto.slug + "-" + dto.num,
      giftId: dto.gift_id,
      name: dto.title,
      slug: dto.slug,
      num: dto.num,
      image: `https://nft.fragment.com/gift/${dto.slug}-${dto.num}.webp`,
      floorPrice: dto.gift_value?.model_floor?.average?.ton || 0,
      rarity: dto.num < 1000 ? "Legendary" : "Common",
      isOffchain: dto.is_offchain || false,
      collection: "Telegram Gifts",
      currency: "TON"
    };
  }
}