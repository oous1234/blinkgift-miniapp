import { useState, useEffect, useCallback, useMemo } from 'react';
import { InventoryService } from '../services/inventory.service';
import { OwnerService } from '../services/owner.service';
import { Gift, UserProfile } from '../types/domain';
import { useTelegram } from './useTelegram';

export const usePortfolio = (targetOwnerId?: string, range: string = '30d') => {
  const { user } = useTelegram();
  const ownerId = targetOwnerId || String(user.id);

  const [items, setItems] = useState<Partial<Gift>[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const limit = 10;
      const offset = (page - 1) * limit;

      const [invData, historyData] = await Promise.all([
        InventoryService.getInventory(ownerId, limit, offset),
        OwnerService.getPortfolioHistory(ownerId, range)
      ]);

      setItems(invData.items);
      setTotal(invData.total);
      setHistory(historyData);
    } catch (e) {
      console.error("Failed to fetch portfolio:", e);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId, page, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const analytics = useMemo(() => {
    if (history.length < 2) return { current: 0, pnl: 0, percent: 0 };

    const first = history[0].average.ton;
    const last = history[history.length - 1].average.ton;
    const pnl = last - first;

    return {
      current: last,
      pnl,
      percent: first > 0 ? (pnl / first) * 100 : 0
    };
  }, [history]);

  return {
    items,
    total,
    page,
    setPage,
    history,
    analytics,
    isLoading,
    refresh: fetchData
  };
};