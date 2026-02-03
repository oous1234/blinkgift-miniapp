export interface TradeItem {
  giftSlug: string
  giftTonPrice: number
  marketplace: string
  date: string
}

export interface ParameterInfo {
  amount: number
  floorPrice: number | null
  avg30dPrice: number
  dealsCount30d: number
  lastTrades: TradeItem[]
}

export interface NewDetailedGiftResponse {
  giftSlug: string
  giftName: string
  giftNum: number
  giftMinted: number
  giftTotal: number
  giftAvatarLink: string
  model: string
  modelRare: number
  backdrop: string
  backdropRare: number
  symbol: string
  symbolRare: number
  floorPriceTon: number
  estimatedPriceTon: number
  saleData: any | null
  parameters: {
    symbol: ParameterInfo
    backdrop: ParameterInfo
    model: ParameterInfo
    collection: ParameterInfo
  }
}

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

export interface GiftSearchRequest {
  query?: string
  giftId?: number
  models?: string[]
  backdrops?: string[]
  symbols?: string[]
  rarities?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  limit?: number
  offset?: number
}

export interface GiftShortResponse {
  id: string
  name: string
  slug: string
  image: string
  price: number
  is_offchain: boolean
  is_premarket: boolean
  model: string
  backdrop: string
  symbol: string
}

export interface PagedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
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
  isOffchain: boolean
  attributes?: GiftAttribute[]
  marketStats?: MarketStat[]
  recentSales?: RecentSale[]
  estimatedPrice?: number
  ownerUsername?: string
}