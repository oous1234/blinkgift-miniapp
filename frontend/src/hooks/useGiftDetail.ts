import { useState, useCallback } from 'react';
import { Gift } from '../types/domain';
import { InventoryService } from '../services/inventory.service';
import { useUIStore } from '../store/useUIStore';

export const useGiftDetail = () => {
  const [gift, setGift] = useState<Gift | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const { openDetail } = useUIStore();

  const loadDetail = useCallback(async (slug: string, num: number) => {
    setIsLoading(true);
    openDetail();

    try {
      const data = await InventoryService.getGiftDetail(slug, num);
      setGift(data);

      setIsHistoryLoading(true);
      const blockchainData = await InventoryService.getBlockchainHistory(data.id);
      setHistory(blockchainData.history || []);
    } catch (e) {
      console.error("Failed to load gift detail:", e);
    } finally {
      setIsLoading(false);
      setIsHistoryLoading(false);
    }
  }, [openDetail]);

  const reset = useCallback(() => {
    setGift(null);
    setHistory([]);
  }, []);

  return { gift, history, isLoading, isHistoryLoading, loadDetail, reset };
};