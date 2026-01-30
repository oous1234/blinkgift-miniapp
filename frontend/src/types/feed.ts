import { MarketplaceItem } from "./marketplace"
import { RecentSale } from "./inventory"

export type FeedEventType = "LISTING" | "SALE" | "PRICE_DROP"

export interface FeedEvent {
  id: string
  type: FeedEventType
  item: MarketplaceItem | RecentSale
  timestamp: number
  dealScore?: number // 0-100
  confidence: "LOW" | "MEDIUM" | "HIGH"
}