export type Rarity = "Common" | "Rare" | "Legendary" | "Limited" | "NFT"

export interface GiftAttribute {
  trait_type: string
  value: string
  rarity_percent: number
}

export interface PriceData {
  ton: number
  usd: number
}

export interface BaseGift {
  id: string
  name: string
  image: string
  num: number
  isOffchain: boolean
}

export interface GiftItem extends BaseGift {
  rarity: string
  floorPrice: number
  estimatedPrice?: number
  ownerUsername?: string
  attributes?: GiftAttribute[]
}