import { Platform } from "./domain";

export interface ApiPrice {
  ton: number;
  usd: number;
}

export interface ApiInventoryItem {
  slug: string;
  num: number;
  title: string;
  gift_id: string;
  is_offchain: boolean;
  gift_value?: {
    model_floor?: {
      average: ApiPrice;
    }
  };
}

export interface ApiDetailedGift {
  giftSlug: string;
  giftName: string;
  giftNum: number;
  giftAvatarLink: string;
  model: string;
  modelRare: number;
  backdrop: string;
  backdropRare: number;
  symbol: string;
  symbolRare: number;
  floorPriceTon: number;
  estimatedPriceTon: number;
  parameters: Record<string, {
    amount: number;
    floorPrice: number | null;
    lastTrades?: Array<{
      giftSlug: string;
      giftTonPrice: number;
      marketplace: Platform;
      date: string;
    }>;
  }>;
}

export interface ApiOwner {
  telegram_id: number;
  username?: string;
  name?: string;
  gifts_count: number;
  portfolio_value?: {
    average: ApiPrice;
  };
}

export interface ApiHistoryPoint {
  date: string;
  average: ApiPrice;
}