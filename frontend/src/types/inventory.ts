export interface GiftItem {
  id: string
  name: string
  collection: string
  image: string
  rarity: "Common" | "Rare" | "Legendary" | "Limited"
  floorPrice: number
  purchasePrice: number
  quantity: number
  background?: string
}

export interface InventoryResponse {
  items: GiftItem[]
}