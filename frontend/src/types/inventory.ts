// src/types/inventory.ts
export type SyncStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface ApiSyncState {
  status: SyncStatus;
  fullScanCompleted: boolean;
  totalItemsInTelegram: number;
  lastSyncAt: string | null;
}

export interface InventoryItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  serialNumber: number;
  model: string;
  backdrop: string;
  symbol: string;
  rarityPercent: number;
  estimatedPrice: number;
  acquiredAt: string;
}

export interface InventoryResponse {
  items: InventoryItem[];
  total: number;
  limit: number;
  offset: number;
  sync: ApiSyncState;
}