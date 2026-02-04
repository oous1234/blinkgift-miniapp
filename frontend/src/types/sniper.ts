// src/types/sniper.ts

export interface SniperRule {
  id: string;
  giftName: string;
  models: string[];
  backdrops: string[];
  symbols: string[];
  rarities: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minProfitPercent: number | null;
  enabled: boolean;
}

export interface SniperEvent {
  id: string;
  name: string;
  model: string;
  backdrop: string;
  symbol: string;
  price: number;
  floorPrice?: number;
  marketplace: string;
  receivedAt: number;
  imageUrl: string;
  dealScore?: number;
}