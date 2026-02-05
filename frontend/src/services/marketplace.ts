import { apiClient } from "../infrastructure/apiClient";
import { ASSETS } from "../config/constants";
import { MarketplaceItem } from "../types/domain"; // Используем наш новый тип

export default class MarketplaceService {
  static async getShowcase(): Promise<MarketplaceItem[]> {
    const data = await apiClient.get<any[]>("/api/v1/marketplace/showcase");

    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      marketplace: item.marketplace,
      imageUrl: ASSETS.FRAGMENT_GIFT(item.name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, ""))
    }));
  }
}