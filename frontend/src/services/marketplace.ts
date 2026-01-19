// frontend/src/services/marketplace.ts
import Settings from "@infrastructure/settings"
import { ApiMarketplaceItem, MarketplaceItem } from "../types/marketplace"

export default class MarketplaceService {
  private static getAuthToken(): string {
    return window.Telegram.WebApp.initData
  }

  static async getShowcase(): Promise<MarketplaceItem[]> {
    try {
      const response = await fetch(`${Settings.apiUrl()}/api/v1/marketplace/showcase`, {
        headers: {
          Authorization: this.getAuthToken(),
        },
      })

      if (!response.ok) throw new Error("Failed to fetch marketplace")

      const data: ApiMarketplaceItem[] = await response.json()

      return data.map((item) => ({
        ...item,
        // Генерация URL изображения на основе имени (как в Fragment)
        imageUrl: this.generateImageUrl(item.name),
      }))
    } catch (error) {
      console.error("MarketplaceService Error:", error)
      return []
    }
  }

  private static generateImageUrl(name: string): string {
    // Превращаем "B-Day Candle #248931" в "bdaycandle-248931"
    const slug = name.toLowerCase().replace(/#/g, "").replace(/\s+/g, "").replace(/\s/g, "-")
    return `https://nft.fragment.com/gift/${slug}.webp`
  }
}
