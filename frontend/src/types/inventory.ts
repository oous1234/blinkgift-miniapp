// Тип данных, приходящий с бекенда (Raw DTO)
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

// Тип данных для использования в UI (адаптированный)
export interface GiftItem {
  id: string
  giftId: string
  name: string
  collection: string
  image: string
  rarity: "Common" | "Rare" | "Legendary" | "Limited"
  floorPrice: number
  quantity: number
  currency: "TON" | "USD"
}

export interface InventoryResponse {
  items: ApiGiftItem[]
}