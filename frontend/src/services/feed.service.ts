import MarketplaceService from "./marketplace"
import { FeedEvent } from "../types/feed"
import { apiRequest } from "../infrastructure/apiClient"

export interface SniperFilters {
  models?: string[]
  backdrops?: string[]
  symbols?: string[]
}

export default class FeedService {
  // Метод для получения пропущенных подарков из БД по фильтрам
  static async getSniperHistory(filters: SniperFilters): Promise<FeedEvent[]> {
    try {
      // Здесь мы вызываем эндпоинт, который должен возвращать историю сделок
      // Если бэкенд еще не готов, можно возвращать пустой массив или моки
      const data = await apiRequest<any[]>("/api/v1/marketplace/history", "POST", filters)

      return data.map(item => ({
        id: `history-${item.id}-${item.timestamp}`,
        type: "LISTING",
        item: {
          ...item,
          imageUrl: `https://nft.fragment.com/gift/${item.name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")}.webp`
        },
        timestamp: item.timestamp,
        dealScore: item.dealScore || 0,
        confidence: "HIGH"
      }))
    } catch (error) {
      console.error("Failed to fetch sniper history:", error)
      return []
    }
  }

  // Старый метод для общего фида (оставляем для совместимости)
  static async getLiveFeed(): Promise<FeedEvent[]> {
    const marketplaceItems = await MarketplaceService.getShowcase()
    return marketplaceItems.map(item => {
      const estimated = item.estimatedPrice || 0
      const price = parseFloat(item.price.toString())
      const diff = estimated - price
      const dealScore = estimated > 0 ? Math.max(0, Math.min(100, (diff / estimated) * 100)) : 0
      return {
        id: `listing-${item.id}`,
        type: "LISTING",
        item: item,
        timestamp: Date.now(),
        dealScore: Math.round(dealScore),
        confidence: estimated > 0 ? "HIGH" : "LOW"
      }
    })
  }
}