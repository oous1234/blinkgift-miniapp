// src/services/marketplace.ts
import { apiRequest } from "../infrastructure/apiClient"
import { ApiMarketplaceItem, MarketplaceItem } from "../types/marketplace"

export default class MarketplaceService {
  static async getShowcase(): Promise<MarketplaceItem[]> {
    try {
      const data = await apiRequest<ApiMarketplaceItem[]>("/api/v1/marketplace/showcase")

      return data.map((item) => ({
        ...item,
        imageUrl: this.generateImageUrl(item.name),
      }))
    } catch (error) {
      console.error("MarketplaceService Error:", error)
      return []
    }
  }

  private static generateImageUrl(name: string): string {
    const slug = name.toLowerCase().replace(/#/g, "").replace(/\s+/g, "")
    return `https://nft.fragment.com/gift/${slug}.webp`
  }
}
