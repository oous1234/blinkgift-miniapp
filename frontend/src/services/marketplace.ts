import { apiRequest } from "../infrastructure/apiClient"
import { MarketplaceItem } from "../types"

export default class MarketplaceService {
  static async getShowcase(): Promise<MarketplaceItem[]> {
    const data = await apiRequest<any[]>("/api/v1/marketplace/showcase")
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      marketplace: item.marketplace,
      imageUrl: this.generateImageUrl(item.name)
    }))
  }

  private static generateImageUrl(name: string): string {
    const slug = name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")
    return `https://nft.fragment.com/gift/${slug}.webp`
  }
}