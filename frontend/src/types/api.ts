export interface ApiPrice {
  ton: number
  usd: number
  nanoton?: string
}

export interface ApiPortfolioValue {
  portals: ApiPrice
  tonnel: ApiPrice
  getgems: ApiPrice
  telegram: ApiPrice
  average: ApiPrice
}

export interface ApiOwner {
  telegram_id: number
  username?: string
  name?: string
  gifts_count: number
  portfolio_value?: ApiPortfolioValue
  telegram_type?: string
}

export interface ApiGiftShort {
  id: string
  slug: string
  num: number
  title: string
  image?: string
  is_offchain: boolean
  gift_value?: {
    model_floor?: {
      average: ApiPrice
    }
  }
}

export interface ApiTradeItem {
  giftSlug: string
  giftTonPrice: number
  marketplace: string
  date: string
}

export interface ApiParameterInfo {
  amount: number
  floorPrice: number | null
  avg30dPrice: number
  dealsCount30d: number
  lastTrades: ApiTradeItem[]
}

export interface ApiDetailedGift {
  giftSlug: string
  giftName: string
  giftNum: number
  giftAvatarLink: string
  model: string
  modelRare: number
  backdrop: string
  backdropRare: number
  symbol: string
  symbolRare: number
  floorPriceTon: number
  estimatedPriceTon: number
  parameters: {
    symbol: ApiParameterInfo
    backdrop: ApiParameterInfo
    model: ApiParameterInfo
    collection: ApiParameterInfo
  }
}