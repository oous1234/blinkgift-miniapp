export interface ApiPrice {
  ton: number;
  usd: number;
}

export interface ApiSyncStatus {
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  fullScanCompleted: boolean;
  totalItemsInTelegram: number;
  lastSyncAt: string | null;
}

export interface ApiInventoryResponse {
  items: ApiInventoryItem[];
  total: number;
  limit: number;
  offset: number;
  sync: ApiSyncStatus;
}

export interface ApiLastTrade {
  giftSlug: string;
  giftTonPrice: number;
  marketplace: string;
  date: string;
}

export interface ApiGiftParameter {
  amount: number;
  floorPrice: number | null;
  avg30dPrice: number;
  dealsCount30d: number;
  lastTrades: ApiLastTrade[];
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