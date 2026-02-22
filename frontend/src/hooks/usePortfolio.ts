// frontend/src/hooks/usePortfolio.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, ApiSyncState } from '../types/inventory';
import { useTelegram } from "../contexts/telegramContext";

export const usePortfolio = (targetOwnerId?: string) => {
  const { user } = useTelegram();

  const ownerId = targetOwnerId || String(user.id);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [syncState, setSyncState] = useState<ApiSyncState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const data = await InventoryService.getInventory(ownerId, 100, 0);
      setItems(data.items);
      setTotal(data.total);
      setSyncState(data.sync);
    } catch (e) {
      console.error("Failed to fetch inventory for:", ownerId, e);
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchData();
  }, [ownerId, fetchData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (syncState?.status === "IN_PROGRESS" || syncState?.status === "PENDING") {
      interval = setInterval(() => {
        fetchData(true);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [syncState?.status, fetchData]);

  const analytics = useMemo(() => {
    const totalValue = items.reduce((acc, item) => acc + (item.estimatedPrice || 0), 0);
    return {
      current: totalValue,
      percent: 0
    };
  }, [items]);

  return {
    items,
    total,
    syncState,
    analytics,
    isLoading,
    refresh: fetchData,
    isExternal: !!targetOwnerId && targetOwnerId !== String(user.id)
  };
};