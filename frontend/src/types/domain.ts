export type Platform = 'fragment' | 'getgems' | 'portals';

export interface PriceData {
  ton: number;
  usd: number;
}

export interface Attribute {
  label: string;
  value: string;
  rarity: number; // в процентах
}

export interface MarketStat {
  label: string;
  count: number;
  floor: number | null;
  avgPrice30d?: number;
}

export interface HistoryEvent {
  id: string;
  type: 'transfer' | 'mint' | 'sale' | 'listing' | 'cancel';
  price?: number;
  date: string;
  from?: string;
  to?: string;
  txHash?: string;
  platform?: string;
}

export interface Gift {
  id: string;
  name: string;
  slug: string;
  number: number;
  image: string;
  ownerUsername?: string;

  floorPrice: number;
  estimatedPrice: number;

  attributes: Attribute[];
  stats: MarketStat[];
  history: HistoryEvent[];

  isOffchain: boolean;
}

export interface UserProfile {
  id: string;
  username?: string;
  displayName: string;
  avatarUrl: string;
  giftsCount: number;
  portfolioValue: number;
  pnlPercent?: number;
}