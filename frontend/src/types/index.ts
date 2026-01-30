// Общие типы
export type Rarity = "Common" | "Rare" | "Legendary" | "Limited" | "NFT";

export interface PriceData {
  ton: number;
  usd: number;
}

// Подарки
export interface GiftAttribute {
  trait_type: string;
  value: string;
  rarity_percent: number;
}

export interface GiftItem {
  id: string;
  giftId: string;
  name: string;
  slug: string;
  image: string;
  num: number;
  rarity: string;
  floorPrice: number;
  estimatedPrice?: number;
  isOffchain: boolean;
  ownerUsername?: string;
  attributes?: GiftAttribute[];
}

// Рынок
export interface MarketplaceItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  marketplace: "getgems" | "portals";
}

// Аналитика и Владелец
export interface HistoryPoint {
  date: string;
  average: PriceData;
}

export interface OwnerProfile {
  id: string;
  username?: string;
  name?: string;
  avatarUrl?: string;
  giftsCount: number;
  portfolioValue: number;
}