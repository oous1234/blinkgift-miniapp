import { Platform } from "./domain";

export interface ApiPrice {
  ton: number;
  usd: number;
}

export interface ApiInventoryItem {
  id?: string;
  slug: string;
  num?: number;
  number?: number;
  title?: string;
  name?: string;
  image?: string;
  is_offchain?: boolean;
  price?: number;
  gift_value?: {
    model_floor?: {
      average: ApiPrice;
    };
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
  parameters: Record<string, ApiGiftParameter>;
}

export interface ApiGiftParameter {
  amount: number;
  floorPrice: number | null;
  lastTrades?: Array<ApiLastTrade>;
}

export interface ApiLastTrade {
  giftSlug: string;
  giftTonPrice: number;
  marketplace: Platform;
  date: string;
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

export interface ApiSearchResponse<T> {
  items: T[];
  total: number;
}

export interface ApiOwnerSearchResponse {
  owners: ApiOwner[];
}