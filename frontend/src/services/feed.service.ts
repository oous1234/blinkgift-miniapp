import MarketplaceService from "./marketplace"
import { FeedEvent } from "../types/feed"

export default class FeedService {
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