export type Rarity = "Common" | "Rare" | "Legendary" | "NFT"

export interface AssetPrice {
  ton: number
  usd: number
}

export interface GiftAttribute {
  label: string
  value: string
  rarity: number
}

export interface MarketHistoryItem {
  id: string
  price: number
  date: string
  platform: string
  buyerName: string
  avatarUrl: string
  category: "model" | "backdrop" | "pattern"
}

export interface Gift {
  id: string
  slug: string
  number: number
  name: string
  image: string
  floorPrice: number
  estimatedPrice: number
  isOffchain: boolean
  attributes: GiftAttribute[]
  stats: GiftStat[]
  history: MarketHistoryItem[]
}

export interface GiftStat {
  type: string
  label: string
  count: number
  floor: number | null
}

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  giftsCount: number
  totalValue: number
  type: string
}