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

export interface OwnerProfile {
  id?: string
  name?: string
  history?: HistoryPoint[]
  updated_at?: string
  portfolio_value?: PortfolioValue
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