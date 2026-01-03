import { JSONRecord } from "../infrastructure/superFetch";

export interface PriceData {
    nanoton: number;
    ton: number;
    usd: number;
}

export interface PortfolioValue {
    portals: PriceData;
    tonnel: PriceData;
    getgems: PriceData;
    telegram: PriceData;
    average: PriceData;
}

export interface PriceDetail {
    ton: number;
    usd: number;
}

export interface HistoryPoint {
    date: string;
    getgems: PriceDetail;
    portals: PriceDetail;
    telegram: PriceDetail;
    tonnel: PriceDetail;
    average: PriceDetail;
}

export interface PortfolioHistory {
    "12h": HistoryPoint[];
    "24h": HistoryPoint[];
    "7d": HistoryPoint[];
    "30d": HistoryPoint[];
}

export interface OwnerProfile {
    id: string;
    owner_type: string;
    telegram_type: string;
    telegram_id: number;
    username: string;
    usernames: string[];
    name: string;
    owner_address: string;
    updated_at: string;
    verified: boolean;
    pidorased: boolean;
    gifts_count: number;
    portfolio_value: PortfolioValue;
    portfolio_history: PortfolioHistory;
}