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

export interface RecentSale {
  avatar_url: string
  currency: string
  date: string
  filter_category: "model" | "backdrop" | "pattern" | "model_backdrop"
  id: string
  name: string
  platform: string
  price: number
  trait_value: string
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
    is_offchain: boolean // НОВОЕ ПОЛЕ
  }
  market_stats: MarketStat[]
  recent_sales: RecentSale[]
}

export interface ApiGiftItem {
  id: string
  gift_id: string
  title: string
  slug: string
  num: number
  model_name: string
  url: string
  is_offchain?: boolean // НОВОЕ ПОЛЕ
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
  isOffchain: boolean // НОВОЕ ПОЛЕ
  attributes?: GiftAttribute[]
  marketStats?: MarketStat[]
  recentSales?: RecentSale[]
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