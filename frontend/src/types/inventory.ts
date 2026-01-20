export interface GiftAttribute {
  rarity_percent: number
  trait_type: string
  value: string
}

export interface MarketStat {
  avg_price_30d: number
  deals_count_30d: number
  floor_price: number | null
  items_count: number
  label: string
  type: string
}

export interface DetailedGiftResponse {
  attributes: GiftAttribute[]
  gift: {
    currency: string
    estimated_price_ton: number
    id: number
    name: string
    owner: {
      username: string
    }
    slug: string
  }
  market_stats: MarketStat[]
}

export interface ApiGiftItem {
  id: string
  gift_id: string
  title: string
  slug: string
  num: number
  model_name: string
  url: string
  gift_value?: {
    model_floor?: {
      average?: {
        ton: number
      }
    }
  }
}

export interface GiftItem {
  id: string
  giftId: string
  name: string
  collection: string
  image: string
  rarity: string
  floorPrice: number
  currency: string
  num: number
  // Поля для детальной информации
  attributes?: GiftAttribute[]
  marketStats?: MarketStat[]
  estimatedPrice?: number
  ownerUsername?: string
}

export interface InventoryResponse {
  items: ApiGiftItem[]
  total: number
  limit: number
  offset: number
}

export interface InventoryServiceResponse {
  items: GiftItem[]
  total: number
  limit: number
  offset: number
}
