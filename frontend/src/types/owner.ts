import { JSONRecord } from "../infrastructure/superFetch";

export interface PriceDetail {
  ton: number;
  usd: number;
}

export interface HistoryPoint {
  date: string
  getgems: PriceDetail
  portals: PriceDetail
  telegram: PriceDetail
  tonnel: PriceDetail
  average: PriceDetail
}

export interface PortfolioHistoryResponse {
  range: string
  data: HistoryPoint[]
}

export interface PortfolioHistory {
  "12h"?: HistoryPoint[]
  "24h"?: HistoryPoint[]
  "7d"?: HistoryPoint[]
  "30d"?: HistoryPoint[]
}

// Обновленный интерфейс профиля, соответствующий ответу поиска
export interface OwnerProfile {
  id: string
  telegram_id?: number
  username?: string
  name?: string
  gifts_count?: number
  owner_address?: string
  owner_type?: string
  verification?: boolean
  updated_at?: string
  portfolio_value?: PortfolioValue
}

export interface OwnerSearchResponse {
  owners: OwnerProfile[]
  total: number
  limit: number
  offset: number
}

export interface PriceData {
  nanoton: number
  ton: number
  usd: number
}

export interface PortfolioValue {
  portals: PriceData
  tonnel: PriceData
  getgems: PriceData
  telegram: PriceData
  average: PriceData
}